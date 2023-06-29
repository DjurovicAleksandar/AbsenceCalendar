'use strict';

//Varijable

const titleDate = document.querySelector('.title__date');

const dateList = document.querySelector('.dates');

const buttons = document.querySelector('.buttons');

const btnOpenModal = document.querySelector('.btn__open');
const btnCloseModal = document.querySelector('.btn__close');

const btnDeleteAbsenceModal = document.querySelector('.modal__absence-delete');

const modal = document.querySelector('.modal__container');
const modalAbsence = document.querySelector('.modal__container2');
const modalAbsenceText = document.querySelector('.modal__absence-text');

const modalForm = document.getElementById('modal__form');
const inputDate = document.getElementById('date');
const inputType = document.getElementById('type');

const months = [
  'Januar',
  'Februar',
  'Mart',
  'April',
  'Maj',
  'Jun',
  'Jul',
  'Avgust',
  'Septembar',
  'Oktobar',
  'Novembar',
  'Decembar',
];
// Kreiranje trenutno datuma putem new Date konstruktora, kao i kreiranje trenutne godine i mjeseca iz ovog new Date konstruktora
let date = new Date(),
  currentYear = date.getFullYear(),
  currentMonth = date.getMonth(),
  key,
  workAbsenceEl;

//Funkcije

//open popup
const openModal = function (e) {
  //Dinamicki odredjujemo datum, da prilikom otvaranja modala prikaze mjesec i godinu na kome smo
  const formattedDate = `${currentYear}-${(currentMonth + 1)
    .toString()
    .padStart(2, '0')}-${
    currentMonth === new Date().getMonth() &&
    currentYear === new Date().getFullYear()
      ? date.getDate()
      : '01'
  }`;

  inputDate.value = formattedDate;

  //Uklanjanje klase hidden sa modala
  modal.classList.remove('hidden');
};

//close pop up
const closeModal = function () {
  modal.classList.add('hidden');
};

const calcDay = day => (day === 0 ? (day = 6) : (day -= 1));
// Nedelja je 0, zato je prebacujemo na zadnji dan, 7
//Oduzimamo 1 od dana, da pomjerimo dane za jednu poziciju

