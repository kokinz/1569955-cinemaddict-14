import AbstractView from './abstract.js';
import {FilterType} from '../const.js';

const getFiltersTemplate = (filters, currentFilter) => filters.map((filter) => {
  return `<a href="#${filter.name}" class="main-navigation__item ${filter.type === currentFilter ? 'main-navigation__item--active' : ' '}" data-filter="${filter.type}">
    ${filter.name}
    ${filter.type === FilterType.ALL ? '' : `<span class="main-navigation__item-count">${filter.count}</span>`}
  </a>`;
}).join(' ');

const createSiteMenuTemplate = (filters, currentFilterType) => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${getFiltersTemplate(filters, currentFilterType)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._filterTypeChangeHandler);
  }
}

export {SiteMenu as default};
