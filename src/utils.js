const getTimeFormat = (time) => {
  const hours = Math.floor(time / 60);
  const minutes = Math.floor(time % 60);

  let duration = '';

  if (hours > 0){
    duration += hours + 'h ' + minutes + 'm';
  } else {
    duration += minutes + 'm';
  }

  return duration;
};

const checkList = (value) => {
  if (value) {
    return true;
  } else {
    return false;
  }
};

export {getTimeFormat, checkList};
