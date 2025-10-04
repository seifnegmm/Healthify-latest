import 'core-js/stable'; //for polifilling async await
import 'regenerator-runtime/runtime'; //for polifilling almost everything else

import * as model from '../models/dashboardModel';
import addWorkoutView from '../views/addWorkoutView';
import mapView from '../views/mapView';
import metricsView from '../views/metricsView';
import userProfileView from '../views/userProfileView';
import workoutsPagination from '../views/workoutsPagination';
import workoutsView from '../views/workoutsView';

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
    metricsView.renderSpinner();
    workoutsView.renderSpinner();

    await model.getUserData();
    document.title = `${model.state.user.fullName} | Healthify`;
    await model.getUserProfileData();
    userProfileView.setWindowData(model.state.userProfile);
    userProfileView.setAvatar(model.state.userProfile.avatar);

    metricsView.renderWelcomeMessage(model.state.user.firstName);

    await model.getUserMetrics();
    metricsView.render(model.state);

    await model.getUserWorkouts();
    workoutsView.render(model.getSearchResultsPage(), true);
    workoutsPagination.render(model.state.workoutList);
  } catch (err) {
    metricsView.renderError(err.message);
    console.log(err);
    // setTimeout(function () {
    //   window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    // }, 1500);
  }
};

const controlDateChange = async function (goToVal) {
  try {
    metricsView.renderSpinner();
    model.changeDate(goToVal);
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
  metricsView.handlePageLoad(controlPageLoad);
  metricsView.handleDateChange(controlDateChange);
  workoutsView.handleWorkoutClick(controlWorkoutClick);
  workoutsPagination.handlePaginationClick(controlPagination);
  addWorkoutView.handleFormSubmit(controlWorkoutFormSubmit);
  userProfileView.handleLogoutClick(logoutUser);
  userProfileView.handleDeleteClick(deleteUser);
};

init();
