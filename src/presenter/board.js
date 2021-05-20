import SortMenuView from '../view/sort-menu.js';
import FilmListView from '../view/film-lists.js';
import NoFilmsView from '../view/no-films.js';
import ShowMoreView from '../view/show-more-button.js';
import FilmPresenter from './film.js';
import {updateItem} from '../utils/common.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {sortFilmDate, sortFilmRating} from '../utils/film.js';
import {SortType} from '../const.js';


const FILMS_COUNTER = 5;
const EXTRA_FILMS_COUNTER = 2;

class Board {
  constructor (boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmsCount = FILMS_COUNTER;
    this._currentSortType = SortType.DEFAULT;

    this._filmPresenter = {};
    this._topRatedPresenter = {};
    this._mostCommentedPresenter = {};

    this._sortMenuComponent = new SortMenuView();
    this._movieListComponent = new FilmListView();
    this._noMoviesComponent = new NoFilmsView();
    this._showMoreComponent = new ShowMoreView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardFilms) {
    this._boardFilms = boardFilms.slice();
    this._sourcedBoardFilms = boardFilms.slice();

    render(this._boardContainer, this._movieListComponent);

    this._filmsContainer = this._boardContainer.querySelector('.films-list .films-list__container');
    this._extraFilmLists = this._boardContainer.querySelectorAll('.films-list--extra');

    this._extraFilmLists.forEach((list) => {
      if (list.textContent.includes('Top rated')) {
        this._topRatedContainer = list.querySelector('.films-list__container');
      }
      if (list.textContent.includes('Most commented')) {
        this._mostCommentedContainer = list.querySelector('.films-list__container');
      }
    });

    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
    Object
      .values(this._topRatedPresenter)
      .forEach((presenter) => presenter.resetView());
    Object
      .values(this._mostCommentedPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._sourcedBoardFilms = updateItem(this._sourcedBoardFilms, updatedFilm);

    this._filmPresenter[updatedFilm.id].init(updatedFilm);
    this._topRatedPresenter[updatedFilm.id].init(updatedFilm);
    this._mostCommentedPresenter[updatedFilm.id].init(updatedFilm);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE_DOWN:
        this._boardFilms.sort(sortFilmDate);
        break;
      case SortType.RATING_DOWN:
        this._boardFilms.sort(sortFilmRating);
        break;
      default:
        this._boardFilms = this._sourcedBoardFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType, activeButton) {
    if (this._currentSortType === sortType) {
      return;
    }

    const prevActiveButton = this._sortMenuComponent.getElement().querySelector('.sort__button--active');

    if (prevActiveButton) {
      prevActiveButton.classList.remove('sort__button--active');
    }

    activeButton.classList.add('sort__button--active');

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderMoviesLists();
  }

  _renderSortMenu() {
    render(this._movieListComponent, this._sortMenuComponent, RenderPosition.AFTERBEGIN);
    this._sortMenuComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderMovie(container, movie) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);

    filmPresenter.init(movie);

    if (container === this._filmsContainer) {
      this._filmPresenter[movie.id] = filmPresenter;
    }

    if (container === this._topRatedContainer) {
      this._topRatedPresenter[movie.id] = filmPresenter;
    }

    if (container === this._mostCommentedContainer) {
      this._mostCommentedPresenter[movie.id] = filmPresenter;
    }
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
    Object
      .values(this._topRatedPresenter)
      .forEach((presenter) => presenter.destroy());
    Object
      .values(this._mostCommentedPresenter)
      .forEach((presenter) => presenter.destroy());

    this._filmPresenter = {};
    this._topRatedPresenter = {};
    this._mostCommentedPresenter = {};

    this._renderedFilmsCount = FILMS_COUNTER;
    remove(this._showMoreComponent);
  }

  _renderMoviesLists() {
    this._renderMovies(this._filmsContainer, 0, Math.min(this._boardFilms.length, FILMS_COUNTER));
    this._renderMovies(this._topRatedContainer, 0, EXTRA_FILMS_COUNTER);
    this._renderMovies(this._mostCommentedContainer, 0, EXTRA_FILMS_COUNTER);

    if (this._boardFilms.length > FILMS_COUNTER) {
      this._renderShowMoreButton();
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
