import UserRankView from './view/user-rank.js';
import MoviesCounterView from './view/movies-counter.js';
import StatsView from './view/stats.js';

import {generateFilm} from './mock/film.js';
import {render, RenderPosition, remove} from './utils/render.js';

import BoardPresenter from './presenter/board.js';
import SiteMenuPresentor from './presenter/site-menu.js';

import MoviesModel from './model/movies.js';
import FilterModel from './model/filters.js';

import {MenuItem} from './const.js';

const FILMS_COUNT = 18;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
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

render(siteHeaderElement, new UserRankView(filters));
render(footerStatistics, new MoviesCounterView(films));

let statisticsComponent = null;

const changeMenuSection = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILTER:
      remove(statisticsComponent);
      boardPresenter.destroy();
      boardPresenter.init();
      break;
    case MenuItem.STATS:
      boardPresenter.destroy();
      statisticsComponent = new StatsView(moviesModel.getFilms());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const boardPresenter = new BoardPresenter(siteMainElement, moviesModel, filterModel);
const siteMenuPresentor = new SiteMenuPresentor(siteMainElement, filterModel, moviesModel, changeMenuSection);

siteMenuPresentor.init();
boardPresenter.init();
