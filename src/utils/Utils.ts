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

// Function to format a date as YYYY-MM-DD
export const formatDateYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Get today's date
export const getTodayYYYYMMDD = () => {
  const today = new Date();
  return formatDateYYYYMMDD(today);
};

// Get the date one year ago
export const getOneYearAgoYYYYMMDD = () => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Ensure the date is valid (handles leap years)
  if (today.getMonth() !== oneYearAgo.getMonth()) {
    oneYearAgo.setDate(0); // Set to last valid day of the previous month
  }
  return formatDateYYYYMMDD(oneYearAgo);
};
