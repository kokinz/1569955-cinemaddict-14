const createSiteMenuTemplate = (filters) => {
  const createFiltersTemplate = () => {
    return filters.map((filter) => {
      return `<a href="#${filter.name}" class="main-navigation__item">${filter.name} <span class="main-navigation__item-count">${filter.count}</span></a>`;
    }).join(' ');
  };

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${createFiltersTemplate()}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>

  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;
};

export {createSiteMenuTemplate};
