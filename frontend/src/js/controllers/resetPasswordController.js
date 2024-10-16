import resetPasswordView from '../views/resetPasswordView';
import * as model from '../models/resetPasswordModel';
import 'core-js/stable'; //for polifilling async await
import 'regenerator-runtime/runtime'; //for polifilling almost everything else
import { async } from 'regenerator-runtime';

if (module.hot) {
  module.hot.accept();
}

const controlResetPasswordSubmit = async function (password) {
  try {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const token = url.searchParams.get('token');

    model.resetPassword(password, token);
    window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  } catch (err) {}
};

const init = function () {
  resetPasswordView.addHandlerResetPassword(controlResetPasswordSubmit);
};

init();
