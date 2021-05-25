import UserRankView from '../view/user-rank.js';
import {RenderPosition, render, remove} from '../utils/render.js';

class UserProfile {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._userProfileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init() {
    const films = this._moviesModel.getFilms();

    this._userProfileComponent = new UserRankView(films);
    render(this._container, this._userProfileComponent, RenderPosition.BEFOREEND);

  }

  _handleModelEvent() {
    remove(this._userProfileComponent);
    this.init();
  }
}

export {UserProfile as default};
