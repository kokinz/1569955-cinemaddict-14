import SortMenuView from '../view/sort-menu.js';
import FilmListView from '../view/film-lists.js';
import NoFilmsView from '../view/no-films.js';
import ShowMoreView from '../view/show-more-button.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import {render, RenderPosition, remove} from '../utils/render.js';

const FILMS_COUNTER = 5;
const EXTRA_FILMS_COUNTER = 2;

class Board {
  constructor (boardContainer) {
    this._boardContainer = boardContainer;

    this._sortMenuComponent = new SortMenuView();
    this._movieListComponent = new FilmListView();
    this._noMoviesComponent = new NoFilmsView();
    this._showMoreComponent = new ShowMoreView();

  }

  init(boardFilms) {
    this._boardFilms = boardFilms.slice();

    render(this._boardContainer, this._movieListComponent);

    this._filmsContainer = this._boardContainer.querySelector('.films-list__container');
    this._extraFilmsContainers = this._boardContainer.querySelectorAll('.films-list--extra .films-list__container');

    this._renderBoard();
  }

  _renderSortMenu() {
    render(this._movieListComponent, this._sortMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderMovie(container, movie) {
    const filmComponent = new FilmCardView(movie);
    const filmPopupComponent = new FilmPopupView(movie);

    const renderPopup = () => {
      this._boardContainer.parentNode.appendChild(filmPopupComponent.getElement());

      this._boardContainer.parentNode.classList.add('hide-overflow');
    };

    const removePopup = () => {
      this._boardContainer.parentNode.removeChild(filmPopupComponent.getElement());

      this._boardContainer.parentNode.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        removePopup();

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

    render(container, filmComponent, RenderPosition.BEFOREEND);
  }

  _renderMovies(container, from, to) {
    this._boardFilms
      .slice(from, to)
      .forEach((boardFilm) => this._renderMovie(container, boardFilm));
  }

  _renderNoMovies() {
    render(this._boardContainer, this._noMoviesComponent, RenderPosition.AFTERBEGIN);
  }

  _renderShowMoreButton() {
    let renderedFilmsCount = FILMS_COUNTER;

    const showMoreButton = new ShowMoreView();

    render(this._filmsContainer, showMoreButton, RenderPosition.AFTEREND);

    showMoreButton.setShowMoreClickHandler(() => {
      this._renderMovies(this._filmsContainer, renderedFilmsCount, renderedFilmsCount + FILMS_COUNTER);

      renderedFilmsCount += FILMS_COUNTER;

      if (renderedFilmsCount >= this._boardFilms.length) {
        remove(showMoreButton);
      }
    });
  }

  _renderMoviesLists() {
    this._renderMovies(this._filmsContainer, 0, Math.min(this._boardFilms.length, FILMS_COUNTER));

    if (this._boardFilms.length > FILMS_COUNTER) {
      this._renderShowMoreButton();
    }

    for (let i = 0; i < this._extraFilmsContainers.length; i++) {
      for (let j = 0; j < EXTRA_FILMS_COUNTER; j++) {
        this._renderMovie(this._extraFilmsContainers[i], this._boardFilms[j]);
      }
    }
  }

  _renderBoard() {
    if (this._boardFilms.length <= 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSortMenu();
    this._renderMoviesLists();
  }
}

export {Board as default};
