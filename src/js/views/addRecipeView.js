import View from './view';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  _successMessage = 'Recipe was successfully added.';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._btnOpenHandler();
    this._btnCloseHandler();
  }

  toggleModal() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _callHandlerWithData(event) {
    event.preventDefault();
    const data = [...new FormData(this)];
    handler(data);
  }

  _btnOpenHandler() {
    this._btnOpen.addEventListener('click', this.toggleModal.bind(this));
  }

  _btnCloseHandler() {
    this._btnClose.addEventListener('click', this.toggleModal.bind(this));
    this._overlay.addEventListener('click', this.toggleModal.bind(this));
  }

  _btnUploadHandler(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      {
        e.preventDefault();
        const data = [...new FormData(this)];
        const objectData = Object.fromEntries(data);
        handler(objectData);
      }
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
