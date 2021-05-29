import Observer from '../utils/observer.js';

class Films extends Observer {
  constructor() {
    super();
    this._film = {};
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  setComments(comments, film) {
    this._film = film;
    this._film.comments = comments.map((comment) => ({...comment}));

    this._notify(this._film);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, data) {
    const id = data.id;
    this._film = data.film;

    this._films = [
      ...this._films.slice(0, id),
      this._film,
      ...this._films.slice(id + 1),
    ];

    this._notify(updateType, this._film);
  }

  addComment(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.film.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update.film,
      ...this._films.slice(index + 1),
    ];

    this._film = update.film;
    this._comments = update.comments;
    this._film.comments = this._comments.slice();

    this._notify(updateType, this._film);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        poster: film.film_info.poster,
        title: film.film_info.title,
        alternativeTitle: film.film_info.alternative_title,
        rating: film.film_info.total_rating,
        ageRating: film.film_info.age_rating,
        director: film.film_info.director,
        writers: film.film_info.writers,
        actors: film.film_info.actors,
        description: film.film_info.description,
        date: film.film_info.release.date,
        country: film.film_info.release.release_country,
        runTime: film.film_info.runtime,
        genres: film.film_info.genre,
        isWatchlist: film.user_details.watchlist,
        isWatched: film.user_details.already_watched,
        isFavorite: film.user_details.favorite,
        wathedDate: film.user_details.watching_date !== null ? film.user_details.watching_date : new Date().toISOString(),
      },
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptFilm = {
      'id': film.id,
      'comments': film.comments,
      'film_info':
        {
          'age_rating': film.ageRating,
          'alternative_title': film.alternativeTitle,
          'title': film.title,
          'genre': film.genres,
          'total_rating': film.rating,
          'runtime': film.runTime,
          'actors': film.actors,
          'writers': film.writers,
          'poster': film.poster,
          'director': film.director,
          'description': film.description,
          'release': {
            'date': film.date,
            'release_country': film.country,
          },
        },
      'user_details':
        {
          'favorite': film.isFavorite,
          'already_watched': film.isWatched,
          'watchlist': film.isWatchlist,
          'watching_date': film.wathedDate,
        },
    };

    return adaptFilm;
  }

  static adaptToClientComment(comment) {
    return {
      author: comment.author,
      id: comment.id,
      text: comment.comment,
      emotion: comment.emotion,
      date: comment.date,
    };
  }

  static adaptToServerComment(comment) {
    return {
      comment: comment.text,
      emotion: comment.emotion,
    };
  }
}

export {Films as default};
