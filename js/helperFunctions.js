//Fixing week start to Monday.
export const calcDay = day => (day === 0 ? (day = 6) : (day -= 1));

export const setStorage = (keyName, valueName) =>
  localStorage.setItem(keyName, JSON.stringify(valueName));

export const getStorage = keyName =>
  JSON.parse(localStorage.getItem(`${keyName}`)) || [];

export const formatDate = input => {
  return input
    .split('-')
    .map((d, i) => (i === 1 ? (d - 1).toString().padStart(2, 0) : d))
    .join('-');
};

/*Functions checks if date field contains absence field, if its hidden or shown. 
If it's hidden, it opens modal for absence input */
export const handleDateFieldClick = (dateF, openModal, inputDate) => {
  const isHidden = dateF
    .querySelector('.date__field-leave')
    .classList.contains('hidden');

  const modalStr = dateF.id
    .replace('num', '')
    .split('-')
    .map((e, i) => {
      if (i === 1) return (+e + 1).toString().padStart(2, '0');
      else return e;
    })
    .join('-');

  if (isHidden) {
    openModal();
    inputDate.value = modalStr;
  }
};
