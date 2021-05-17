import SortMenuView from '../view/sort-menu.js';
import FilmListView from '../view/film-lists.js';
import NoFilmsView from '../view/no-films.js';
import ShowMoreView from '../view/show-more-button.js';
import FilmPresenter from './film.js';
import {updateItem} from '../utils/common.js';
import {render, remove, RenderPosition} from '../utils/render.js';


const FILMS_COUNTER = 5;
const EXTRA_FILMS_COUNTER = 2;

class Board {
  constructor (boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmsCount = FILMS_COUNTER;
    this._filmPresenter = {};

    this._sortMenuComponent = new SortMenuView();
    this._movieListComponent = new FilmListView();
    this._noMoviesComponent = new NoFilmsView();
    this._showMoreComponent = new ShowMoreView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(boardFilms) {
    this._boardFilms = boardFilms.slice();

    render(this._boardContainer, this._movieListComponent);

    this._filmsContainer = this._boardContainer.querySelector('.films-list__container');
    this._extraFilmsContainers = this._boardContainer.querySelectorAll('.films-list--extra .films-list__container');

    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _renderSortMenu() {
    render(this._movieListComponent, this._sortMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderMovie(container, movie) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);

    filmPresenter.init(movie);

    this._filmPresenter[movie.id] = filmPresenter;
  }

  _renderMovies(container, from, to) {
    this._boardFilms
      .slice(from, to)
      .forEach((boardFilm) => this._renderMovie(container, boardFilm));
  }

  _renderNoMovies() {
    render(this._boardContainer, this._noMoviesComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    this._renderMovies(this._filmsContainer, this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNTER);

    this._renderedFilmsCount += FILMS_COUNTER;

    if (this._renderedFilmsCount >= this._boardFilms.length) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsContainer, this._showMoreComponent, RenderPosition.AFTEREND);

    this._showMoreComponent.setShowMoreClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCount = FILMS_COUNTER;
    remove(this._showMoreComponent);
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
