import * as elementsDOM from './domElementModule.js';

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
// Kreiranje trenutno datuma, trenutne godine i trenutnog meseca
let date = new Date(),
  currentYear = date.getFullYear(),
  currentMonth = date.getMonth(),
  //deklaracija key varijable koju koristimo za save elemenata u local storage
  key,
  //workAbsenceEl - u toku kodu kreiramo element na ovu varijablu, koji koristimo za element odsustva na datum polju
  workAbsenceEl;

// Funkcija za otvaranje popup prozora
export const openModal = function (e) {
  //Dinamicki odredjujemo datum, da prilikom otvaranja modala prikaze mjesec i godinu na kome smo
  const formattedDate = `${currentYear}-${(currentMonth + 1)
    .toString()
    .padStart(2, '0')}-${
    currentMonth === new Date().getMonth() &&
    currentYear === new Date().getFullYear()
      ? date.getDate()
      : '01'
  }`;

  elementsDOM.inputDate.value = formattedDate;

  //Uklanjanje klase hidden sa modala
  elementsDOM.modal.classList.remove('hidden');
};

// Funkcija za zatvaranje popup prozora
export const closeModal = function () {
  elementsDOM.modal.classList.add('hidden');
};

// Funkcija za izračunavanje dana, tj fix da sedmica pocinje ponedeljkom, a ne nedeljom
export const calcDay = day => (day === 0 ? (day = 6) : (day -= 1));

//funckija za prikaz datuma u kalnderu
export const renderDates = () => {
  //Pvi dan u sedmici
  let firstDateDay = new Date(currentYear, currentMonth, 1).getDay(),
    //Poslednji datum u mjesecu
    lastMonthDate = new Date(currentYear, currentMonth + 1, 0).getDate(),
    //Poslednji dan u mjesecu
    lastDateDay = new Date(currentYear, currentMonth, lastMonthDate).getDay(),
    //Poslednji datum u prethodnom mjesecu
    previousMonthLastDate = new Date(currentYear, currentMonth, 0).getDate(),
    // Promenljiva za smeštanje HTML markup-a
    dateMarkup = ``;

  // Prebacivanje nedelje (0) na poslednji dan (6)
  lastDateDay = calcDay(lastDateDay);
  firstDateDay = calcDay(firstDateDay);

  // Generisanje datuma iz prethodnog mjeseca
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

  //Generisanje datuma iz trenutnog mjeseca
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

  //Generisanje datuma za sljedeći mjesec
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

//Funkcija za prikaz kalendara
export const renderCalendar = () => {
  key = `${currentMonth}-${currentYear}`;
  // Preuzimanje datuma odsustva iz lokalnog skladišta
  const absenceDates = JSON.parse(localStorage.getItem(`${key}`)) || [];
  elementsDOM.dateList.innerHTML = renderDates();

  // Iteracija kroz datume odsustva i prikaz na kalendaru
  absenceDates.forEach(([strDate, strText]) => {
    //Na osnovu strDate-a iz lokalnog skladista, selekcujemo element
    const field = document
      .getElementById(`${strDate}`)
      ?.querySelector('.date__field-leave');

    //Uklanjamo hidden klasu sa polja datuma da bi ga prikazali na kalendaru
    field?.classList.remove('hidden');
    //Text contet prilogodjavamo text unjetom u modal pop up windowu
    field.textContent = strText;

    //Klikom na polje odsustva u polju datuma otvara pop up, koji prikazuje kompletan tekst tog odsustva
    field.addEventListener('click', e => {
      elementsDOM.modalAbsence.classList.remove('hidden');
      elementsDOM.modalAbsenceText.textContent = strText;

      //u pop up se nalazi button Ukloni, klikom na njega uklanjamo odustvo iz kalendara
      elementsDOM.btnDeleteAbsenceModal.addEventListener('click', () => {
        handleAbsenceClick(field);
      });
    });
  });

  //Dinamički prikaz mjeseca i datuma u naslovu na osnovu trenutne godine i mjeseca
  elementsDOM.titleDate.textContent = `${months[currentMonth]} ${currentYear}`;
};

// Funkcija za manipulaciju formom
export const handleSubmit = e => {
  e.preventDefault();

  //Formatiramo vrijednost iz inputa da bismo dobili onu koja je podudarna sa stringom datuma
  const formattedDate = elementsDOM.inputDate.value
    .split('-')
    .map((d, i) => (i === 1 ? (d - 1).toString().padStart(2, 0) : d))
    .join('-');

  // Preuzimanje datuma odsustva iz lokalnog skladišta
  const absenceDates = JSON.parse(localStorage.getItem(`${key}`)) || [];

  // Kreiranje novog ključa koji će se podudarati sa izabranim mjesecom
  let newKey = formattedDate.split('-');

  // Parsiranje mjeseca jer je u obliku koji počinje sa 0
  newKey = `${parseInt(newKey[1])}-${newKey[0]}`;

  // Dodavanje datuma u niz
  absenceDates.push([`num${formattedDate}`, elementsDOM.inputType.value]);
  workAbsenceEl.textContent = elementsDOM.inputType.value;

  // Čuvanje podataka u lokalnom skladištu
  localStorage.setItem(newKey, JSON.stringify(absenceDates));

  renderCalendar();
  closeModal();
};

//Funkcija manipulisanja klik eventima - buttoni next i previous
export const handleButtonClick = e => {
  //Guardin claw - zaustavljamo obradu klik eventom na djelovima parent kotenjera koji nije dugme
  if (e.target.className !== 'btn') return;

  // Provjera da li je nas target dugme za prethodni mesec
  const isPrevious = e.target.id === 'previous__btn';

  //Manipulacija currentMonth putem klika, ukoliko jeste dugme za prethodni mjesec oduzimamo 1 vrijednost sa mjeseca, u suprotnom dodajemo 1
  currentMonth += isPrevious ? -1 : 1;

  //Ukoliko je postojeci mjesec izvan ovih vrijednosti, tada kreiramo novi datum
  if (currentMonth < 0 || currentMonth > 11) {
    date = new Date(currentYear, currentMonth);
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
  } else {
    date = new Date();
  }

  //Render kalenara
  renderCalendar();
};

//Funckija za manipulaicju klik eventa na dugme Ukloni u pop upo koji prikazuje tekst odsustva
export const handleAbsenceClick = field => {
  // Preuzimanje datuma odsustva iz lokalnog skladišta
  const absenceDates = JSON.parse(localStorage.getItem(`${key}`)) || [];
  // Kreiranje novog ključa koji će se podudarati sa izabranim mjesecom
  let newKey;
  //ID izabranog datum polja
  const fieldID = field.parentElement.id;

  //Filterovanje kroz absenceDates, da bismo uklonili izabrano polje odsustva
  const newAbsenceDates = absenceDates.filter(([strDate, strText]) => {
    newKey = strDate.split('-');

    if (strText === field.textContent && strDate === fieldID) return false;

    return true;
  });

  // Parsujemo month, zato sto je u obliku koji pocinje sa 0
  newKey = `${parseInt(newKey[1])}-${newKey[0].replace(/\D/g, '')}`;

  // Čuvanje podataka u lokalnom skladištu
  localStorage.setItem(newKey, JSON.stringify(newAbsenceDates));

  renderCalendar();
  elementsDOM.modalAbsence.classList.add('hidden');
};