import SiteMenuView from '../view/site-menu.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filters.js';
import {FilterType, UpdateType, MenuItem} from '../const.js';

class SiteMenu {
  constructor(filterContainer, filterModel, filmsModel, changeMenuItem) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._changeMenuItem = changeMenuItem;

    this._siteMenuComponent = null;
    this._currentFilter = null;

    this._currentMenuSection = MenuItem.FILTER;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._handleStatsClick = this._handleStatsClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._siteMenuComponent;
    this._currentFilter = this._filterModel.getFilter();

    this._siteMenuComponent = new SiteMenuView(filters, this._currentFilter, this._currentMenuSection);
    this._siteMenuComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    this._siteMenuComponent.setStatsClickHandler(this._handleStatsClick);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._siteMenuComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  getComponent() {
    return this._siteMenuComponent;
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType && this._currentMenuSection === MenuItem.FILTER) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);

    this._changeMenuItem(MenuItem.FILTER);
    this._currentMenuSection = MenuItem.FILTER;
    this.init();
  }

  _handleStatsClick() {
    if (this._currentMenuSection === MenuItem.STATS) {
      return;
    }

    this._changeMenuItem(MenuItem.STATS);
    this._currentMenuSection = MenuItem.STATS;
    this.init();
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}

export {SiteMenu as default};
