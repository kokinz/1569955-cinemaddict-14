import dayjs from 'dayjs';
import he from 'he';
import relativeTime  from 'dayjs/plugin/relativeTime';
import SmartView  from './smart.js';
import {getTimeFormat, checkList} from '../utils/film.js';
import {EmojiType} from '../const.js';

dayjs.extend(relativeTime);

const createFilmPopupTemplate = (film) => {
  const {title, alternative_title, rating, age_rating, director, writers, actors, date, runTime, country, genres, poster, description, comments, isWatchlist, isWatched, isFavorite} = film;

  const commentsCount = comments.length;

  const renderGenres = () => {
    return genres.map((genre) => {
      return `<span class="film-details__genre">${genre}</span>`;
    }).join(' ');
  };

  const renderComments = () => {
    return comments.map((comment) => {
      if (!comment.text || !comment.emotion || !comment.date || !comment.author) {
        return;
      }

      return `<li class="film-details__comment" data-id="${comment.id}">
        <span class="film-details__comment-emoji">
          ${comment.emotion ? `<img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">` : ''}
        </span>
        <div>
          <p class="film-details__comment-text">${comment.text ? he.encode(comment.text) : ''}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author ? comment.author : ''}</span>
            <span class="film-details__comment-day">${comment.date ? dayjs(comment.date).fromNow() : ''}</span>
            <button class="film-details__comment-delete"${film.isDeleting ? 'disabled' : ''}>${film.isDeleting ? 'deleting...' : 'delete'}</button>
          </p>
        </div>
      </li>`;
    }).join(' ');
  };

  return `<section class="film-details" data-id="${film.id}">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${age_rating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternative_title}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${dayjs(date).format('DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getTimeFormat(runTime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">${renderGenres()}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${checkList(isWatchlist) ? 'checked' : ' '}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${checkList(isWatched) ? 'checked' : ' '}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${checkList(isFavorite) ? 'checked' : ' '}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

          ${comments ? `<ul class="film-details__comments-list">${renderComments()}</ul>` : '<p>Loading</p>'}

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${film.userEmoji ? `<img src="images/emoji/${film.userEmoji}.png" width="55" height="55" alt="emoji-${film.userEmoji}">` : ' '}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${film.isSaving ? 'disabled' : ''}>${film.userComment ? he.encode(film.userComment) : ''}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${film.userEmoji === EmojiType.SMILE ? 'checked' : ' '}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${film.userEmoji === EmojiType.SLEEPING ? 'checked' : ' '}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${film.userEmoji === EmojiType.PUKE ? 'checked' : ' '}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${film.userEmoji === EmojiType.ANGRY ? 'checked' : ' '}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

class FilmPopup extends SmartView {
  constructor(film) {
    super();
    this._data = FilmPopup.parseFilmToData(film);

    this._filmPopupClickHandler = this._filmPopupClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._userCommentInputHandler = this._userCommentInputHandler.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
    this.addComment = this.addComment.bind(this);
  }

  // get(commentId) {
  //   return this.getElement().querySelector(`[id = "${commentId}"`).querySelector('.film-details__comment-delete');
  // }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      userEmoji: evt.target.value,
    }, false);
  }

  _userCommentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      userComment: evt.target.value,
    }, true);
  }

  reset(film) {
    this.updateData(
      FilmPopup.parseFilmToData(film),
    );
  }

  getTemplate() {
    return createFilmPopupTemplate(this._data);
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

  _filmPopupClickHandler(evt) {
    evt.preventDefault();

    this._callback.popupClick();
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();

    if (evt.target.matches('.film-details__comment-delete')) {
      const id = evt.target.closest('.film-details__comment').dataset.id;

      const comments = this._data.comments.filter((item) => item.id !== id);

      this.updateData({
        isDeleting: true,
      }, false);

      const film = Object.assign({}, FilmPopup.parseDataToFIlm(this._data));

      film.comments = comments.slice();

      const data = {
        id,
        film,
      };

      this._callback.commentDelete(data);
    }
  }

  addComment() {
    const newComment = {
      filmId: this._data.id,
      text: this._data.userComment,
      emotion: this._data.userEmoji,
    };

    if (newComment.text !== '' && newComment.text !== null && newComment.emotion !== null && !this._data.isSaving) {

      this.updateData({
        isSaving: true,
        prevUserComment: this._data.userComment,
      }, false);

      return newComment;
    }

    return null;
  }

  setFilmPopupClickHandler(callback) {
    this._callback.popupClick = callback;

    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._filmPopupClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-label--watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-details__control-label--watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-label--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setEmojiClickHandler() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('input', this._emojiClickHandler);
  }

  setUserCommentInputHandler() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._userCommentInputHandler);
  }

  setCommentDeleteHandler(callback) {
    this._callback.commentDelete = callback;
    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._commentDeleteHandler);
  }

  restoreHandlers() {
    this.setFilmPopupClickHandler(this._callback.popupClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setEmojiClickHandler();
    this.setUserCommentInputHandler();
    if (this._data.comments) {
      this.setCommentDeleteHandler(this._callback.commentDelete);
    }
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        userEmoji: null,
        userComment: null,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToFIlm(data) {
    data = Object.assign({}, data);

    delete data.userEmoji;
    delete data.userComment;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}

export {FilmPopup as default};
