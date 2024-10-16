import forgotPasswordView from '../views/forgotPasswordView';
import * as model from '../models/forgotPasswordModel';
import 'core-js/stable'; //for polifilling async await
import 'regenerator-runtime/runtime'; //for polifilling almost everything else
import { async } from 'regenerator-runtime';

if (module.hot) {
  module.hot.accept();
}

const controlForgotPasswordSubmit = async function (email) {
  try {
    model.sendResetEmail(email);
    window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  } catch (err) {}
};

const init = function () {
  forgotPasswordView.addHandlerSendResetEmail(controlForgotPasswordSubmit);
};

init();
