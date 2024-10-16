import icons from 'url:../../img/icons.svg';

export default class View {
  _parentElement;
  _data;
  _successMessage;
  _welcomeMessage;
  _errorMessage;
  _messageContainer = document.querySelector('.message__container');

  render(data, isWorkout = false) {
    if ((!data || (Array.isArray(data) && data.length === 0)) && !isWorkout)
      return this.renderError();
    this._data = data;
    const html = this._generateHTML();

    this.#clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  handlePageLoad(handler) {
    const events = ['hashchange', 'popstate', 'load'];
    events.forEach(ev => window.addEventListener(ev, handler));
  }

  renderError(message = this._errorMessage) {
    const html = `   
    <div class="message__view message__view--err">
        <svg class="message__icon error__icon">
            <use href="${icons}#error-icon"></use>
        </svg>
        <span class="message error--message">${message}</span>
    </div>  
    `;

    this._messageContainer.innerHTML = '';
    this._messageContainer.insertAdjacentHTML('afterbegin', html);
    this.#showMessage();
  }

  renderWelcomeMessage(username) {
    const html = `
    <div class="message__view message__view--welcome">
        <svg class="message__icon happy__icon">
            <use href="${icons}#happy-icon"></use>
        </svg>
        <span class="message welcome--message">Welcome back ${username}!</span>
    </div>
    `;
    this._messageContainer.innerHTML = '';
    this._messageContainer.insertAdjacentHTML('afterbegin', html);
    this.#showMessage();
  }

  renderSuccessMessage(message = this._successMessage) {
    const html = `
    <div class="message__view message__view--welcome">
        <svg class="message__icon happy__icon">
            <use href="${icons}#success-icon"></use>
        </svg>
        <span class="message welcome--message">${message}</span>
    </div>
    `;
    this._messageContainer.innerHTML = '';
    this._messageContainer.insertAdjacentHTML('afterbegin', html);
    this.#showMessage();
  }

  renderSpinner = function () {
    const html = `
     <div class="spinner">
      <svg>
          <use href="${icons}#icon-loader"></use>
      </svg>
    </div>                            
          `;
    this.#clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  };

  #showMessage() {
    setTimeout(function () {
      document.querySelector('.message__container').style.opacity = 1;
    }, 200);

    setTimeout(function () {
      document.querySelector('.message__container').style.opacity = 0;
    }, 1500);
  }

  #clear() {
    this._parentElement.innerHTML = '';
  }
}
