import icons from 'url:../../img/icons.svg';
import View from './view';

class UserProfileView extends View {
  _parentElement = document.querySelector('.user--settings-window');
  #window = document.querySelector('.user--settings-window');
  #overlay = document.querySelector('.overlay');
  #btnOpen = document.querySelector('.user__profile--btn');
  #btnClose = document.querySelector('.btn--close-modal');
  #profilePic = document.querySelector('.user__image');
  #btnLogout = document.querySelector('.user__logout--btn');
  #btnDelete = document.querySelector('.btn__delete-profile');

  constructor() {
    super();
    this.#addHandlerHideWindow();
    this.#addHandlerShowWindow();
  }

  setWindowData(user) {
    const html = `
      <div class="user__main--data">
        <img
          class="user__image--settings"
          src="${user.avatar}"
        />
        <div>
          <h2 class="user__display--name">${user.displayName}</h2>
          <h3 class="user__ID">#${user.ID}</h3>
        </div>
      </div>
      <div class="user__secondary--data">
        <div class="user__secondary--data-div">
          <p><span class="highlight">Full name | </span> ${user.fullName}</p>
          <p><span class="highlight">Gender | </span> ${user.gender}</p>
        </div>
        <div class="user__secondary--data-div">
          <p><span class="highlight">DOB | </span> ${user.dateOfBirth}</p>
          <p><span class="highlight">Age | </span> ${user.age}</p>
        </div>

        <div class="user__secondary--data-div">
          <p><span class="highlight">Weight | </span> ${user.weight}</p>
          <p><span class="highlight">Height | </span> ${user.height}</p>
        </div>
      </div>
  `;
    this.#btnClose.insertAdjacentHTML('afterend', html);
  }

  handleLogoutClick(handler) {
    this.#btnLogout.addEventListener('click', function (e) {
      e.preventDefault();
      handler();
    });
  }

  handleDeleteClick(handler) {
    this.#btnDelete.addEventListener('click', function (e) {
      handler();
    });
  }

  setAvatar(img) {
    this.#profilePic.src = img;
  }

  #toggleWindow(e) {
    e.preventDefault();
    this.#overlay.classList.toggle('hidden--window');
    this.#window.classList.toggle('hidden--window');
  }

  #addHandlerShowWindow() {
    this.#btnOpen.addEventListener('click', this.#toggleWindow.bind(this));
    this.#profilePic.addEventListener('click', this.#toggleWindow.bind(this));
  }

  #addHandlerHideWindow() {
    this.#btnClose.addEventListener('click', this.#toggleWindow.bind(this));
    this.#overlay.addEventListener('click', this.#toggleWindow.bind(this));
  }
}

export default new UserProfileView();
