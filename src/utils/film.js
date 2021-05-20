import dayjs from 'dayjs';

const getTimeFormat = (time) => {
  const hours = Math.floor(time / 60);
  const minutes = Math.floor(time % 60);

  return hours > 0 ? hours + 'h ' + minutes + 'm' : minutes + 'm';
};

const checkList = (value) => {
  return value ? true : false;
};

const sortFilmDate = (films) => films.slice().sort((filmA, filmB) => {
  return dayjs(filmB.date).diff(dayjs(filmA.date));
});

const sortFilmRating = (films) => films.slice().sort((filmA, filmB) => {
  return filmB.rating - filmA.rating;
});

export {getTimeFormat, checkList, sortFilmDate, sortFilmRating};
