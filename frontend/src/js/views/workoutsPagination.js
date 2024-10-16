import icons from 'url:../../img/icons.svg';
import View from './view';

class WorkoutsPagination extends View {
  _parentElement = document.querySelector('.workouts-pagination');

  constructor() {
    super();
  }

  _generateHTML() {
    const currentPage = this._data.pagination.page;
    const numPages = Math.ceil(
      this._data.workouts.length / this._data.pagination.resultsPerPage
    );

    //Page 1 and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
        <button class="pagination__btn pagination__btn--next" data-go-to = "${
          currentPage + 1
        }">
            <span>${currentPage + 1}</span>
            <svg>
            <use href="${icons}#right-arrow-pagination-icon"></use>
            </svg>
        </button>
        `;
    }

    //Last Page
    if (currentPage === numPages && numPages > 1) {
      return `
        <button class="pagination__btn pagination__btn--prev" data-go-to = "${
          currentPage - 1
        }" >
            <svg>
            <use href="${icons}#left-arrow-pagination-icon"></use>
            </svg>
            <span>${currentPage - 1}</span>
        </button>
        `;
    }

    //Other page
    if (currentPage < numPages) {
      return `
          <button class="pagination__btn pagination__btn--prev" data-go-to = "${
            currentPage - 1
          }" >
              <svg>
              <use href="${icons}#left-arrow-pagination-icon"></use>
              </svg>
              <span>${currentPage - 1}</span>
          </button>
          <button class="pagination__btn pagination__btn--next" data-go-to = "${
            currentPage + 1
          }">
                <span>${currentPage + 1}</span>
                <svg>
                <use href="${icons}#right-arrow-pagination-icon"></use>
                </svg>
            </button>
        `;
    }

    //Page 1, and there are no other pages
    return '';
  }

  handlePaginationClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.pagination__btn');
      if (!btn) return;
      const goToPage = +btn.dataset.goTo;
      handler(goToPage);
    });
  }
}

export default new WorkoutsPagination();
