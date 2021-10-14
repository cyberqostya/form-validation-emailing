"use strict"

// Проверка, что документ уже загружен
document.addEventListener('DOMContentLoaded', function() {


  const form = document.querySelector('#form');
  form.addEventListener('submit', formSend);

  async function formSend(event) {
    event.preventDefault();

    let error = formValidate(form);

    let formData = new FormData(form);
    formData.append('image', formImage.files[0]);

    if(error === 0) {
      form.classList.add('_sending');
      let response = await fetch('sendmail.php', {
        method: 'POST',
        body: formData
      });
      if(response.ok) {
        let result = await response.json();
        alert(result.message);
        formPreview.innerHTML = '';
        form.reset();
        form.classList.remove('_sending');
      } else {
        alert('Ошибка');
        form.classList.remove('_sending');
      }
    } else {
      alert('Заполните обязательные поля');
    }
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

    return error;
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

  // Загрузка файла
  const formImage = document.querySelector('#formImage');
  const formPreview = document.querySelector('#formPreview');
  
  formImage.addEventListener('change', () => {
    uploadFile(formImage.files[0]);
  });

  function uploadFile(file) {
    if(!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Поддерживаются только jpeg, png и gif форматы');
      formImage.value = '';
      return;
    }
    if(file.size > 2 * 1024 * 1024) {
      alert('Файл должен быть менее 2 МБ');
      return;
    }

    let reader = new FileReader();
    reader.onload = function(event) {
      formPreview.innerHTML = `<img src="${event.target.result}" alt="photo">`;
    }
    reader.onerror = function(event) {
      alert('Ошибка');
    }
    reader.readAsDataURL(file);
  }

});