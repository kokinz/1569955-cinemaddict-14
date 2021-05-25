import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const getRank = (films) => {
  const history = films.filter((film) => film.isWatched);

  if (history.length === 0) {
    return '';
  }

  if (history.length > 0 && history.length <= 10) {
    return 'Novice';
  }

  if (history.length > 10 && history.length <= 20) {
    return 'Fun';
  }

  if (history.length > 20) {
    return 'Movie Buff';
  }
};

const getTotalDuration = (films) => {
  const total = films
    .reduce((duration, film) => {
      return duration + film.runTime;
    }, 0);

  return {
    HOURS: Math.floor(total / 60),
    MINUTES: total % 60,
  };
};

const getGenresStats = (films) => {
  const genresStats = {};

  const allGenres = films.reduce((acc, film) => {
    return acc.concat(film.genres);
  }, []);

  allGenres.forEach((genre) => {
    if (genresStats[genre]) {
      genresStats[genre]++;
      return;
    }
    genresStats[genre] = 1;
  });

  return genresStats;
};

const getTopGenre = (films) => {
  if (films.length <= 0) {
    return '';
  }

  const genresStats = getGenresStats(films);
  const sortedGenres = Object.keys(genresStats).sort((a, b) => genresStats[b] - genresStats[a]);

  return sortedGenres[0];
};

const filterByDate = (films, filterType) => {
  return films.filter((film) => {
    const startDate = filterType === 'day' ? dayjs().startOf('day') : dayjs().startOf('day').subtract(1, filterType);

    return dayjs(film.wathedDate).isBetween(startDate, dayjs());
  });
};

export {updateItem, getRank, getTotalDuration, getGenresStats, getTopGenre, filterByDate};
