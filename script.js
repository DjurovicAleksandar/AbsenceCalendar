'use strict';

import * as elementsDOM from './js/domElementModule.js';
import * as functions from './js/functions.js';

elementsDOM.buttons.addEventListener('click', functions.handleButtonClick);
elementsDOM.btnOpenModal.addEventListener('click', functions.openModal);
elementsDOM.btnCloseModal.addEventListener('click', functions.closeModal);
elementsDOM.btnCloseAbsenceModal.addEventListener(
  'click',
  functions.closeModal
);

elementsDOM.modalForm.addEventListener('submit', functions.handleSubmit);
elementsDOM.modal.addEventListener('click', functions.handleModalOutsideClick);
elementsDOM.modalAbsence.addEventListener(
  'click',
  functions.handleModalOutsideClick
);
functions.renderCalendar();
