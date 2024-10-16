import { getUserDataDB, updateUserDB, deleteUserDB } from '../api';
import {
  getJSON,
  putJSON,
  XMLToJSON,
  getFitbitRefreshAccessToken,
} from '../helpers';
import {
  API_FITBIT_URL,
  RES_PER_PAGE,
  SUPPORTED_WORKOUTS,
  ACCESS_TOKEN_EXPIRY_TIME,
} from '../config';
import { accessToken } from 'mapbox-gl';

export let state = {
  numOfReloads: 0,
  limit: 15,
  user: {},
  userProfile: {},
  date: {
    formattedDate: '',
    rawDate: '',
  },
  metrics: {
    goals: {},
    summary: {},
  },
  workoutList: {
    workouts: [],
    pagination: {
      page: 1,
      resultsPerPage: RES_PER_PAGE,
    },
  },
  workoutTypes: SUPPORTED_WORKOUTS,
};

export const getUserData = async function () {
  try {
    const token = JSON.parse(localStorage.getItem('JWTToken'));
    if (!token) {
      throw new Error('You are not logged in, please log in again!');
    }
    let { data } = await getUserDataDB(token);
    data = data.user;
    const accessTokenCreation = new Date(data.accessTokenCreationDate);

    if (checkAccessTokenExpiryDate(accessTokenCreation.getTime())) {
      const newAccessToken = await getNewAccessToken(data.refreshToken);
      const obj = {
        accessToken: newAccessToken.access_token,
        refreshToken: newAccessToken.refresh_token,
        accessTokenCreationDate: new Date().getTime(),
      };

      ({ data } = await updateUserDB(obj, token));
      data = data.user;
    }

    const user = {
      userID: data.userID,
      accessToken: data.accessToken,
      email: data.email,
      fullName: data.fullName,
      firstName: data.firstName,
      username: data.username,
    };

    state.user = user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * Function gets user metrics (Steps, Calories, Floors, Distance, Active Minutes)
 */
export const getUserMetrics = async function () {
  try {
    const url = `${API_FITBIT_URL}/${state.user.userID}/activities/date/${state.date.formattedDate}.json`;
    const data = await getJSON(url, state.user.accessToken);
    const { goals, summary } = data;

    const coorrectedSummary = {
      steps: summary.steps,
      caloriesOut: summary.caloriesOut,
      floors: summary.floors,
      distance: summary.distances[0].distance,
      activeMinutes:
        summary.fairlyActiveMinutes +
        summary.lightlyActiveMinutes +
        summary.veryActiveMinutes,
    };
    state.metrics.goals = goals;
    state.metrics.summary = coorrectedSummary;
  } catch (err) {
    throw err;
  }
};

/**
 * Function gets latest user workouts
 */
export const getUserWorkouts = async function () {
  try {
    const requestDate = new Date(state.date.formattedDate);
    requestDate.setDate(requestDate.getDate() - 7);
    const formattedDate = setFormattedDate(requestDate);
    const url = `${API_FITBIT_URL}/${state.user.userID}/activities/list.json?afterDate=${formattedDate}&sort=asc&offset=0&limit=${state.limit}`;
    let data = await getJSON(url, state.user.accessToken);
    data = data.activities;

    state.workoutList.workouts = data
      .filter(workout => state.workoutTypes.includes(workout.activityName))
      .map(workout => {
        return {
          workoutId: workout.logId,
          name: workout.activityName,
          date: workout.startTime,
          duration: workout.activeDuration,
          distance: workout.distance,
          calories: workout.calories,
          steps: workout.steps,
          heartRate: workout.averageHeartRate,
          hasGPS: workout?.source?.trackerFeatures.includes('GPS')
            ? true
            : false,
        };
      })
      .reverse();
    state.workoutList.pagination.page = 1;
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @param {Number} workoutId
 * @returns JSON containing workout coordinates (Latitude, Longitude)
 */
//function should return start point, end point, middle point and geojson file
export const getWorkoutRoute = async function (workoutId) {
  try {
    const url = `${API_FITBIT_URL}/${state.user.userID}/activities/${workoutId}.tcx`;
    const data = await getJSON(url, state.user.accessToken, true);
    convertedData = XMLToJSON(data);

    const coordsArrays =
      convertedData.TrainingCenterDatabase.Activities.Activity.Lap.Track.Trackpoint.map(
        el => {
          const { LatitudeDegrees, LongitudeDegrees } = el.Position;
          return [+LongitudeDegrees, +LatitudeDegrees];
        }
      );

    const startPoint = coordsArrays[0];
    const midPoint = coordsArrays[Math.floor(coordsArrays.length / 2)];
    const endPoint = coordsArrays[coordsArrays.length - 1];
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            coordinates: coordsArrays,
            type: 'LineString',
          },
        },
      ],
    };

    return {
      startPoint,
      midPoint,
      endPoint,
      geojson,
    };
  } catch (err) {
    throw err;
  }
};

