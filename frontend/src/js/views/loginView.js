import icons from 'url:../../img/icons.svg';

class LoginView {
  #messageContainer = document.querySelector('.message__container');
  #loginForm = document.querySelector('.login__form');
  #signupForm = document.querySelector('.signup__form');
  #loginLink = document.querySelector('.login__link');
  #signupLink = document.querySelector('.signup__link');
  #forgotPasswordForm = document.querySelector('.forgot_password__form');

  constructor() {
    this.#loginLink.addEventListener('click', this.#changeView.bind(this));
    this.#signupLink.addEventListener('click', this.#changeView.bind(this));
  }

  addHandlerURLChange(handler) {
    const events = ['hashchange', 'popstate', 'load'];
    events.forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerLoginForm(handler) {
    this.#loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const username = this.querySelector('#login__view--username').value;
      const password = this.querySelector('#login__view--password').value;

      const credentials = {
        username,
        password,
      };

      this.querySelector('#login__view--username').value = '';
      this.querySelector('#login__view--password').value = '';
      this.querySelector('#login__view--password').blur();

      handler(credentials);
    });
  }

  addHandlerSignupForm(handler) {
    this.#signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const username = this.querySelector('#signup__view--username').value;
      const email = this.querySelector('#signup__view--email').value;
      const password = this.querySelector('#signup__view--password').value;

      const credentials = {
        username,
        email,
        password,
      };

      this.querySelector('#signup__view--username').value = '';
      this.querySelector('#signup__view--email').value = '';
      this.querySelector('#signup__view--password').value = '';
      this.querySelector('#signup__view--password').blur();

      handler(credentials);
    });
  }

  addHandlerSendResetEmail(handler) {
    this.#forgotPasswordForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArray = [...new FormData(this)];
      //converts an array of entries to an object
      const data = Object.fromEntries(dataArray);
      this.reset();
      const inputFields = this.querySelectorAll('input');
      inputFields.forEach(function (input) {
        input.blur();
      });

      console.log(data);
      handler(data);
    });
  }

  renderError(message) {
    const html = `    
    <div class="message__view message__view--err">
        <svg class="message__icon error__icon">
          <use href="${icons}#error-icon"></use>
        </svg>
        <span class="message error--message">${message}</span>
      </div>
    `;
    this.#messageContainer.innerHTML = '';
    this.#messageContainer.insertAdjacentHTML('afterbegin', html);
    this.#showMessage();
  }

  renderSuccess(message) {
    const html = `
    <div class="message__view message__view--success">
      <svg class="message__icon success__icon">
        <use href="${icons}#success-icon"></use>
      </svg>
      <span class="message success--message"
        >${message}</span>
    </div>
    `;
    this.#messageContainer.innerHTML = '';
    this.#messageContainer.insertAdjacentHTML('afterbegin', html);
    this.#showMessage();
  }

  #changeView(e) {
    e.preventDefault();
    this.#loginForm.closest('.view').classList.toggle('hidden');
    this.#signupForm.closest('.view').classList.toggle('hidden');
  }

  #showMessage() {
    setTimeout(function () {
      document.querySelector('.message__container').style.opacity = 1;
    }, 200);

    setTimeout(function () {
      document.querySelector('.message__container').style.opacity = 0;
    }, 1500);
  }
}

export default new LoginView();
