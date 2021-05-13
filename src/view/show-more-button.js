import AbstractView from './abstract.js';

const createShowMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">
    Show more
  </button>`;
};

class ShowMore extends AbstractView {
  constructor() {
    super();

    this._showMoreClickHandler = this._showMoreClickHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _showMoreClickHandler(evt) {
    evt.preventDefault();

    this._callback.showMoreClick();
  }

  setShowMoreClickHandler(callback) {
    this._callback.showMoreClick = callback;

    this.getElement().addEventListener('click', this._showMoreClickHandler);
  }
}

export {ShowMore as default};
