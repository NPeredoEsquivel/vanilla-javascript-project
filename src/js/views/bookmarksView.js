import View from './view';
import previewView from './previewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  addBookmarkLoadHander(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return `${this._data
      .map(bookmarkedRecipe => previewView.render(bookmarkedRecipe, false))
      .join('')}`;
  }
}

export default new BookmarksView();
