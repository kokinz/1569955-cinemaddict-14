import {createSiteMenuTemplate} from './view/site-menu.js';

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');

render(siteMainElement, createSiteMenuTemplate(), 'afterbegin');
