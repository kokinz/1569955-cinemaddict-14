const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const getTimeFormat = (time) => {
  const hours = Math.floor(time / 60);
  const minutes = Math.floor(time % 60);

  return hours > 0 ? hours + 'h ' + minutes + 'm' : minutes + 'm';
};

const checkList = (value) => {
  return value ? true : false;
};

const render = (container, element, place = 'beforeend') => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
  }
};

const renderTemplate = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export {RenderPosition, getTimeFormat, checkList, render, renderTemplate, createElement};
