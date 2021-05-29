const SHOW_TIME = 15000;

const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

const toast = (message, online = false) => {
  const toastItem = document.createElement('div');

  toastItem.textContent = message;

  if (online) {
    toastItem.classList.add('toast-item--comebacks');
  } else {
    toastItem.classList.add('toast-item');
  }

  toastContainer.append(toastItem);

  setTimeout(() => {
    toastItem.remove();
  }, SHOW_TIME);
};

export {toast};
