import 'core-js/stable'; //for polifilling async await
import 'regenerator-runtime/runtime'; //for polifilling almost everything else
import { async } from 'regenerator-runtime';

import * as model from '../models/dashboardModel';
import metricsView from '../views/metricsView';
import workoutsView from '../views/workoutsView';
import workoutsPagination from '../views/workoutsPagination';
import mapView from '../views/mapView';
import addWorkoutView from '../views/addWorkoutView';
import userProfileView from '../views/userProfileView';

// if (module.hot) {
//   module.hot.accept();
// }

// TODO Implement remove workout functionality
// TODO Implement the delete button in the user data page
// TODO Implement workout filtering
// TODO Add a small marker that indicates a workout has a route
// FIXME Fix the bug where the goals are undefined when returned from the fitbit API

const updateUI = async function () {
  try {
    await model.getUserMetrics();
    await model.getUserWorkouts();
    metricsView.render(model.state);
    workoutsView.render(model.getSearchResultsPage(), true);
    workoutsPagination.render(model.state.workoutList);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const controlPageLoad = async function () {
  try {
    //we need to render a loading icon until data gets loaded
    metricsView.renderSpinner();
    workoutsView.renderSpinner();

    //get data asscoiated with user id
    await model.getUserData();
    document.title = `${model.state.user.fullName} | Healthify`;
    //display data related to the user details page
    await model.getUserProfileData();
    userProfileView.setWindowData(model.state.userProfile);
    userProfileView.setAvatar(model.state.userProfile.avatar);

    metricsView.renderWelcomeMessage(model.state.user.firstName);

    //display metrics
    await model.getUserMetrics();
    metricsView.render(model.state);

    //display recent workouts
    await model.getUserWorkouts();
    workoutsView.render(model.getSearchResultsPage(), true);
    workoutsPagination.render(model.state.workoutList);
  } catch (err) {
    metricsView.renderError(err.message);
    setTimeout(function () {
      window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    }, 1500);

    // console.log(err);
  }
};

const controlDateChange = async function (goToVal) {
  try {
    metricsView.renderSpinner();
    //change date in state
    model.changeDate(goToVal);
    //update UI with data for new date
    await updateUI();
  } catch (err) {
    metricsView.renderError(err.message);
    console.log(err);
  }
};

const controlWorkoutClick = async function (workoutId) {
  try {
    const workoutRouteData = await model.getWorkoutRoute(workoutId);
    mapView.displayWorkoutRoute(workoutRouteData);
  } catch (err) {
    metricsView.renderError(err.message);
    console.log(err);
  }
};

const controlWorkoutFormSubmit = async function (data) {
  try {
    //pass collected data to model to push the workout
    await model.pushWorkout(data);
    workoutsView.renderSpinner();
    metricsView.renderSpinner();
    await updateUI();
    metricsView.renderSuccessMessage('Workout added!');
  } catch (err) {
    metricsView.renderError(err.message);
    console.log(err);
  }
};

const controlPagination = function (goToVal) {
  workoutsView.render(model.getSearchResultsPage(goToVal), true);
  workoutsPagination.render(model.state.workoutList);
};

const logoutUser = function () {
  model.removeLoginToken();
  setTimeout(function () {
    window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  }, 1500);
};

const deleteUser = async function () {
  try {
    await model.deleteUser();
    metricsView.renderError('User deleted!');
    setTimeout(function () {
      window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    }, 1500);
  } catch (err) {
    metricsView.renderError('Error deleting user, please try again later!');
  }
};

const init = function () {
  //Publisher subscriber pattern
  metricsView.handlePageLoad(controlPageLoad);
  metricsView.handleDateChange(controlDateChange);
  workoutsView.handleWorkoutClick(controlWorkoutClick);
  workoutsPagination.handlePaginationClick(controlPagination);
  addWorkoutView.handleFormSubmit(controlWorkoutFormSubmit);
  userProfileView.handleLogoutClick(logoutUser);
  userProfileView.handleDeleteClick(deleteUser);
};

init();
