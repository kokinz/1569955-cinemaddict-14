import dayjs from 'dayjs';

const createFilmCardTemplate = (film) => {
  const {title, rating, date, runTime, genres, poster, description, comments, isWatchlist, isWatched, isFavorite} = film;

  const getTimeFormat = (time) => {
    const hours = Math.floor(time / 60);
    const minutes = Math.floor(time % 60);

    let duration = '';

    if (hours > 0){
      duration += hours + 'h ' + minutes + 'm';
    } else {
      duration += minutes + 'm';
    }

    return duration;
  };

  const checkActiveControl = (value) => {
    if (value) {
      return 'film-card__controls-item--active';
    } else {
      return '';
    }
  };

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
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${checkActiveControl(isWatchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${checkActiveControl(isWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${checkActiveControl(isFavorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export {createFilmCardTemplate};
