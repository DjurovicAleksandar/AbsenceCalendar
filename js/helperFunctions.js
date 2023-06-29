// Funkcija za izračunavanje dana, tj fix da sedmica pocinje ponedeljkom, a ne nedeljom
export const calcDay = day => (day === 0 ? (day = 6) : (day -= 1));

//setStorage
export const setStorage = (keyName, valueName) =>
  localStorage.setItem(keyName, JSON.stringify(valueName));

//getStorage
export const getStorage = keyName =>
  JSON.parse(localStorage.getItem(`${keyName}`)) || [];
