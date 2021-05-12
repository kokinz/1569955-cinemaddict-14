import AbstractView from './abstract.js';

const getFiltersTemplate = (filters) => filters.map((filter) => {
  return `<a href="#${filter.name}" class="main-navigation__item">${filter.name} <span class="main-navigation__item-count">${filter.count}</span></a>`;
}).join(' ');

const createSiteMenuTemplate = (filters) => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${getFiltersTemplate(filters)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>

  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;
};

class SiteMenu extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters);
  }
}

export {SiteMenu as default};