//funckija za prikaz datuma u kalnderu
const renderDates = () => {
  //pvi dan u sedmici
  let firstDateDay = new Date(currentYear, currentMonth, 1).getDay(),
    //poslednji datum u mjesecu
    lastMonthDate = new Date(currentYear, currentMonth + 1, 0).getDate(),
    //poslednji dan u mjesecu
    lastDateDay = new Date(currentYear, currentMonth, lastMonthDate).getDay(),
    //poslednji datum u prethodnom mjesecu
    previousMonthLastDate = new Date(currentYear, currentMonth, 0).getDate(),
    //Ovdje cemo smjestiti LI elemnt sa odgovarajucim datumima
    dateMarkup = ``;

  //Umjesto nedelje vracamo prvi dan da bde ponedeljak
  lastDateDay = calcDay(lastDateDay);
  firstDateDay = calcDay(firstDateDay);

  // //loop za generisanje datuma iz proslog mjeseca
  for (let i = firstDateDay; i > 0; i--) {
    const liID = `${currentYear}-${(currentMonth - 1)
      .toString()
      .padStart(2, '0')}-${(previousMonthLastDate - i + 1)
      .toString()
      .padStart(2, '0')}`;
    const liContent = previousMonthLastDate - i + 1;

    const liElement = document.createElement('li');
    liElement.id = liID;
    liElement.className = 'date__field inactive';
    liElement.textContent = liContent;

    dateMarkup += liElement.outerHTML;
  }

  //Loop da dobijanje datuma iz datog mjeseca
  for (let i = 1; i <= lastMonthDate; i++) {
    const currentDate = new Date();
    const isCurrentDate =
      currentDate.getDate() === i &&
      currentMonth === currentDate.getMonth() &&
      currentYear === currentDate.getFullYear();

    const liID = `num${currentYear}-${currentMonth
      .toString()
      .padStart(2, '0')}-${i.toString().padStart(2, '0')}`;

    const liContent = i.toString().padStart(2, '0');

    const liElement = document.createElement('li');
    const dateElement = document.createElement('div');
    workAbsenceEl = document.createElement('div');

    liElement.appendChild(dateElement);
    liElement.appendChild(workAbsenceEl);

    liElement.id = liID;
    liElement.className = `date__field ${isCurrentDate ? 'active' : ''}`;
    workAbsenceEl.className = 'date__field-leave hidden';

    dateElement.textContent = liContent;

    dateMarkup += liElement.outerHTML;
  }

  // //loop za dobijanje prvih datuma za sljedeci mjesec
  for (let i = lastDateDay; i < 6; i++) {
    const liID = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, '0')}-${(i - lastDateDay + 1).toString().padStart(2, '0')}`;
    const liContent = (i - lastDateDay + 1).toString().padStart(2, '0');

    const liElement = document.createElement('li');
    liElement.id = liID;
    liElement.className = 'date__field inactive';
    liElement.textContent = liContent;

    dateMarkup += liElement.outerHTML;
  }

  return dateMarkup;
};

//funkcija za prikaz kalendara
const renderCalendar = () => {
  key = `${currentMonth}-${currentYear}`;

  const absenceDates = JSON.parse(localStorage.getItem(`${key}`)) || [];

  dateList.innerHTML = renderDates();

  //loop preko local storagea
  absenceDates.forEach(([strDate, strText]) => {
    const field = document
      .getElementById(`${strDate}`)
      ?.querySelector('.date__field-leave');

    field.classList.remove('hidden');
    field.textContent = strText;
    field.addEventListener('click', e => {
      modalAbsence.classList.remove('hidden');
      modalAbsenceText.textContent = strText;

      btnDeleteAbsenceModal.addEventListener('click', () => {
        handleAbsenceClick(field);
      });
    });
  });

  titleDate.textContent = `${months[currentMonth]} ${currentYear}`;
};

//formManipluation
const handleSubmit = e => {
  e.preventDefault();

  //Formatiramo vrijednost iz inputa da bismo dobili onu koja je podudarna sa stringom datuma
  const formattedDate = inputDate.value
    .split('-')
    .map((d, i) => (i === 1 ? (d - 1).toString().padStart(2, 0) : d))
    .join('-');

  //itemi iz local Storage-a
  const absenceDates = JSON.parse(localStorage.getItem(`${key}`)) || [];

  //Kreiranja novog kljuc, da bude matching sa izabranim mjesecom
  let newKey = formattedDate.split('-');

  //Parsujemo month, zato sto je u obliku koji pocinje sa 0
  newKey = `${parseInt(newKey[1])}-${newKey[0]}`;

  //Pushamo date u array
  absenceDates.push([`num${formattedDate}`, inputType.value]);
  workAbsenceEl.textContent = inputType.value;

  //Snimanje u local storage
  localStorage.setItem(newKey, JSON.stringify(absenceDates));

  renderCalendar();
  closeModal();
};

//Funkcija za button click
const handleButtonClick = e => {
  //Guardin claw, da zaustavimo ocitavanje klik na dio parent kotenjera koji nije btn
  if (e.target.className !== 'btn') return;
  //definisanje buttona koji vodi na prethodni mjesec
  const isPrevious = e.target.id === 'previous';
  //Manipulacija currentMonth putem klika
  currentMonth += isPrevious ? -1 : 1;

  //Ukoliko je postojeci mjesec izvan ovih vrijednosti, tada kreiramo novi datum
  if (currentMonth < 0 || currentMonth > 11) {
    date = new Date(currentYear, currentMonth);
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
  } else {
    date = new Date();
  }

  //Renderujemo kalenar
  renderCalendar();
};

//Funckija za klik na absence field
const handleAbsenceClick = field => {
  // field.textContent=''
  // field.classList.add('hidden')
  const absenceDates = JSON.parse(localStorage.getItem(`${key}`)) || [];
  let newKey;
  const fieldID = field.parentElement.id;

  const newAbsenceDates = absenceDates.filter(([strDate, strText]) => {
    newKey = strDate.split('-');

    if (strText === field.textContent && strDate === fieldID) return false;

    return true;
  });

  // Parsujemo month, zato sto je u obliku koji pocinje sa 0
  newKey = `${parseInt(newKey[1])}-${newKey[0].replace(/\D/g, '')}`;

  localStorage.setItem(newKey, JSON.stringify(newAbsenceDates));

  renderCalendar();
  modalAbsence.classList.add('hidden');
};

// Event klik  na parent kontenjer buttona
buttons.addEventListener('click', handleButtonClick);
btnOpenModal.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);

modalForm.addEventListener('submit', handleSubmit);

renderCalendar();
