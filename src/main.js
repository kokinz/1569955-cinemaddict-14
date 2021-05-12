import SiteMenuView from './view/site-menu.js';
import FilmListView from './view/film-lists.js';
import FilmCardView from './view/film-card.js';
import NoFilmsView from './view/no-films.js';
import UserRankView from './view/user-rank.js';
import ShowMoreView from './view/show-more-button.js';
import FilmPopupView from './view/film-popup.js';
import MoviesCounterView from './view/movies-counter.js';

import {generateFilm} from './mock/film.js';
import {generateFilters} from './mock/filters.js';
import {render, RenderPosition, remove} from './utils/render.js';

const FILMS_CARD_COUNTER = 5;
const EXTRA_FILMS_COUNTER = 2;
const FILMS_COUNT = 23;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilters(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmCardView(film);
  const filmPopupComponent = new FilmPopupView(film);

  const renderPopup = () => {
    siteMainElement.parentNode.appendChild(filmPopupComponent.getElement());

    siteMainElement.parentNode.classList.add('hide-overflow');
  };

  const removePopup = () => {
    siteMainElement.parentNode.removeChild(filmPopupComponent.getElement());

    siteMainElement.parentNode.classList.remove('hide-overflow');
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      removePopup(evt);

      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  filmComponent.setFilmClickHandler(() => {
    renderPopup();

    document.addEventListener('keydown', onEscKeyDown);
  });

  filmPopupComponent.setFilmPopupClickHandler(() => {
    removePopup();

    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(filmListElement, filmComponent, RenderPosition.BEFOREEND);
};

const renderFilms = (container, films) => {
  if (films.length <= 0) {
    render(container, new NoFilmsView());

    return;
  }

  render(container, new FilmListView());

  const filmListElement = container.querySelector('.films-list__container');
  const extraFilmListsElements = container.querySelectorAll('.films-list--extra .films-list__container');

  for (let i = 0; i < Math.min(films.length, FILMS_CARD_COUNTER); i++) {
    renderFilm(filmListElement, films[i]);
  }

  if (films.length > FILMS_CARD_COUNTER) {
    let renderedFilmsCount = FILMS_CARD_COUNTER;

    const showMoreButton = new ShowMoreView();

    render(filmListElement, showMoreButton, RenderPosition.AFTEREND);

    showMoreButton.setShowMoreClickHandler(() => {
      films
        .slice(renderedFilmsCount, renderedFilmsCount + FILMS_CARD_COUNTER)
        .forEach((film) => renderFilm(filmListElement, film));

      renderedFilmsCount += FILMS_CARD_COUNTER;

      if (renderedFilmsCount >= films.length) {
        remove(showMoreButton);
      }
    });
  }

  for (let i = 0; i < extraFilmListsElements.length; i++) {
    for (let j = 0; j < EXTRA_FILMS_COUNTER; j++) {
      renderFilm(extraFilmListsElements[i], films[j]);
    }
  }
};

render(siteHeaderElement, new UserRankView(filters));
render(siteMainElement, new SiteMenuView(filters), RenderPosition.AFTERBEGIN);
render(footerStatistics, new MoviesCounterView(films));
renderFilms(siteMainElement, films);
