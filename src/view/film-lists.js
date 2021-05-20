import AbstractView from './abstract.js';

const createFilmListsTemplate = () => {
  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>
    </section>
  </section>`;
};

class FilmList extends AbstractView {
  getTemplate() {
    return createFilmListsTemplate();
  }

  getContainer() {
    if (this._element === null) {
      throw new Error('Need to create element.');
    }

    return this._element.querySelector('.films-list__container');
  }
}

export {FilmList as default};
