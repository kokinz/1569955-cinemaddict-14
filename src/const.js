const DESCRIPTION_LENGTH = 140;

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const SortType = {
  DEFAULT: 'default',
  DATE_DESC: 'date-descending',
  RATING_DESC: 'rating-descending',
};

const EmojiType = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const Mode = {
  OPENED: 'OPENED',
  CLOSED: 'CLOSED',
};

const MenuItem = {
  FILTER: 'FILTER',
  STATS: 'STATS',
};

const StatsFilter = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export {FilterType, SortType, DESCRIPTION_LENGTH, EmojiType, UpdateType, Mode, UserAction, MenuItem, StatsFilter};
