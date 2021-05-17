import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import {render, RenderPosition, removePopup, renderPopup} from '../utils/render.js';

class Film {
  constructor(filmListContainer) {
    this._filmListContainer = filmListContainer;

    this._filmComponent = null;
    this._filmPopupComponent = null;

    this._handleOpenClick = this._handleOpenClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;

    this._filmComponent = new FilmCardView(film);
    this._filmPopupComponent = new FilmPopupView(film);

    this._filmComponent.setFilmClickHandler(this._handleOpenClick);
    this._filmPopupComponent.setFilmPopupClickHandler(this._handleCloseClick);


    render(this._filmListContainer, this._filmComponent, RenderPosition.BEFOREEND);
  }

  _renderPopup() {
    renderPopup(this._filmPopupComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _removePopup() {
    removePopup(this._filmPopupComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removePopup();
    }
  }

  _handleOpenClick() {
    this._renderPopup();
  }

  _handleCloseClick() {
    this._removePopup();
  }
}

export {Film as default};
