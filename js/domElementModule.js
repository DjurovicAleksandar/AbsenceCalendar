// Selektovanje elemenata iz DOM-a

//Mjesec i datum u naslovu
export const titleDate = document.querySelector('.title__date');
//ul lista za datume
export const dateList = document.querySelector('.dates');
//parent kotenjer buttona - previous i next
export const buttons = document.querySelector('.buttons');
//Pop up za unosenje odsustva
export const modal = document.querySelector('.modal__container');
//button manipulaciju modalom
export const btnOpenModal = document.querySelector('.btn__open');
export const btnCloseModal = document.querySelector('.btn__close');

//Forma u modalu za unosenje odsustva
export const modalForm = document.getElementById('modal__form');
export const inputDate = document.getElementById('date');
export const inputType = document.getElementById('type');

//button za uklananje odsustva sa datum polja
export const btnDeleteAbsenceModal = document.querySelector(
  '.modal__absence-delete'
);
//Pop up koji se otvara klikom na odsustvo u datum polju
export const modalAbsence = document.querySelector('.modal__container2');
//Text prikazan u tom modulu
export const modalAbsenceText = document.querySelector('.modal__absence-text');
