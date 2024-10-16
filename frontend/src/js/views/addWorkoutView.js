import View from './view';

class AddWorkoutView extends View {
  _parentElement = document.querySelector('.workout__form');

  handleFormSubmit(handler) {
    this._parentElement.addEventListener('submit', function (e) {
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

export default new AddWorkoutView();
