import icons from 'url:../../img/icons.svg';
import View from './view';

class MetricsView extends View {
  _parentElement = document.querySelector('.container__main-health-data');
  #dateContainer = document.querySelector('.container__date-picker');
  #rootStyle = document.documentElement.style;

  constructor() {
    super();
  }

  handleDateChange(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clicked = e.target.closest('.icon__date-picker');
      if (!clicked) return;
      const goToVal = +clicked.dataset.goTo;
      handler(goToVal);
    });
  }

  _generateHTML() {
    const { summary, goals } = this._data.metrics;
    const steps = this.#setMeter(summary.steps, goals.steps);
    const distance = this.#setMeter(summary.distance, goals.distance);
    const calories = this.#setMeter(summary.caloriesOut, goals.caloriesOut);
    const floors = this.#setMeter(summary.floors, goals.floors);
    const activeMinutes = this.#setMeter(
      summary.activeMinutes,
      goals.activeMinutes
    );
    this.#rootStyle.setProperty('--steps', `${steps}`);
    this.#rootStyle.setProperty('--distance', `${distance}`);
    this.#rootStyle.setProperty('--calories', `${calories}`);
    this.#rootStyle.setProperty('--floors', `${floors}`);
    this.#rootStyle.setProperty('--active', `${activeMinutes}`);
    return `
    <div class="container--data">
      <div class="container__steps-metrics">
        <div class="container__date-picker">
          ${this.#setDate(this._data.date.rawDate)}
        </div>
        <div class="circular__bar circular__bar-steps">
          <div class="percent steps__percent">
            <div class="dot steps__dot"></div>
            <svg class="circle__icon circle__icon-steps">
              <circle cx="95" cy="95" r="90"></circle>
              <circle cx="95" cy="95" r="90"></circle>
            </svg>
            <div class="content content__footsteps">
              <div class="details steps__details">
                <span class="steps__number">${summary.steps}</span>
                <span>steps</span>
              </div>
              <svg class="metrics__icon footsteps__icon">
                <use href="${icons}#footsteps-icon"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="container__other-metrics">
        <div class="metrics calories--metrics">
          <div class="circular__bar circular__bar-other">
            <div class="percent others__percent">
              <div class="dot others__dot calories__dot"></div>
              <svg
                class="circle__icon circle__icon-others circle__icon-calories"
              >
                <circle cx="70" cy="70" r="70"></circle>
                <circle cx="70" cy="70" r="70"></circle>
              </svg>
              <div class="content content__calories">
                <div class="details calories__details others__details">
                  <span class="calories__number others__number">${
                    summary.caloriesOut
                  }</span>
                  <span>cals</span>
                </div>
                <svg class="metrics__icon others__icon calories__icon">
                  <use href="${icons}#calories-icon"></use>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="metrics distance__metrics">
          <div class="metrics distance--metrics">
            <div class="circular__bar circular__bar-other">
              <div class="percent others__percent">
                <div class="dot others__dot distance__dot"></div>
                <svg
                  class="circle__icon circle__icon-others circle__icon-distance"
                >
                  <circle cx="70" cy="70" r="70"></circle>
                  <circle cx="70" cy="70" r="70"></circle>
                </svg>
                <div class="content content__distance">
                  <div class="details distance__details others__details">
                    <span class="distance__number others__number">${summary.distance.toFixed(
                      2
                    )}</span>
                    <span>km</span>
                  </div>
                  <svg class="metrics__icon others__icon distance__icon">
                    <use href="${icons}#distance-icon"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="metrics floors-climbed__metrics">
          <div class="metrics floors-climbed--metrics">
            <div class="circular__bar circular__bar-other">
              <div class="percent others__percent">
                <div class="dot others__dot floors-climbed__dot"></div>
                <svg
                  class="circle__icon circle__icon-others circle__icon-floors-climbed"
                >
                  <circle cx="70" cy="70" r="70"></circle>
                  <circle cx="70" cy="70" r="70"></circle>
                </svg>
                <div class="content content__floors-climbed">
                  <div class="details floors__details others__details">
                    <span class="floors__number others__number">${
                      summary.floors
                    }</span>
                    <span>floors</span>
                  </div>
                  <svg
                    class="metrics__icon others__icon floors-climbed__icon"
                  >
                    <use href="${icons}#stairs-icon"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="metrics active--mins__metrics">
          <div class="metrics active-mins--metrics">
            <div class="circular__bar circular__bar-other">
              <div class="percent others__percent">
                <div class="dot others__dot active__dot"></div>
                <svg
                  class="circle__icon circle__icon-others circle__icon-active"
                >
                  <circle cx="70" cy="70" r="70"></circle>
                  <circle cx="70" cy="70" r="70"></circle>
                </svg>
                <div class="content content__active-mins">
                  <div
                    class="details active-mins__details others__details"
                  >
                    <span class="active-mins__number others__number"
                      >${summary.activeMinutes}</span
                    >
                    <span>active mins</span>
                  </div>
                  <svg
                    class="metrics__icon others__icon active-mins__icon"
                  >
                    <use href="${icons}#energy-icon"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  #setDate(date) {
    const dateContainer = this._parentElement.querySelector(
      '.container__date-picker'
    );
    //format date according to the user's locale
    const locale = navigator.language;
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);
    return `
    <svg class="icon__date-picker icon__date-picker--left" data-go-to="-1">
      <use href="${icons}#left-arrow-icon"></use>
    </svg>
    
    <svg class="icon__date-picker icon__date-picker--right" data-go-to="1">
      <use href="${icons}#right-arrow-icon"></use>
    </svg>
    <span class="date">${formattedDate}</span>
    `;
  }

  #setMeter(summary, goals) {
    const value = (summary / goals) * 100;
    return value > 100 ? 100 : value;
  }
}

export default new MetricsView();
