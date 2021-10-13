"use strict"

// Проверка, что документ уже загружен
document.addEventListener('DOMContentLoaded', function() {


  const form = document.querySelector('#form');
  form.addEventListener('submit', formSend);

  async function formSend(event) {
    event.preventDefault();

    let error = formValidate(form);
  }


  function formValidate() {
    let error = 0;
    // req сокращенный от required - обязательные
    let formReq = document.querySelectorAll('._req');

    // Оббежали все обязательный для заполнения инпуты
    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input);

      if(input.classList.contains('_email')) {
        if(emailTest(input)) {
          formAddError(input);
          error++;
        }
      } else if(input.getAttribute('type') === 'checkbox' && input.checked === false) {
        formAddError(input);
        error++;
      } else {
        if(input.value === '') {
          formAddError(input);
          error++;
        }
      }
    }


  }
  function formAddError(input) {
    input.parentElement.classList.add('_error');
    input.classList.add('_error');
  }
  function formRemoveError(input) {
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
  }
  // RegExp для email
  function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }


});