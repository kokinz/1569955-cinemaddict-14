import AbstractView from './abstract.js';

const createFilmListTemplate = () => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container"></div>
    </section>`;
};

class TopRatedList extends AbstractView {
  getTemplate() {
    return createFilmListTemplate();
  }

  getContainer() {
    if (this._element === null) {
      return null;
    }

    return this._element.querySelector('.films-list__container');
  }
}

export {TopRatedList as default};
