import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {posters, titles, descriptions, directors, writers, actors, countries, genres, texts, emotions, authors} from './mock-data.js';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomFloat = (a = 5, b = 10, c = 1) => {
  const random = getRandomInteger(a, b) + Math.random();

  if (random > b) {
    return Math.floor(random).toFixed(c);
  }

  return random.toFixed(c);
};

const getRandomPoster = () => {
  return posters[getRandomInteger(0, posters.length - 1)];
};

const getRandomTitle = () => {
  return titles[getRandomInteger(0, titles.length - 1)];
};

const getRandomDescription = () => {
  let randomDescriptions = '';

  const randomCountDescriptions = getRandomInteger(1, 5);

  for (let i = 0; i <= randomCountDescriptions; i++) {
    randomDescriptions += descriptions[getRandomInteger(0, descriptions.length - 1)];
  }

  return randomDescriptions;
};

const getRandomDirector = () => {
  return directors[getRandomInteger(0, directors.length - 1)];
};

const getRandomWriters = () => {
  const randomWriters = [];

  for (let i = 1; i <= getRandomInteger(1, 3); i++) {
    randomWriters.push(writers[getRandomInteger(0, writers.length - 1)]);
  }

  const uniqWriters = new Set(randomWriters);

  return Array.from(uniqWriters).join(', ');
};

const getRandomActors = () => {
  const randomActors = [];

  for (let i = 1; i <= getRandomInteger(1, 3); i++) {
    randomActors.push(actors[getRandomInteger(0, actors.length - 1)]);
  }

  const uniqActors = new Set(randomActors);

  return Array.from(uniqActors).join(', ');
};

const getFilmDate = (from, to) => {
  const randomDate = new Date(getRandomInteger(from, to), getRandomInteger(1, 12), getRandomInteger(1, 28));

  return randomDate;
};

const getRandomCountry = () => {
  return countries[getRandomInteger(0, countries.length - 1)];
};

const getRandomGenre = () => {
  const randomGenres = [];

  for (let i = 1; i <= getRandomInteger(1, 3); i++) {
    randomGenres.push(genres[getRandomInteger(0, genres.length - 1)]);
  }

  const uniqGenres = new Set(randomGenres);

  return Array.from(uniqGenres);
};

const getRandomText = () => {
  return texts[getRandomInteger(0, texts.length - 1)];
};

const getRandomEmotion = () => {
  return emotions[getRandomInteger(0, emotions.length - 1)];
};

const getRandomAutors = () => {
  return authors[getRandomInteger(0, authors.length - 1)];
};

const getCommentDate = (formatDate) => {
  const randomDate = new Date(2021, 4, 20, getRandomInteger(0, 12), getRandomInteger(0, 59), getRandomInteger(0, 59));

  return dayjs(randomDate).format(formatDate);
};

const generateComment = () => {
  return {
    text: getRandomText(),
    emotion: getRandomEmotion(),
    author: getRandomAutors(),
    date: getCommentDate('YYYY/MM/DD hh:mm'),
  };
};

const getRandomComments = (count) => {
  return new Array(count).fill().map(generateComment);
};

const generateFilm = () => {
  return {
    id: nanoid(),
    poster: getRandomPoster(),
    title: getRandomTitle(),
    alternative_title: getRandomTitle(),
    rating: getRandomFloat(2, 10),
    age_rating: getRandomInteger(0, 18),
    director: getRandomDirector(),
    writers: getRandomWriters(),
    actors: getRandomActors(),
    description: getRandomDescription(),
    comments: getRandomComments(getRandomInteger(0, 5)),
    date: getFilmDate(1929, 1964),
    country: getRandomCountry(),
    runTime: getRandomInteger(15, 120),
    genres: getRandomGenre(),
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};

export {generateFilm};
