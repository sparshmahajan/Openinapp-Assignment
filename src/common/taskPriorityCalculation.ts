export const taskPriorityCalculation = (due_date: Date) => {
  const today = new Date();
  const timeDifference = due_date.getTime() - today.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  if (daysDifference <= 1) {
    return "0";
  } else if (daysDifference <= 2) {
    return "1-2";
  } else if (daysDifference <= 4) {
    return "3-4";
  } else {
    return "5+";
  }
};
