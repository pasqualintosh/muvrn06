// [2018, 2017, 2016 ... 1990]
export const years = () => {
  let y_array = [];
  for (let y = new Date().getUTCFullYear(); y > 1985; y--) {
    y_array.push(y);
  }
  return y_array.reverse();
};
