import AbstractView from './abstract.js';

const createShowMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">
    Show more
  </button>`;
};

class ShowMore extends AbstractView {
  getTemplate() {
    return createShowMoreButtonTemplate();
  }
}

export {ShowMore as default};
