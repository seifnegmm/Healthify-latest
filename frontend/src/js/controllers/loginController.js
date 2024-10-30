import loginView from '../views/loginView.js';
import * as model from '../models/loginModel.js';
import 'core-js/stable'; // for polyfilling async/await
import 'regenerator-runtime/runtime'; // for polyfilling other features

if (module.hot) {
  module.hot.accept('./views/loginView.js', () => {
    console.log('Login View module updated!');
  });
}

const controlLoginPageLoad = async function () {
  try {
    const pathName = window.location.pathname;
    const url = window.location.href;
    model.getAuthCode(url);

    if (pathName !== '/signup/') {
      return;
    }

    await model.getAccessToken();
    loginView.renderSuccess('Account created successfully!');
    model.goToMainURL();
  } catch (err) {
    loginView.renderError(err.message);
    model.goToMainURL();
  }
};

const controlLoginFormSubmit = async function (credentials) {
  try {
    await model.checkLoginCredentials(credentials);
    window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/dashboard.html`;
  } catch (err) {
    console.log(err);
    loginView.renderError(err.message);
  }
};

const controlSignupFormSubmit = async function (credentials) {
  try {
    await model.getFirstStepVerification(credentials);
    const redirectUrl = model.getRedirectUrl();
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
  } catch (err) {
    console.error(err);
    loginView.renderError(
      'There was a problem creating your account: ' +
        err.message +
        '. Please try again later!'
    );
  }
};

const init = function () {
  loginView.addHandlerURLChange(controlLoginPageLoad);
  loginView.addHandlerLoginForm(controlLoginFormSubmit);
  loginView.addHandlerSignupForm(controlSignupFormSubmit);
};

init();
