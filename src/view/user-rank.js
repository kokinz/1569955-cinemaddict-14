import AbstractView from './abstract.js';

const getRank = (filters) => {
  const history = filters.find((filter) => filter.name === 'History');

  if (history.count === 0) {
    return '';
  }

  if (history.count > 0 && history.count <= 10) {
    return 'Novice';
  }

  if (history.count > 10 && history.count <= 20) {
    return 'Fun';
  }

  if (history.count > 20) {
    return 'Movie Buff';
  }
};

const createUserRankTemplate = (filters) => {
  if (getRank(filters) === '') {
    return ' ';
  } else {
    return `<section class="header__profile profile">
      <p class="profile__rating">${getRank(filters)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
  }
};

class UserRank extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createUserRankTemplate(this._filters);
  }
}

export {UserRank as default};
