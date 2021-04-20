import {createSiteMenuTemplate} from './view/site-menu.js';
import {createFilmListsTemplate} from './view/film-lists.js';
import {createFilmCardTemplate} from './view/film-card.js';

const FILMS_CARD_COUNTER = 5;
const EXTRA_FILMS_COUNTER = 2;

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');

render(siteMainElement, createSiteMenuTemplate(), 'afterbegin');
render(siteMainElement, createFilmListsTemplate());

const filmListElement = siteMainElement.querySelector('.films-list__container');

for (let i = 1; i <= FILMS_CARD_COUNTER; i++) {
  render(filmListElement, createFilmCardTemplate());
}

const extraFilmListsElements = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

for (let i = 1; i <= extraFilmListsElements.length; i++) {
  for (let j = 0; j < EXTRA_FILMS_COUNTER; j++) {
    render(extraFilmListsElements[j], createFilmCardTemplate());
  }
}
