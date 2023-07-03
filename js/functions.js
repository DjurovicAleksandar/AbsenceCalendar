import * as elementsDOM from './domElementModule.js';
import * as helperFunctions from './helperFunctions.js';

const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAJ',
  'JUN',
  'JUL',
  'AVG',
  'SEP',
  'OKT',
  'NOV',
  'DEC',
];

let date = new Date(),
  currentYear = date.getFullYear(),
  currentMonth = date.getMonth(),
  isModalOpen = false,
  // holds current month and year, as string for for local storage key.
  key,
  //absence element displayed on the calendar
  workAbsenceEl;

export const openModal = function () {
  isModalOpen = true;
  /*date value used for inputDate value,
   which vary of the month displayed*/
  const formattedDate = `${currentYear}-${(currentMonth + 1)
    .toString()
    .padStart(2, '0')}-${
    currentMonth === new Date().getMonth() &&
    currentYear === new Date().getFullYear()
      ? date.getDate()
      : '01'
  }`;

  elementsDOM.inputDate.value = formattedDate;
  elementsDOM.modal.classList.remove('hidden');

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isModalOpen) {
      isModalOpen = false;
      closeModal();
    }
  });
};

export const closeModal = function () {
  elementsDOM.modal.classList.add('hidden');
  elementsDOM.modalAbsence.classList.add('hidden');
};

