import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';

import {render, RenderPosition, remove, replace, removePopup, renderPopup} from '../utils/render.js';
import {UpdateType, UserAction, Mode} from '../const.js';


class Film {
  constructor(filmListContainer, changeData, changeMode) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.CLOSED;

    this._handleOpenClick = this._handleOpenClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._KeyDownHandler = this._KeyDownHandler.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._filmPopupComponent;

    this._filmComponent = new FilmCardView(film);
    this._filmPopupComponent = new FilmPopupView(film);

    this._filmComponent.setFilmClickHandler(this._handleOpenClick);
    this._filmPopupComponent.setFilmPopupClickHandler(this._handleCloseClick);

    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmPopupComponent.setEmojiClickHandler();
    this._filmPopupComponent.setUserCommentInputHandler();
    this._filmPopupComponent.setCommentDeleteHandler(this._handleDeleteCommentClick);

    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this._filmListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmComponent, prevFilmComponent);
    replace(this._filmPopupComponent, prevPopupComponent);

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
  }

  resetView() {
    if (this._mode !== Mode.CLOSED) {
      this._removePopup();
    }
  }

  _renderPopup() {
    document.addEventListener('keydown', this._KeyDownHandler);

    this._changeMode();

    renderPopup(this._filmPopupComponent);
    this._mode = Mode.OPENED;
  }

  _removePopup() {
    this._filmPopupComponent.reset(this._film);

    removePopup(this._filmPopupComponent);

    document.removeEventListener('keydown', this._KeyDownHandler);

    this._mode = Mode.CLOSED;

    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, Object.assign({}, this._film));
  }

  _KeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removePopup();
    }

    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
      evt.preventDefault();

      const film = this._filmPopupComponent.addComment();

      if (film) {
        this._changeData(
          UserAction.ADD_COMMENT,
          UpdateType.PATCH,
          film,
        );
      }
    }
  }

  _handleOpenClick() {
    this._renderPopup();
  }

  _handleCloseClick() {
    this._removePopup();
  }

  _checkMode() {
    return this._mode === Mode.OPENED ? UpdateType.PATCH : UpdateType.MINOR;
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      this._checkMode(),
      Object.assign(
        {},
        this._film,
        {
          isWatchlist: !this._film.isWatchlist,
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      this._checkMode(),
      Object.assign(
        {},
        this._film,
        {
          isWatched: !this._film.isWatched,
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      this._checkMode(),
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ),
    );
  }

  _handleDeleteCommentClick(film) {
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      film,
    );
  }
}

export {Film as default};
