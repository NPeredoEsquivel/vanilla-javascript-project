import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _errorMessage = ' ';

  _generateMarkup() {
    const totalPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const page = this._data.page;
    if (page === 1 && totalPages > 1) {
      return this._buttonMarkup(page + 1, 'right');
    }

    if (page < totalPages) {
      return `
        ${this._buttonMarkup(page - 1, 'left')}
        ${this._buttonMarkup(page + 1, 'right')}
      `;
    }

    if (page === totalPages && totalPages > 1) {
      return this._buttonMarkup(page - 1, 'left');
    }

    return ``;
  }

  addClickHandler(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline ');
      if (!btn) return;
      const page = +btn.dataset.goto;
      handler(page);
    });
  }

  _buttonMarkup = (page, buttonType) => {
    if (buttonType === 'left') {
      return `
        <button data-goto="${page}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page}</span>
        </button>
      `;
    } else {
      return `
        <button data-goto="${page}" class="btn--inline pagination__btn--next">
            <span>Page ${page}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }
  };
}

export default new PaginationView();
