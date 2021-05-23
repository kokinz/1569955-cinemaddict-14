import {FilterType} from '../const';

const filter = {
  [FilterType.ALL]: (films) => films.length,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist).length,
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched).length,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite).length,
};

export {filter};
