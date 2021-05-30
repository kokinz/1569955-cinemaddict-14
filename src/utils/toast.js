const SHOW_TIME = 15000;

const toast = (message, online = false) => {
  const toastContainer = document.createElement('div');
  const toastItem = document.createElement('div');

  toastContainer.classList.add('toast-container');
  toastItem.classList.add('toast-item');

  toastItem.textContent = message;

  document.body.append(toastContainer);

  if (online) {
    toastItem.classList.add('toast-item--comebacks');
  }

  toastContainer.append(toastItem);
  setTimeout(() => {
    toastContainer.remove();
  }, SHOW_TIME);
};

export {toast};
