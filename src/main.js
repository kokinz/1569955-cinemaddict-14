import UserRankView from './view/user-rank.js';
import MoviesCounterView from './view/movies-counter.js';

import {generateFilm} from './mock/film.js';
// import {generateFilters} from './mock/filters.js';
import {render} from './utils/render.js';

import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';

import MoviesModel from './model/movies.js';
import FilterModel from './model/filters.js';

const FILMS_COUNT = 23;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
// const filters = generateFilters(films);
const filters = [
  {
    type: 'all',
    name: 'All',
    count: 23,
  },
  {
    type: 'watchlist',
    name: 'Watchlist',
    count: 13,
  },
  {
    type: 'history',
    name: 'History',
    count: 4,
  },
  {
    type: 'favorites',
    name: 'Favorites',
    count: 8,
  },
];

const moviesModel = new MoviesModel();
moviesModel.setFilms(films);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');

// const boardPresenter = new BoardPresenter(siteMainElement, moviesModel);

render(siteHeaderElement, new UserRankView(filters));
// render(siteMainElement, new SiteMenuView(filters, 'all'), RenderPosition.AFTERBEGIN);
render(footerStatistics, new MoviesCounterView(films));

const boardPresenter = new BoardPresenter(siteMainElement, moviesModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);

filterPresenter.init();
boardPresenter.init();
