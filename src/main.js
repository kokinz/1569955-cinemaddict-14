import UserRankView from './view/user-rank.js';
import SiteMenuView from './view/site-menu.js';
import MoviesCounterView from './view/movies-counter.js';

import {generateFilm} from './mock/film.js';
import {generateFilters} from './mock/filters.js';
import {render, RenderPosition} from './utils/render.js';

import BoardPresenter from './presenter/board.js';

const FILMS_COUNT = 23;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilters(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');

const boardPresenter = new BoardPresenter(siteMainElement);

render(siteHeaderElement, new UserRankView(filters));
render(siteMainElement, new SiteMenuView(filters), RenderPosition.AFTERBEGIN);
render(footerStatistics, new MoviesCounterView(films));

boardPresenter.init(films);
