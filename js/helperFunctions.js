//Fixing week start to Monday.
export const calcDay = day => (day === 0 ? (day = 6) : (day -= 1));

export const setStorage = (keyName, valueName) =>
  localStorage.setItem(keyName, JSON.stringify(valueName));

export const getStorage = keyName =>
  JSON.parse(localStorage.getItem(`${keyName}`)) || [];
