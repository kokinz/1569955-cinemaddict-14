const getRank = (filters) => {
  const history = filters.find((filter) => filter.name === 'History');

  switch (true) {
    case history.count === 0:
      return '';
    case history.count > 0 && history.count <= 10:
      return 'Novice';
    case history.count > 10 && history.count <= 20:
      return 'Fun';
    case history.count > 20:
      return 'Movie Buff';
  }
};

const createUserRankTemplate = (filters) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${getRank(filters)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export {createUserRankTemplate};
