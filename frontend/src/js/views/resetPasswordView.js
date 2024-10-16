import icons from 'url:../../img/icons.svg';

class ResetPasswordView {
  #resetPasswordForm = document.querySelector('.reset_password__form');

  constructor() {}

  addHandlerResetPassword(handler) {
    this.#resetPasswordForm.addEventListener('submit', function (e) {
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

export default new ResetPasswordView();
