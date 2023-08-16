import View from './view';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query';

  _generateMarkup() {
    //he deleted preview__link--active and the svg
    return `${this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('')}`;
  }
}

export default new ResultsView();
