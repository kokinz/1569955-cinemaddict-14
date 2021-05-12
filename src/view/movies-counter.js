import AbstractView from './abstract.js';

const createMoviesCounterTemplate = (films) => {
  return `<p>${films.length} movies inside</p>`;
};

class MoviesCounter extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createMoviesCounterTemplate(this._films);
  }
}

export {MoviesCounter as default};