/*
function generates calendar markup, including previous,
 current, and next month's dates.
*/
export const renderDates = () => {
  let monthStartingDay = new Date(currentYear, currentMonth, 1).getDay(),
    monthLastDate = new Date(currentYear, currentMonth + 1, 0).getDate(),
    nextMonthDays = new Date(currentYear, currentMonth, monthLastDate).getDay(),
    previousMonthDates = new Date(currentYear, currentMonth, 0).getDate(),
    dateMarkup = ``;

  // Transferring the sunday (0) to the last day (6)
  nextMonthDays = helperFunctions.calcDay(nextMonthDays);
  monthStartingDay = helperFunctions.calcDay(monthStartingDay);

  // Generating dates from the previous month
  for (let i = monthStartingDay; i > 0; i--) {
    const liID = `${currentYear}-${(currentMonth - 1)
      .toString()
      .padStart(2, '0')}-${(previousMonthDates - i + 1)
      .toString()
      .padStart(2, '0')}`;
    const liContent = previousMonthDates - i + 1;

    const liElement = document.createElement('li');
    liElement.id = liID;
    liElement.className = 'date__field inactive';
    liElement.textContent = liContent;

    dateMarkup += liElement.outerHTML;
  }

  // Generating dates from the current month
  for (let i = 1; i <= monthLastDate; i++) {
    const currentDate = new Date();

    // Checking if it's today's date for applying the "active" class
    const isCurrentDate =
      currentDate.getDate() === i &&
      currentMonth === currentDate.getMonth() &&
      currentYear === currentDate.getFullYear();

    // Creating an ID for the <li>date<li>
    const liID = `num${currentYear}-${currentMonth
      .toString()
      .padStart(2, '0')}-${i.toString().padStart(2, '0')}`;

    const liContent = i.toString().padStart(2, '0');

    const liElement = document.createElement('li');
    const dateElement = document.createElement('div');
    workAbsenceEl = document.createElement('div');

    liElement.addEventListener('click', () => {});

    liElement.appendChild(dateElement);
    liElement.appendChild(workAbsenceEl);

    liElement.id = liID;

    liElement.className = `date__field ${isCurrentDate ? 'active' : ''}`;
    workAbsenceEl.className = 'date__field-leave hidden';

    dateElement.textContent = liContent;
    dateMarkup += liElement.outerHTML;
  }

  // Generating dates for the next month
  for (let i = nextMonthDays; i < 6; i++) {
    const liID = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, '0')}-${(i - nextMonthDays + 1)
      .toString()
      .padStart(2, '0')}`;

    const liContent = (i - nextMonthDays + 1).toString().padStart(2, '0');

    const liElement = document.createElement('li');

    liElement.id = liID;
    liElement.className = 'date__field inactive';
    liElement.textContent = liContent;

    dateMarkup += liElement.outerHTML;
  }

  return dateMarkup;
};

/*
This function renders the calendar, retrieves absence dates from storage, 
updates the date list, displays absences on the calendar, 
and handles click events for absence fields
*/

export const renderCalendar = () => {
  key = `${currentMonth}-${currentYear}`;

  const absenceDates = helperFunctions.getStorage(key);
  elementsDOM.dateList.innerHTML = renderDates();

  const dataField = document.querySelectorAll('.date__field');

  //adding click event to date fields
  dataField.forEach(dateF => {
    dateF.addEventListener('click', e => {
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
        elementsDOM.inputDate.value = modalStr;
      }
    });
  });

  absenceDates.forEach(([strDate, strText]) => {
    const field = document
      .getElementById(`${strDate}`)
      ?.querySelector('.date__field-leave');

    field?.classList.remove('hidden');
    field && (field.textContent = strText);

    //Click event for a popup
    field &&
      field.addEventListener('click', e => {
        isModalOpen = true;
        elementsDOM.modalAbsence.classList.remove('hidden');
        elementsDOM.modalAbsenceText.textContent = strText;
        document.addEventListener('keydown', event => {
          if (event.key === 'Escape' && isModalOpen) {
            isModalOpen = false;
            closeModal();
          }
        });

        //delete an abbsence from the calendar
        elementsDOM.btnDeleteAbsenceModal.addEventListener('click', () => {
          handleAbsenceClick(field);
        });
      });
  });

  elementsDOM.titleDate.textContent = `${months[currentMonth]} ${currentYear}`;
};

// Function for manipulating the year based on the month
const checkMonthAndUpdateYear = () => {
  if (currentMonth < 0 || currentMonth > 11) {
    date = new Date(currentYear, currentMonth);
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
  } else {
    date = new Date();
  }
};

//Furom submit function
/*This function, formats input date, adds absence to storage,
 and updates the calendar.
*/
export const handleSubmit = e => {
  e.preventDefault();

  // Formatting the value from the input to match the date string
  const formattedDate = helperFunctions.formatDate(elementsDOM.inputDate.value);

  const absenceDates = helperFunctions.getStorage(key);

  // Creating a new key that will match the selected month
  let newKey = formattedDate.split('-');

  // Parsing the month because it is in a format that starts with 0
  newKey = `${parseInt(newKey[1])}-${newKey[0]}`;

  absenceDates.push([`num${formattedDate}`, elementsDOM.inputType.value]);
  workAbsenceEl.textContent = elementsDOM.inputType.value;

  helperFunctions.setStorage(newKey, absenceDates);

  renderCalendar();
  closeModal();
};

// handling click events - next and previous buttons ( months, years )
export const handleButtonClick = e => {
  if (e.target.className !== 'btn') return;

  const isPrevious = e.target.id === 'previous__btn';

  currentMonth += isPrevious ? -1 : 1;

  checkMonthAndUpdateYear();
  renderCalendar();
};

export const handleAbsenceClick = field => {
  const absenceDates = helperFunctions.getStorage(key);
  const fieldID = field.parentElement.id;
  // Creating a new key that will match the selected month
  let newKey;

  //Filtering through absenceDates to remove the selected absence field
  const newAbsenceDates = absenceDates.filter(([strDate, strText]) => {
    newKey = strDate.split('-');

    if (strText === field.textContent && strDate === fieldID) return false;

    return true;
  });

  // Parsing the month because it is in a format that starts with 0
  newKey = `${parseInt(newKey[1])}-${newKey[0].replace(/\D/g, '')}`;

  helperFunctions.setStorage(newKey, newAbsenceDates);

  renderCalendar();
  elementsDOM.modalAbsence.classList.add('hidden');
};

//close modal
export const handleModalOutsideClick = e => {
  const con = e.target.closest('.modal__con');

  if (con) return;
  else closeModal();
};
