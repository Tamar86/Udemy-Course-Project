import View from './view';
import icons from 'url:../../img/icons.svg';
import PreviewView from './previewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = ` No bookmarks yet. Find a nice recipe and bookmark it :)`;
  _message = ``;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(Bookmarks => PreviewView.render(Bookmarks, false))
      .join();
  }
}

export default new BookmarksView();
