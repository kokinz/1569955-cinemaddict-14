import MoviesCounterView from './view/movies-counter.js';
import StatsView from './view/stats.js';

import {generateFilm} from './mock/film.js';
import {render, RenderPosition, remove} from './utils/render.js';

import UserProfilePresenter from './presenter/profile.js';
import BoardPresenter from './presenter/board.js';
import SiteMenuPresentor from './presenter/site-menu.js';

import MoviesModel from './model/movies.js';
import FilterModel from './model/filters.js';

import {MenuItem} from './const.js';

const FILMS_COUNT = 18;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);

const moviesModel = new MoviesModel();
moviesModel.setFilms(films);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');

render(footerStatistics, new MoviesCounterView(moviesModel.getFilms()));

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

const userProfilePresenter = new UserProfilePresenter(siteHeaderElement, moviesModel);
const boardPresenter = new BoardPresenter(siteMainElement, moviesModel, filterModel);
const siteMenuPresentor = new SiteMenuPresentor(siteMainElement, filterModel, moviesModel, changeMenuSection);

userProfilePresenter.init();
siteMenuPresentor.init();
boardPresenter.init();
