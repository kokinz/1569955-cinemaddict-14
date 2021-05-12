const getTimeFormat = (time) => {
  const hours = Math.floor(time / 60);
  const minutes = Math.floor(time % 60);

  return hours > 0 ? hours + 'h ' + minutes + 'm' : minutes + 'm';
};

const checkList = (value) => {
  return value ? true : false;
};

export {getTimeFormat, checkList};
