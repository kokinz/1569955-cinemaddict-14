import dayjs from 'dayjs';

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
  const posters = [
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
  ];

  return posters[getRandomInteger(0, posters.length - 1)];
};

const getRandomTitle = () => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'The Great Flamarion',
    'Made for Each Other',
  ];

  return titles[getRandomInteger(0, titles.length - 1)];
};

const getRandomDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    'Cras aliquet varius magna, non porta ligula feugiat eget. ',
    'Fusce tristique felis at fermentum pharetra. ',
    'Aliquam id orci ut lectus varius viverra. ',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
    'Sed sed nisi sed augue convallis suscipit in sed felis. ',
    'Aliquam erat volutpat. ',
    'Nunc fermentum tortor ac porta dapibus. ',
    'In rutrum ac purus sit amet tempus. ',
  ];

  let randomDescriptions = '';

  const randomCountDescriptions = getRandomInteger(1, 5);

  for (let i = 0; i <= randomCountDescriptions; i++) {
    randomDescriptions += descriptions[getRandomInteger(0, descriptions.length - 1)];
  }

  return randomDescriptions;
};

const getRandomDirector = () => {
  const directors = [
    'Tom Ford',
    'Anthony Mann',
    'Steven Spielberg',
    'Martin Scorsese',
    'Alfred Hitchcock',
  ];

  return directors[getRandomInteger(0, directors.length - 1)];
};

const getRandomWriters = () => {
  const writers = [
    'Anne Wigton',
    'Heinz Herald',
    'Richard Weil',
    'Asghar Farhadi',
    'Eric Roth',
    'Aaron Sorkin',
  ];

  const randomWriters = [];

  for (let i = 1; i <= getRandomInteger(1, 3); i++) {
    randomWriters.push(writers[getRandomInteger(0, writers.length - 1)]);
  }

  const uniqWriters = new Set(randomWriters);

  return Array.from(uniqWriters).join(', ');
};

const getRandomActors = () => {
  const actors = [
    'Erich von Stroheim',
    'Mary Beth Hughes',
    'Dan Duryea',
    'Marlon Brando',
    'Jack Nicholson',
    'James Stewart',
    'Humphrey Bogart',
  ];

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
  const countries = [
    'USA',
    'Australia',
    'Canada',
    'Costa Rica',
    'France',
  ];

  return countries[getRandomInteger(0, countries.length - 1)];
};

const getRandomGenre = () => {
  const genres = [
    'Drama',
    'Film-Noir',
    'Mystery',
    'Cartoon',
    'Comedy',
    'Western',
    'Musical',
  ];

  const randomGenres = [];

  for (let i = 1; i <= getRandomInteger(1, 3); i++) {
    randomGenres.push(genres[getRandomInteger(0, genres.length - 1)]);
  }

  const uniqGenres = new Set(randomGenres);

  return Array.from(uniqGenres);
};

const getRandomText = () => {
  const texts = [
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?',
    'Great movie!',
  ];

  return texts[getRandomInteger(0, texts.length - 1)];
};

const getRandomEmotion = () => {
  const emotions = [
    'angry',
    'puke',
    'sleeping',
    'smile',
  ];

  return emotions[getRandomInteger(0, emotions.length - 1)];
};

const getRandomAutors = () => {
  const autors = [
    'John Doe',
    'Tim Macoveev',
    'Ilya O\'Reilly',
  ];

  return autors[getRandomInteger(0, autors.length - 1)];
};

const getCommentDate = (formatDate) => {
  const randomDate = new Date(2021, 3, getRandomInteger(1, 30), getRandomInteger(0, 23), getRandomInteger(0, 59));

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
