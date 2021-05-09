const getTimeFormat = (time) => {
  const hours = Math.floor(time / 60);
  const minutes = Math.floor(time % 60);

  let duration = '';

  hours > 0 ? duration += hours + 'h ' + minutes + 'm' : duration += minutes + 'm';

  return duration;
};

const checkList = (value) => {
  return value ? true : false;
};

export {getTimeFormat, checkList};
