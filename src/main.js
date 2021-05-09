import {createSiteMenuTemplate} from './view/site-menu.js';
import {createFilmListsTemplate} from './view/film-lists.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createUserRankTemplate} from './view/user-rank.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createFilmPopupTemplate} from './view/film-popup.js';
import {createMoviesCounterTemplate} from './view/movies-counter.js';
import {generateFilm} from './mock/film.js';
import {generateFilters} from './mock/filters.js';

const FILMS_CARD_COUNTER = 5;
const EXTRA_FILMS_COUNTER = 2;
const FILMS_COUNT = 20;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilters(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createUserRankTemplate(filters));
render(siteMainElement, createSiteMenuTemplate(filters), 'afterbegin');
render(siteMainElement, createFilmListsTemplate());
render(footerStatistics, createMoviesCounterTemplate(films));
render(siteFooterElement, createFilmPopupTemplate(films[15]), 'afterend');

const filmListElement = siteMainElement.querySelector('.films-list__container');
const extraFilmListsElements = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

for (let i = 0; i < Math.min(films.length, FILMS_CARD_COUNTER); i++) {
  render(filmListElement, createFilmCardTemplate(films[i]));
}

if (films.length > FILMS_CARD_COUNTER) {
  let renderedFilmsCount = FILMS_CARD_COUNTER;

  render(filmListElement, createShowMoreButtonTemplate(), 'afterend');

  const showMoreButton = siteMainElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_CARD_COUNTER)
      .forEach((film) => render(filmListElement, createFilmCardTemplate(film)));

    renderedFilmsCount += FILMS_CARD_COUNTER;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

for (let i = 0; i < extraFilmListsElements.length; i++) {
  for (let j = 0; j < EXTRA_FILMS_COUNTER; j++) {
    render(extraFilmListsElements[i], createFilmCardTemplate(films[j]));
  }
}
