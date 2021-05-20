import AbstractView from './abstract.js';

const createFilmListTemplate = () => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container"></div>
    </section>`;
};

class MostCommentedList extends AbstractView {
  getTemplate() {
    return createFilmListTemplate();
  }

  getContainer() {
    if (this._element === null) {
      throw new Error('Need to create element.');
    }

    return this._element.querySelector('.films-list__container');
  }
}

export {MostCommentedList as default};