export const pushWorkout = async function (data) {
  try {
    const formattedData = {
      activityId: +data.workoutType,
      startTime: data.workoutStartTime,
      durationMillis: +data.workoutDuration * 60 * 1000,
      date: data.workoutDate,
      distance: +(+data.workoutDistance).toFixed(2),
      calories: +data.workoutCalories,
    };

    const jsonString = JSON.stringify(formattedData);
    const contentLength = Buffer.byteLength(jsonString, 'utf8');

    const url = `${API_FITBIT_URL}/${state.user.userID}/activities.json?activityId=${formattedData.activityId}&manualCalories=${formattedData.calories}&startTime=${formattedData.startTime}&durationMillis=${formattedData.durationMillis}&date=${data.workoutDate}&distance=${formattedData.distance}`;
    await putJSON(url, state.user.accessToken, contentLength);
  } catch (err) {
    throw err;
  }
};

export const changeDate = function (changeVal) {
  const today = new Date();
  const date = new Date(state.date.rawDate);
  const newDate = new Date(date);
  if (changeVal === 1 && date.getDate() !== today.getDate())
    newDate.setDate(date.getDate() + 1);

  if (changeVal === -1) newDate.setDate(date.getDate() - 1);

  state.date.rawDate = newDate;
  state.date.formattedDate = setFormattedDate(newDate);
};

export const getSearchResultsPage = function (
  page = state.workoutList.pagination.page
) {
  state.workoutList.pagination.page = page;
  const start = (page - 1) * state.workoutList.pagination.resultsPerPage;
  const end = page * state.workoutList.pagination.resultsPerPage;
  return state.workoutList.workouts.slice(start, end);
};

export const getUserProfileData = async function () {
  try {
    const url = `${API_FITBIT_URL}/${state.user.userID}/profile.json`;
    const { user } = await getJSON(url, state.user.accessToken);
    const userProfile = {
      avatar: user.avatar,
      displayName: user.displayName,
      fullName: user.fullName,
      ID: user.encodedId,
      gender: user.gender,
      weight: user.weight,
      height: user.height,
      age: user.age,
      dateOfBirth: user.dateOfBirth,
    };
    state.userProfile = userProfile;
  } catch (err) {
    throw err;
  }
};

const getNewAccessToken = async function (refreshToken) {
  try {
    const data = await getFitbitRefreshAccessToken(refreshToken);
    return data;
  } catch (err) {
    throw err;
  }
};

const checkAccessTokenExpiryDate = function (accessTokenTime) {
  const now = new Date().getTime() / 1000;
  const timePassed = now - accessTokenTime / 1000;
  if (timePassed > ACCESS_TOKEN_EXPIRY_TIME) return true;
};

const setFormattedDate = function (date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export const deleteUser = async function () {
  try {
    const token = JSON.parse(localStorage.getItem('JWTToken'));
    if (!token) {
      throw new Error('You are not logged in, please log in again!');
    }
    await deleteUserDB(token);
    localStorage.removeItem('JWTToken');
  } catch (err) {
    throw err;
  }
};

export const removeLoginToken = function () {
  localStorage.removeItem('JWTToken');
};
const init = function () {
  state.date.rawDate = new Date();
  state.date.formattedDate = setFormattedDate(new Date());
};

init();
