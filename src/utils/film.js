import dayjs from 'dayjs';

const getTimeFormat = (time) => {
  const hours = Math.floor(time / 60);
  const minutes = Math.floor(time % 60);

  return hours > 0 ? hours + 'h ' + minutes + 'm' : minutes + 'm';
};

const checkList = (value) => {
  return value ? true : false;
};

const sortFilmsByDate = (films) => films.slice().sort((filmA, filmB) => {
  return dayjs(filmB.date).diff(dayjs(filmA.date));
});

const sortFilmsByRating = (films) => films.slice().sort((filmA, filmB) => {
  return filmB.rating - filmA.rating;
});

const sortFilmsByComments = (films) => films.slice().sort((filmA, filmB) => {
  return filmB.comments.length - filmA.comments.length;
});

const getCommentsId = (comments) => {
  if (comments.length) {
    return comments.slice().map((comment) => {
      if (!comment.text || !comment.emotion || !comment.date || !comment.author) {
        return comment;
      }

      return comment.id;
    });
  }

  return [];
};

export {getTimeFormat, checkList, sortFilmsByDate, sortFilmsByRating, sortFilmsByComments, getCommentsId};
