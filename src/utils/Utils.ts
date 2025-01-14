export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const addOrSubstractRandom = (value: number) => {
  const tmp =
    Math.random() > 0.5
      ? value + getRandomInt(0, 10)
      : value - getRandomInt(0, 10);
  if (tmp < 0) {
    return 0;
  } else {
    return tmp;
  }
};
