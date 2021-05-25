import AbstractView from './abstract.js';
import {FilterType, MenuItem} from '../const.js';

const getFiltersTemplate = (filters, currentFilter, currentMenuItem) => filters.map((filter) => {
  return `<a href="#${filter.name}" class="main-navigation__item ${filter.type === currentFilter && currentMenuItem === MenuItem.FILTER ? 'main-navigation__item--active' : ' '}" data-filter="${filter.type}" data-type="${MenuItem.FILTER}">
    ${filter.name}
    ${filter.type === FilterType.ALL ? '' : `<span class="main-navigation__item-count">${filter.count}</span>`}
  </a>`;
}).join(' ');

const createSiteMenuTemplate = (filters, currentFilterType, currentMenuItem) => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${getFiltersTemplate(filters, currentFilterType, currentMenuItem)}
    </div>
    <a href="#stats" class="main-navigation__additional ${currentMenuItem === MenuItem.STATS ? 'main-navigation__additional--active' : ''}" data-type="${MenuItem.STATS}">Stats</a>
  </nav>`;
};

class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType, currentMenuItem) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._currentMenuItem = currentMenuItem;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter, this._currentMenuItem);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._filterTypeChangeHandler);
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick();
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._statsClickHandler);
  }
}

export {SiteMenu as default};
