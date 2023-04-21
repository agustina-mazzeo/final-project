export const addOnePercent = (num: number): number => {
  const onePercent = (num * 1) / 100; // Calculate 1% of the input number
  return num + onePercent; // Add 1% to the input number
};
