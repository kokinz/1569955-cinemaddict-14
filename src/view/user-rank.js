import AbstractView from './abstract.js';
import {getRank} from '../utils/common.js';

const createUserRankTemplate = (films) => {
  if (getRank(films) === '') {
    return ' ';
  } else {
    return `<section class="header__profile profile">
      <p class="profile__rating">${getRank(films)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
  }
};

class UserRank extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createUserRankTemplate(this._films);
  }
}

export {UserRank as default};
