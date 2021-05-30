import MoviesCounterView from './view/movies-counter.js';
import StatsView from './view/stats.js';

import {MenuItem, UpdateType} from './const.js';

import {render, RenderPosition, remove} from './utils/render.js';
import {toast} from './utils/toast.js';

import UserProfilePresenter from './presenter/profile.js';
import BoardPresenter from './presenter/board.js';
import SiteMenuPresentor from './presenter/site-menu.js';

import MoviesModel from './model/movies.js';
import FilterModel from './model/filters.js';

import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = 'Basic re48aasl34cl2js83';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'CINEMADDICT';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

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
const boardPresenter = new BoardPresenter(siteMainElement, moviesModel, filterModel, apiWithProvider);
const siteMenuPresentor = new SiteMenuPresentor(siteMainElement, filterModel, moviesModel, changeMenuSection);

userProfilePresenter.init();
siteMenuPresentor.init();
boardPresenter.init();

apiWithProvider.getMovies()
  .then((movies) => {
    moviesModel.setFilms(UpdateType.INIT, movies);
    render(footerStatistics, new MoviesCounterView(moviesModel.getFilms()));
  })
  .catch(() => {
    moviesModel.setFilms(UpdateType.INIT, []);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/1569955-cinemaddict-14/public/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
  toast('ONLINE', true);
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  toast('OFFLINE');
});
