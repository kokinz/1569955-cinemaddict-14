import AbstractView from './abstract.js';

const createSortMenuTemplate = () => {
  return `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;
};

class SortMenu extends AbstractView {
  getTemplate() {
    return createSortMenuTemplate();
  }
}

export {SortMenu as default};
