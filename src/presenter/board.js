import SortMenuView from '../view/sort-menu.js';
import LoadingView from '../view/loading.js';
import FilmListView from '../view/film-lists.js';
import TopRatedView from '../view/top-rated-list.js';
import MostCommentedView from '../view/most-commented-list.js';
import NoFilmsView from '../view/no-films.js';
import ShowMoreView from '../view/show-more-button.js';

import FilmPresenter from './film.js';

import {render, remove, RenderPosition} from '../utils/render.js';
import {sortFilmsByDate, sortFilmsByRating} from '../utils/film.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import {filter} from '../utils/filters.js';

const FILMS_COUNTER = 5;
const EXTRA_FILMS_COUNTER = 2;

class Board {
  constructor (boardContainer, moviesModel, filterModel, api) {
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._api = api;

    this._boardContainer = boardContainer;

    this._renderedFilmsCount = FILMS_COUNTER;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._filmPresenter = {};
    this._topRatedPresenter = {};
    this._mostCommentedPresenter = {};

    this._sortMenuComponent = null;
    this._showMoreComponent = null;

    this._movieListComponent = new FilmListView();
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();
    this._noMoviesComponent = new NoFilmsView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});

    this._moviesModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const films = this._moviesModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE_DESC:
        return sortFilmsByDate(filtredFilms);
      case SortType.RATING_DESC:
        return sortFilmsByRating(filtredFilms);
    }
    return filtredFilms;
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

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateMovie(update).then((response) => {
          this._moviesModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(update).then((response) => {
          this._moviesModel.addComment(updateType, response);
        });
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update).then(() => {
          this._moviesModel.deleteComment(updateType, update);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._updateFilmPresenter(this._filmPresenter, data);
        this._updateFilmPresenter(this._topRatedPresenter, data);
        this._updateFilmPresenter(this._mostCommentedPresenter, data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _updateFilmPresenter(presenters, data) {
    Object.values(presenters).forEach(() => {
      if (data.id in presenters) {
        presenters[data.id].init(data);
      }
    });
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedFilmCount: true});
    this._renderBoard();
  }

  _renderSortMenu() {
    if (this._sortMenuComponent !== null) {
      this._sortMenuComponent = null;
    }

    this._sortMenuComponent = new SortMenuView(this._currentSortType);

    this._sortMenuComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._movieListComponent, this._sortMenuComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderMovie(container, movie) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._api, this._moviesModel);

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

  _renderMovies(container, movies) {
    movies.forEach((movie) => this._renderMovie(container, movie));
  }

  _renderNoMovies() {
    this._clearBoard();
    render(this._boardContainer, this._noMoviesComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    this._clearBoard();
    render(this._boardContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._getMovies().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount +  FILMS_COUNTER);
    const films = this._getMovies().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderMovies(this._filmsContainer, films);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreComponent !== null) {
      this._showMoreComponent = null;
    }

    this._showMoreComponent = new ShowMoreView();

    this._showMoreComponent.setShowMoreClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsContainer, this._showMoreComponent, RenderPosition.AFTEREND);
  }

  _clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getMovies().length;

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

    remove(this._sortMenuComponent);
    remove(this._noMoviesComponent);
    remove(this._movieListComponent);
    remove(this._showMoreComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = FILMS_COUNTER;
    } else {
      this._renderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getMovies();
    const filmsCount = films.length;

    if (filmsCount <= 0) {
      this._renderNoMovies();
      return;
    }

    render(this._boardContainer, this._movieListComponent);
    render(this._movieListComponent, this._topRatedComponent);
    render(this._movieListComponent, this._mostCommentedComponent);

    this._renderSortMenu();

    this._filmsContainer = this._movieListComponent.getContainer();
    this._topRatedContainer = this._topRatedComponent.getContainer();
    this._mostCommentedContainer = this._mostCommentedComponent.getContainer();

    this._renderMovies(this._filmsContainer, films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)));
    this._renderMovies(this._topRatedContainer, films.slice(0, EXTRA_FILMS_COUNTER));
    this._renderMovies(this._mostCommentedContainer, films.slice(0, EXTRA_FILMS_COUNTER));

    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
  }
}

export {Board as default};
