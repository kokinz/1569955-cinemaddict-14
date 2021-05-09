import SiteMenuView from './view/site-menu.js';
import FilmListView from './view/film-lists.js';
import FilmCardView from './view/film-card.js';
import UserRankView from './view/user-rank.js';
import ShowMoreView from './view/show-more-button.js';
import FilmPopupView from './view/film-popup.js';
import MoviesCounterView from './view/movies-counter.js';

import {generateFilm} from './mock/film.js';
import {generateFilters} from './mock/filters.js';
import {renderElement, RenderPosition} from './utils.js';

const FILMS_CARD_COUNTER = 5;
const EXTRA_FILMS_COUNTER = 2;
const FILMS_COUNT = 20;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilters(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');

renderElement(siteHeaderElement, new UserRankView(filters).getElement());
renderElement(siteMainElement, new SiteMenuView(filters).getElement(), RenderPosition.AFTERBEGIN);
renderElement(siteMainElement, new FilmListView().getElement());
renderElement(footerStatistics, new MoviesCounterView(films).getElement());
renderElement(siteFooterElement, new FilmPopupView(films[15]).getElement(), 'afterend');

const filmListElement = siteMainElement.querySelector('.films-list__container');
const extraFilmListsElements = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

for (let i = 0; i < Math.min(films.length, FILMS_CARD_COUNTER); i++) {
  renderElement(filmListElement, new FilmCardView(films[i]).getElement());
}

if (films.length > FILMS_CARD_COUNTER) {
  let renderedFilmsCount = FILMS_CARD_COUNTER;

  const showMoreButton = new ShowMoreView();

  renderElement(filmListElement, showMoreButton.getElement(), RenderPosition.AFTEREND);

  showMoreButton.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_CARD_COUNTER)
      .forEach((film) => renderElement(filmListElement, new FilmCardView(film).getElement()));

    renderedFilmsCount += FILMS_CARD_COUNTER;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.getElement().remove();
      showMoreButton.removeElement();
    }
  });
}

for (let i = 0; i < extraFilmListsElements.length; i++) {
  for (let j = 0; j < EXTRA_FILMS_COUNTER; j++) {
    renderElement(extraFilmListsElements[i], new FilmCardView(films[j]).getElement());
  }
}
