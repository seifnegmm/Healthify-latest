import icons from 'url:../../img/icons.svg';

class ForgotPasswordView {
  #forgotPasswordForm = document.querySelector('.forgot_password__form');

  constructor() {}

  addHandlerSendResetEmail(handler) {
    this.#forgotPasswordForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      this.reset();
      const inputFields = this.querySelectorAll('input');
      inputFields.forEach(function (input) {
        input.blur();
      });

      handler(data);
    });
  }
}

export default new ForgotPasswordView();
