import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';

import {render, RenderPosition, remove, replace, removePopup, renderPopup} from '../utils/render.js';
import {getCommentsId} from '../utils/film.js';
import {isOnline} from '../utils/common.js';
import {toast} from '../utils/toast';

import {UpdateType, UserAction, Mode} from '../const.js';


class Film {
  constructor(filmListContainer, changeData, changeMode, api, moviesModel) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._moviesModel = moviesModel;
    this._api = api;

    this._filmComponent = null;
    this._filmPopupComponent = null;

    this._filmCommentsClient = null;

    this._mode = Mode.CLOSED;

    this._setComments = this._setComments.bind(this);
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

    if (this._filmCommentsClient === null || this._filmCommentsClient.length !== this._film.comments.length) {
      this._filmCommentsClient = this._film.comments.slice();
    }

    if (this._filmCommentsClient !== null) {
      this._film.comments = this._filmCommentsClient.slice();
    }

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

    if (prevPopupComponent !== null) {
      renderPopup(this._filmPopupComponent);
    }

    replace(this._filmComponent, prevFilmComponent);
    replace(this._filmPopupComponent, prevPopupComponent);

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  resetPopupView() {
    this._filmPopupComponent.shake(() => {
      this._filmPopupComponent.updateData({
        isSaving: false,
        isDeleting: false,
      }, false);
      this._filmPopupComponent.updateElement();
    });
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
  }

  resetView() {
    if (this._mode !== Mode.CLOSED) {
      removePopup(this._filmPopupComponent);

      document.removeEventListener('keydown', this._KeyDownHandler);

      this._mode = Mode.CLOSED;
    }
  }

  _checkMode() {
    return this._mode === Mode.OPENED ? true : false;
  }

  _setComments() {
    this._api.getComments(this._film)
      .then((comments) => {
        this._filmCommentsClient = comments;
        this._film.comments = comments;

        this.init(this._film);
      });
  }

  _renderPopup() {
    this._changeMode();
    this._setComments();

    document.addEventListener('keydown', this._KeyDownHandler);

    renderPopup(this._filmPopupComponent);
    this._mode = Mode.OPENED;

    if (!isOnline()) {
      toast('You can\'t create comment OFFLINE');
      this._filmPopupComponent.shake();
      this._filmPopupComponent.updateData({
        isSaving: true,
      }, false);
      return;
    }
  }

  _removePopup() {
    removePopup(this._filmPopupComponent);

    document.removeEventListener('keydown', this._KeyDownHandler);

    this._mode = Mode.CLOSED;

    const comments = getCommentsId(this._film.comments).slice();

    this._changeData(
      UserAction.RENDER,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          comments: comments,
        },
      ));
  }

  _KeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removePopup();
    }

    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
      evt.preventDefault();

      if (!isOnline()) {
        toast('You can\'t create comment OFFLINE');
        this._filmPopupComponent.shake();
        this._filmPopupComponent.blockForm();
        return;
      }

      const comment = this._filmPopupComponent.addComment();

      if (comment) {
        this._changeData(
          UserAction.ADD_COMMENT,
          UpdateType.PATCH,
          comment,
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

  _handleWatchlistClick() {

    this._changeData(
      UserAction.UPDATE_FILM,
      this._checkMode() ? UpdateType.PATCH : UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isWatchlist: !this._film.isWatchlist,
          comments: getCommentsId(this._film.comments),
        },
      ),
    );
  }

  _handleWatchedClick() {

    this._changeData(
      UserAction.UPDATE_FILM,
      this._checkMode() ? UpdateType.PATCH : UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isWatched: !this._film.isWatched,
          comments: getCommentsId(this._film.comments),
        },
      ),
    );
  }

  _handleFavoriteClick() {

    this._changeData(
      UserAction.UPDATE_FILM,
      this._checkMode() ? UpdateType.PATCH : UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
          comments: getCommentsId(this._film.comments),
        },
      ),
    );
  }

  _handleDeleteCommentClick(data) {
    if (!isOnline()) {
      toast('You can\'t delete comment OFFLINE');
      this._filmPopupComponent.shake();
      return;
    }

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      data,
    );
  }

  setKeyDownHendler() {
    document.addEventListener('keydown', this._KeyDownHandler);
  }
}

export {Film as default};
