import dayjs from 'dayjs';
import AbstractView from './abstract.js';
import {getTimeFormat, checkList} from '../utils/film.js';

const createFilmCardTemplate = (film) => {
  const {title, rating, date, runTime, genres, poster, description, comments, isWatchlist, isWatched, isFavorite} = film;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(date).format('YYYY')}</span>
      <span class="film-card__duration">${getTimeFormat(runTime)}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${checkList(isWatchlist) ? 'film-card__controls-item--active' : ' '}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${checkList(isWatched) ? 'film-card__controls-item--active' : ' '}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${checkList(isFavorite) ? 'film-card__controls-item--active' : ' '}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._filmClickHandler = this._filmClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _filmClickHandler(evt) {
    evt.preventDefault();

    this._callback.filmClick();
  }

  setFilmClickHandler(callback) {
    this._callback.filmClick = callback;

    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._filmClickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._filmClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._filmClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }
}

export {FilmCard as default};
