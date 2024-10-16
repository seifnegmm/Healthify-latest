import icons from 'url:../../img/icons.svg';
import View from './view';

class WorkoutsView extends View {
  _parentElement = document.querySelector('.workouts-list');

  constructor() {
    super();
  }

  handleWorkoutClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clicked = e.target.closest('.workout');
      if (!clicked || clicked.dataset.gps === 'false') return;
      const id = clicked.dataset.logId;
      handler(id);
    });
  }

  #generateWorkoutCard(workout) {
    if (workout.name === 'Walk') {
      return `
      <div class="workout workout--walk" data-log-id = "${
        workout.workoutId
      }" data-gps = "${workout.hasGPS ? true : false}">
        <div class="workout-main">
            <h2 class="workout-type">Walking</h2>
            <h3 class="workout-date">${this.#setDate(workout.date)}</h3>
        </div>
        <ul class="workout-details">
            <li class="workout-detail workout-detail--duration">
            <svg>
                <use href="${icons}#time-icon"></use>
            </svg>
            <span class="workout-detail--duration--val">${this.#setWorkoutDuration(
              workout.duration
            )}</span>
            </li>
            <li class="workout-detail workout-detail--calories">
            <svg>
                <use href="${icons}#calories-icon"></use>
            </svg>
            <span class="workout-detail--calories--val">${
              workout.calories
            }</span>
            </li>
            <li class="workout-detail workout-detail--bpm">
            <svg>
                <use href="${icons}#heart-icon"></use>
            </svg>
            <span class="workout-detail--bpm--val">${
              workout.heartRate ? workout.heartRate : 'N/A'
            }</span>
            </li>

            <li class="workout-detail workout-detail--steps">
            <svg>
                <use href="${icons}#footsteps-icon"></use>
            </svg>
            <span class="workout-detail--steps--val">${workout.steps}</span>
            </li>
        </ul>
      </div>
      `;
    }
    if (workout.name === 'Bike') {
      return `
      <div class="workout workout--cycle ${
        workout.hasGPS ? 'workout--gps' : ''
      }" data-log-id = "${workout.workoutId}" data-gps = "${
        workout.hasGPS ? true : false
      }">
        <div class="workout-main">
            <h2 class="workout-type">Cycling</h2>
            <h3 class="workout-date">${this.#setDate(workout.date)}</h3>
        </div>

        <ul class="workout-details">
            <li class="workout-detail workout-detail--duration">
            <svg>
                <use href="${icons}#time-icon"></use>
            </svg>
            <span class="workout-detail--duration--val">${this.#setWorkoutDuration(
              workout.duration
            )}</span>
            </li>
            <li class="workout-detail workout-detail--calories">
            <svg>
                <use href="${icons}#calories-icon"></use>
            </svg>
            <span class="workout-detail--calories--val">${
              workout.calories
            }</span>
            </li>
            <li class="workout-detail workout-detail--bpm">
            <svg>
                <use href="${icons}#heart-icon"></use>
            </svg>
            <span class="workout-detail--bpm--val">${
              workout.heartRate ? workout.heartRate : 'N/A'
            }</span>
            </li>

            <li class="workout-detail workout-detail--distance">
            <svg>
                <use href="${icons}#distance-icon"></use>
            </svg>
            <span class="workout-detail--distance--val">${workout.distance.toFixed(
              2
            )}</span>
            </li>
        </ul>
        </div>
      `;
    }
    if (workout.name === 'Weights') {
      return `
      <div class="workout workout--lift" data-log-id = "${
        workout.workoutId
      }" data-gps = "${workout.hasGPS ? true : false}">
        <div class="workout-main">
            <h2 class="workout-type">Lifting</h2>
            <h3 class="workout-date">${this.#setDate(workout.date)}</h3>
        </div>

        <ul class="workout-details">
            <li class="workout-detail workout-detail--duration">
            <svg>
                <use href="${icons}#time-icon"></use>
            </svg>
            <span class="workout-detail--duration--val">${this.#setWorkoutDuration(
              workout.duration
            )}</span>
            </li>
            <li class="workout-detail workout-detail--calories">
            <svg>
                <use href="${icons}#calories-icon"></use>
            </svg>
            <span class="workout-detail--calories--val">${
              workout.calories
            }</span>
            </li>
            <li class="workout-detail workout-detail--bpm">
            <svg>
                <use href="${icons}#heart-icon"></use>
            </svg>
            <span class="workout-detail--bpm--val">${
              workout.heartRate ? workout.heartRate : 'N/A'
            }</span>
            </li>
        </ul>
        </div>
      `;
    }
    if (workout.name === 'Run') {
      return `
      <div class="workout workout--run  ${
        workout.hasGPS ? 'workout--gps' : ''
      }" data-log-id = "${workout.workoutId}" data-gps = "${
        workout.hasGPS ? true : false
      }">
        <div class="workout-main">
            <h2 class="workout-type">Running</h2>
            <h3 class="workout-date">${this.#setDate(workout.date)}</h3>
        </div>

        <ul class="workout-details">
            <li class="workout-detail workout-detail--duration">
            <svg>
                <use href="${icons}#time-icon"></use>
            </svg>
            <span class="workout-detail--duration--val">${this.#setWorkoutDuration(
              workout.duration
            )}</span>
            </li>
            <li class="workout-detail workout-detail--calories">
            <svg>
                <use href="${icons}#calories-icon"></use>
            </svg>
            <span class="workout-detail--calories--val">${
              workout.calories
            }</span>
            </li>
            <li class="workout-detail workout-detail--bpm">
            <svg>
                <use href="${icons}#heart-icon"></use>
            </svg>
            <span class="workout-detail--bpm--val">${
              workout.heartRate ? workout.heartRate : 'N/A'
            }</span>
            </li>

            <li class="workout-detail workout-detail--distance">
            <svg>
                <use href="${icons}#distance-icon"></use>
            </svg>
            <span class="workout-detail--distance--val">${workout.distance.toFixed(
              2
            )}</span>
            </li>
        </ul>
        </div>
      `;
    }
  }

  _generateHTML() {
    if (this._data.length == 0) {
      return `
      <div class="message__no-workout">
      <svg>
        <use href="${icons}#sad-icon"></use>
      </svg>
      <p>You have no workouts for this week!</p>
      </div>
      `;
    }
    return this._data
      .map(workout => this.#generateWorkoutCard(workout))
      .join('');
  }

  #setDate(date) {
    date = new Date(date);
    const locale = navigator.language;
    const options = {
      day: 'numeric',
      month: 'long',
    };
    const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);
    return formattedDate;
  }

  #setWorkoutDuration(duration) {
    duration = Math.round(duration / (1000 * 60));
    return duration;
  }
}

export default new WorkoutsView();
