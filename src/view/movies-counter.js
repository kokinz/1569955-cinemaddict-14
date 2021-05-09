import {createElement} from '../utils.js';

const createMoviesCounterTemplate = (films) => {
  return `<p>${films.length} movies inside</p>`;
};

class MoviesCounter {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createMoviesCounterTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export {MoviesCounter as default};
