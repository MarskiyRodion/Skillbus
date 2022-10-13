document.addEventListener('DOMContentLoaded', () => {

  // Переменные из html
  const table = document.querySelector('.table')
  const tableBody = document.querySelector('.table__body');
  let inputName = document.querySelector('.name');
  let inputSurname = document.querySelector('.surname');
  let inputLastName = document.querySelector('.lastName');
  let inputs = document.querySelectorAll('.form__input');

  tableBody.innerHTML = `<div class="preloader">
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
          d="M4.00025 40.0005C4.00025 59.8825 20.1182 76.0005 40.0002 76.0005C59.8822 76.0005 76.0002 59.8825 76.0002 40.0005C76.0002 20.1185 59.8823 4.00049 40.0003 4.00049C35.3513 4.00048 30.9082 4.88148 26.8282 6.48648"
          stroke="#9873FF" stroke-width="8" stroke-miterlimit="10" stroke-linecap="round" />
  </svg>
</div>`;

  // Проверяем есть ли в ссылке id элемента, если да то открываем модальное окно с информацией об этом клиенте
  async function modalClientHash() {
    clientHash = window.location.hash.substring(1)
    const response = await fetch('http://localhost:3000/api/clients');
    const clientItemList = await response.json();
    clientItemList.forEach(item => {
      if (clientHash === item.id) {
        document.querySelector('.client__new').classList.add('modal-active');
        modalAPI(item, createClientTable(item, apihandlers()));
      };
    });
  };

  modalClientHash()
  //Функция для создания нового контакта в модальном окне
  function contactCreate() {
    // const social = document.querySelector('.form__social');
    const contactDiv = document.createElement('div');

    let select = document.createElement('select');
    let optionVk = document.createElement('option');
    let optionTel = document.createElement('option');
    let optionFB = document.createElement('option');
    let optionEmail = document.createElement('option');
    let optionNewTel = document.createElement('option');

    let contactInput = document.createElement('input');
    let contactClose = document.createElement('a');

    contactDiv.classList.add('form__contac');
    select.classList.add('form__select', 'custom-select');
    select.setAttribute('name', 'select')
    select.append(optionVk, optionTel, optionFB, optionEmail, optionNewTel);
    contactInput.classList.add('form__input--select');
    contactInput.setAttribute('required', '')
    contactClose.classList.add('btn-reset', 'form__btn--select');

    optionVk.value = 'VK';
    optionTel.value = 'Телефон';
    optionFB.value = 'FaceBook';
    optionEmail.value = 'Email';
    optionNewTel.value = 'Доп.телефон';

    optionVk.innerHTML = 'VK';
    optionTel.innerHTML = 'Телефон';
    optionFB.innerHTML = 'FaceBook';
    optionEmail.innerHTML = 'Email';
    optionNewTel.innerHTML = 'Доп.телефон';

    contactClose.innerHTML = `<svg class='svg__close' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0" />
        </svg><span class="toltip__remove">Удалить контакт</span>`


    contactDiv.append(select, contactInput, contactClose);
    // social.append(contactDiv);

    contactClose.addEventListener('click', () => {
      contactDiv.remove()
    })


    return {
      select,
      contactInput,
      contactDiv,
    };
  };

  // при клике реализовываем добовление контакта
  const newContact = document.querySelector('.form__newContact');
  newContact.addEventListener('click', () => {

    let allInputs = document.querySelectorAll('.form__input--select');
    if (allInputs.length < 10) {
      const contact = contactCreate()
      const social = document.querySelector('.form__social');
      social.append(contact.contactDiv);
    } else {
      return
    }

    const selectAll = document.querySelectorAll('.custom-select');
    selectAll.forEach(item => {
      const choices = new Choices(item, {
        itemSelectText: '',
        position: 'bottom',
        searchEnabled: false,
      });
    })

    // const telMask = document.querySelectorAll('.form__select');
    // telMask.forEach(item => {
    //   if (item.value === 'Телефон') {
    //     console.log('yes')
    //     let im = new Inputmask("+7 (999)-999-99-99");
    //     im.mask(this.document.querySelectorAll('.form__input--select'));
    //   }
    // })
  });


  //функция для открытия и закрытия модального окна
  function openModal(btn) {
    const modal = document.querySelector('.client__new');
    const closeModal = document.querySelector('.modal__close')
    btn.addEventListener('click', () => {
      modal.classList.add('modal-active')
    })
    closeModal.addEventListener('click', () => {
      window.location.hash = ''
      document.querySelector('.form__social').innerHTML = '';
      modal.classList.remove('modal-active');
      inputName.value = '';
      inputLastName.value = '';
      inputSurname.value = '';
    })
  }
  openModal(document.querySelector('.client__btn'))

  //Модальное окно, которое удаляет элемент
  function deleteClientModal(linkDelete, clientItem, element) {
    linkDelete.addEventListener('click', () => {
      document.getElementById('newClient').classList.remove('modal-active')
      document.querySelector('.client__delete').classList.add('modal-active');
      document.querySelector('.delete__close').addEventListener('click', () => {
        document.querySelector('.client__delete').classList.remove('modal-active');
      });
      document.querySelector('.delete__btnNo').addEventListener('click', () => {
        document.querySelector('.client__delete').classList.remove('modal-active');
      });
      document.querySelector('.delete__btn').addEventListener('click', () => {
        element.remove();
        fetch(`http://localhost:3000/api/clients/${clientItem.id}`, {
          method: 'DELETE',
        });
        document.querySelector('.client__delete').classList.remove('modal-active');
      });
    })
  };

  //Создаём и возвращаем список клиентов
  function createClientTable(clientItem, { onChange, onDelete }) {
    let line = document.createElement('tr');

    let tdId = document.createElement('td');
    let tdFio = document.createElement('td');

    let tdCreateTime = document.createElement('td');
    let divTimeCreate = document.createElement('div');
    let createTime = document.createElement('span');
    let timeCreateSpan = document.createElement('span');
    let tdchangeTime = document.createElement('td');
    let divTimeChange = document.createElement('div');
    let changeTime = document.createElement('span');
    let timeChangeSpan = document.createElement('span');

    let tdContact = document.createElement('td');

    let tdchange = document.createElement('td');
    let btnChange = document.createElement('div');
    let btnDelete = document.createElement('div');

    line.classList.add('table__line');
    tdId.classList.add('table__id', 'table__item');
    tdFio.classList.add('table__item');

    tdCreateTime.classList.add('table__item');
    tdchangeTime.classList.add('table__item');
    divTimeCreate.classList.add('table__divTime');
    divTimeChange.classList.add('table__divTime');
    createTime.classList.add('table__span--margin');
    changeTime.classList.add('table__span--margin');
    timeCreateSpan.classList.add('table__span', 'table__span--margin');
    timeChangeSpan.classList.add('table__span', 'table__span--margin');


    tdContact.classList.add('table__item');

    // Добовляем кнопки
    tdchange.classList.add('table__item', 'table__change');
    btnChange.classList.add('table__btn', 'table__redact');
    btnDelete.classList.add('table__btn', 'table__delete');
    btnChange.innerHTML = `<svg class="table__edit" width="13" height="13" viewBox="0 0 13 13" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0 10.5002V13.0002H2.5L9.87333 5.62687L7.37333 3.12687L0 10.5002ZM11.8067 3.69354C12.0667 3.43354 12.0667 3.01354 11.8067 2.75354L10.2467 1.19354C9.98667 0.933535 9.56667 0.933535 9.30667 1.19354L8.08667 2.41354L10.5867 4.91354L11.8067 3.69354Z"
                fill="#9873FF" />
        </svg>Изменить`
    btnDelete.innerHTML = `<svg class="table__edit" width="12" height="12" viewBox="0 0 12 12" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z"
                fill="#F06A4D" />
        </svg>Удалить`
    tdchange.append(btnChange, btnDelete)

    //Добовляем id и фио
    tdId.innerHTML = clientItem.id;
    tdFio.innerHTML = clientItem.surname + ' ' + clientItem.name + ' ' + clientItem.lastName;

    //Добавляем время
    let dateCreate = new Date(clientItem.createdAt)
    let optionsCreate = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    };
    let dateCreateNorm = dateCreate.toLocaleString('ru', optionsCreate);
    createTime.innerHTML = dateCreateNorm;
    let dateCreateHourse = dateCreate.getHours();
    let dateCreateMinutes = dateCreate.getMinutes()
    timeCreateSpan.innerHTML = `${dateCreateHourse}:${dateCreateMinutes}`

    let dateUpdate = new Date(clientItem.updatedAt)
    let optionsUpdate = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    let dateUpdateNorm = dateUpdate.toLocaleString('ru', optionsUpdate);
    changeTime.innerHTML = dateUpdateNorm;
    let dateUpdateHourse = dateUpdate.getHours();
    let dateUpdateMinutes = dateUpdate.getMinutes()
    timeChangeSpan.innerHTML = `${dateUpdateHourse}:${dateUpdateMinutes}`

    divTimeCreate.append(createTime, timeCreateSpan)
    tdCreateTime.append(divTimeCreate)
    divTimeChange.append(changeTime, timeChangeSpan)
    tdchangeTime.append(divTimeChange)

    let divContact = document.createElement('div');
    divContact.classList.add('table__itemContact')
    // Добовляем контакты
    for (let i = 0; i < clientItem.contacts.length; i++) {
      if (clientItem.contacts[i].type === 'VK') {
        let linkVK = document.createElement('a');
        linkVK.classList.add('table__linkContact');
        linkVK.innerHTML = `<svg class="tooltip__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
        </svg><span class="tooltip">${clientItem.contacts[i].type}: <span class="tooltip__link">${clientItem.contacts[i].value}</span></span>`
        divContact.append(linkVK)
      }
      if (clientItem.contacts[i].type === 'Телефон') {
        let linkTel = document.createElement('a');
        linkTel.classList.add('table__linkContact');
        linkTel.innerHTML = `<svg class="tooltip__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
        <circle cx="8" cy="8" r="8" fill="#9873FF"/>
        <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
        </g>
        </svg> <span class="tooltip">${clientItem.contacts[i].type}: <span class="tooltip__link">${clientItem.contacts[i].value}</span></span>`
        divContact.append(linkTel)
      }
      if (clientItem.contacts[i].type === 'FaceBook') {
        let linkFB = document.createElement('a');
        linkFB.classList.add('table__linkContact');
        linkFB.innerHTML = `<svg class="tooltip__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
        </svg> <span class="tooltip">${clientItem.contacts[i].type}: <span class="tooltip__link">${clientItem.contacts[i].value}</span></span>`
        divContact.append(linkFB)
      }
      if (clientItem.contacts[i].type === 'Email') {
        let linkEmail = document.createElement('a');
        linkEmail.classList.add('table__linkContact');
        linkEmail.innerHTML = `<svg class="tooltip__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
        </svg> <span class="tooltip">${clientItem.contacts[i].type}: <span class="tooltip__link">${clientItem.contacts[i].value}</span></span>`
        divContact.append(linkEmail)
      }
      if (clientItem.contacts[i].type === 'Доп.телефон') {
        let linkDopTel = document.createElement('a');
        linkDopTel.classList.add('table__linkContact');
        linkDopTel.innerHTML = `<svg class="tooltip__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
        </svg> <span class="tooltip">${clientItem.contacts[i].type}: <span class="tooltip__link">${clientItem.contacts[i].value}</span></span>`
        divContact.append(linkDopTel)
      }

      tdContact.append(divContact)
    }

    // клики на удалить и изменить
    btnChange.addEventListener('click', () => {
      window.location.hash = clientItem.id;
      onChange({ clientItem, element: line });
    });
    openModal(btnChange)

    btnDelete.addEventListener('click', () => {
      onDelete({ clientItem, element: line });
    });

    line.append(tdId, tdFio, tdCreateTime, tdchangeTime, tdContact, tdchange);
    return line
  };

  //Функция для открытия модального окна после клика на "Изменить"
  function modalAPI(clientItem, element) {
    document.querySelector('.form__social').innerHTML = '';
    document.querySelector('.modal__title').innerHTML = 'Изменить данные';
    document.querySelector('.modal__id').innerHTML = `ID: ${clientItem.id}`;
    inputSurname.value = clientItem.surname;
    inputLastName.value = clientItem.lastName;
    inputName.value = clientItem.name;

    for (let i = 0; i < clientItem.contacts.length; i++) {
      const contact = contactCreate()
      const social = document.querySelector('.form__social');
      contact.contactInput.value = clientItem.contacts[i].value;
      contact.select.value = clientItem.contacts[i].type;
      social.append(contact.contactDiv)
    };

    const selectAll = document.querySelectorAll('.custom-select');
    selectAll.forEach(item => {
      const choices = new Choices(item, {
        itemSelectText: '',
        position: 'bottom',
        searchEnabled: false,
      });
    });

    // const telMask = document.querySelectorAll('.form__select');
    // telMask.forEach(item => {
    //   if (item.value === 'Телефон') {
    //     console.log('yes')
    //     let im = new Inputmask("+7 (999)-999-99-99");
    //     im.mask(item);
    //   }
    // })

    let linkModalClose = document.querySelector('.form__no');
    linkModalClose.innerHTML = 'Удалить клиента';
    deleteClientModal(linkModalClose, clientItem, element)

    document.querySelector('.form').addEventListener('submit', async (e) => {
      e.preventDefault()
      window.location.hash = '';
      //Делаем проверку на наличие текста
      if (!inputSurname.value) {
        inputSurname.classList.add('is-invalid');
        document.querySelector('.surname-validate-js').classList.add('descr__is-invalid')
        return
      } else {
        inputSurname.classList.remove('is-invalid');
        document.querySelector('.surname-validate-js').classList.remove('descr__is-invalid')
      };

      if (!inputName.value) {
        inputName.classList.add('is-invalid');
        document.querySelector('.name-validate-js').classList.add('descr__is-invalid');
        return
      } else {
        inputSurname.classList.remove('is-invalid');
        document.querySelector('.name-validate-js').classList.remove('descr__is-invalid')
      };

      let clientObj = {}

      contactSelect = document.querySelectorAll('.form__select');
      contactValues = document.querySelectorAll('.form__input--select');
      let contactsArr = [];

      for (let i = 0; i < contactSelect.length; i++) {
        contactsArr.push({
          type: contactSelect[i].value,
          value: contactValues[i].value
        })
      }

      clientObj.surname = inputSurname.value.trim();
      clientObj.name = inputName.value.trim();
      clientObj.lastName = inputLastName.value.trim();
      clientObj.contacts = contactsArr;

      document.querySelector('.form__btn').disabled = true;
      await fetch(`http://localhost:3000/api/clients/${clientItem.id}`, {
        method: 'PATCH',
        body: JSON.stringify(clientObj),
        headers: {
          'Content-Type': 'application/json',
        }
      });
    })
  }

  function apihandlers() {
    // При нажатии на кнопку "Изменить", "Удалить" происходит соответствующуе действие
    const handlers = {
      onChange({ clientItem, element }) {
        modalAPI(clientItem, element)
      },
      onDelete({ clientItem, element }) {
        document.querySelector('.client__delete').classList.add('modal-active');
        document.querySelector('.delete__close').addEventListener('click', () => {
          document.querySelector('.client__delete').classList.remove('modal-active');
          return;
        });
        document.querySelector('.delete__btnNo').addEventListener('click', () => {
          document.querySelector('.client__delete').classList.remove('modal-active');
          return;
        });
        document.querySelector('.delete__btn').addEventListener('click', () => {
          element.remove();
          fetch(`http://localhost:3000/api/clients/${clientItem.id}`, {
            method: 'DELETE',
          });
          document.querySelector('.client__delete').classList.remove('modal-active');
        });
      },
    };

    return handlers
  }

  // Функция принимает массив из сервера и добовляет элементы в таблицу
  function apiClients(clientItemList) {
    tableBody.innerHTML = ''
    clientItemList.forEach(clientItem => {
      const todoItemElement = createClientTable(clientItem, apihandlers());
      tableBody.append(todoItemElement);
    });
  }

  // Функция редактирует значения в input
  function fioValid() {
    inputs.forEach(item => {
      item.addEventListener('blur', (event) => {
        let valueInput = event.target.value;

        //убираем пробелы
        let whitespaceNone = valueInput.trim();
        //Изменяем буквы
        let firstLetter = whitespaceNone.substr(0, 1).toUpperCase();
        let nextLetter = whitespaceNone.substr(1).toLowerCase();
        let trueWord = firstLetter + nextLetter;

        event.target.value = trueWord
      })
    })
  };
  fioValid()

  // Отрисовывем таблицу с данными с сервера, добовлеям данные с формы
  async function createTable() {
    let contact = contactCreate();

    // Сразу добовляем данные из сервера в таблицу
    const response = await fetch('http://localhost:3000/api/clients');
    const clientItemList = await response.json();
    apiClients(clientItemList)

    //При клике на кнопку открывается модальное окно в которой мы добовляем студента в таблицу
    document.querySelector('.client__btn').addEventListener('click', () => {
      document.querySelector('.modal__title').innerHTML = 'Новый клиент';

      document.querySelector('.modal__id').innerHTML = '';
      document.querySelector('.form__no').innerHTML = 'Отмена';

      // Отправляем данные студента на сервер, потом на форму
      document.querySelector('.form').addEventListener('submit', async (e) => {
        e.preventDefault()

        //Делаем проверку на наличие текста
        if (!inputSurname.value) {
          inputSurname.classList.add('is-invalid');
          document.querySelector('.surname-validate-js').classList.add('descr__is-invalid');
          return
        } else {
          inputSurname.classList.remove('is-invalid');
          document.querySelector('.surname-validate-js').classList.remove('descr__is-invalid');
        };

        if (!inputName.value) {
          inputName.classList.add('is-invalid');
          document.querySelector('.name-validate-js').classList.add('descr__is-invalid');
          return
        } else {
          inputSurname.classList.remove('is-invalid');
          document.querySelector('.name-validate-js').classList.remove('descr__is-invalid');
        };

        // Добавляем данные клиента в объект
        let clientObj = {}

        contactSelect = document.querySelectorAll('.form__select');
        contactValues = document.querySelectorAll('.form__input--select');
        let contactsArr = [];

        for (let i = 0; i < contactSelect.length; i++) {
          contactsArr.push({
            type: contactSelect[i].value,
            value: contactValues[i].value
          })
        }

        clientObj.surname = inputSurname.value.trim();
        clientObj.name = inputName.value.trim();
        clientObj.lastName = inputLastName.value.trim();
        clientObj.contacts = contactsArr;

        document.querySelector('.form__btn').disabled = true;

        const response = await fetch('http://localhost:3000/api/clients', {
          method: 'POST',
          body: JSON.stringify(clientObj),
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const clientItem = await response.json()

        const tableItemElement = createClientTable(clientItem, apihandlers());

        tableBody.append(tableItemElement);

        inputName.value = '';
        inputLastName.value = '';
        inputSurname = '';
      });
    });

  };
  createTable()

  // Сортировка
  let idIndex = 0;
  let fioIndex = 0;
  let createIndex = 0;
  let updateIndex = 0;
  table.addEventListener('click', async (e) => {
    if (e.target.classList.contains('title-js')) {
      tableBody.innerHTML = `<div class="preloader">
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M4.00025 40.0005C4.00025 59.8825 20.1182 76.0005 40.0002 76.0005C59.8822 76.0005 76.0002 59.8825 76.0002 40.0005C76.0002 20.1185 59.8823 4.00049 40.0003 4.00049C35.3513 4.00048 30.9082 4.88148 26.8282 6.48648"
            stroke="#9873FF" stroke-width="8" stroke-miterlimit="10" stroke-linecap="round" />
    </svg>
  </div>`;
      const response = await fetch('http://localhost:3000/api/clients');
      const data = await response.json();
      switch (e.target.getAttribute('data-sort')) {
        case 'id':
          idIndex++
          if (idIndex % 2 === 0) {
            data.sort((prev, next) => parseInt(prev.id) > parseInt(next.id) ? 1 : -1);
          } else {
            data.sort((prev, next) => parseInt(prev.id) < parseInt(next.id) ? 1 : -1);
          }
          document.querySelector('.arrow-id-js').classList.toggle('table__arrow--click');
          apiClients(data)
          break;
        case 'fio':
          fioIndex++
          if (fioIndex % 2 === 0) {
            data.sort((prev, next) => `${prev.surname} ${prev.name} ${prev.lastName}` < `${next.surname} ${next.name} ${next.lastName}` ? 1 : -1);
          } else {
            data.sort((prev, next) => `${prev.surname} ${prev.name} ${prev.lastName}` > `${next.surname} ${next.name} ${next.lastName}` ? 1 : -1);
          }
          document.querySelector('.arrow-fio-js').classList.toggle('table__arrow--click')
          apiClients(data)
          break;
        case 'create':
          createIndex++
          if (createIndex % 2 === 0) {
            data.sort((prev, next) => prev.createdAt > next.createdAt ? 1 : -1);
          } else {
            data.sort((prev, next) => prev.createdAt < next.createdAt ? 1 : -1);
          }
          document.querySelector('.arrow-create-js').classList.toggle('table__arrow--click');
          apiClients(data)
          break;
        case 'change':
          updateIndex++
          if (updateIndex % 2 === 0) {
            data.sort((prev, next) => prev.updatedAt > next.updatedAt ? 1 : -1);
          } else {
            data.sort((prev, next) => prev.updatedAt < next.updatedAt ? 1 : -1);
          }
          document.querySelector('.arrow-change-js').classList.toggle('table__arrow--click')
          apiClients(data)
          break;
        default:
          break;
      }
    }
  })

  // Поиск клиента
  async function clientSearch() {
    const response = await fetch('http://localhost:3000/api/clients');
    let data = await response.json();
    const inputSearch = document.querySelector('.header__search');
    let interval;
    rest = [];

    function clientSearchCreate() {
      Object.assign(rest, data)
      tableBody.innerHTML = ''
      if (inputSearch.value.length) {
        rest = data.filter(item => {
          if (`${item.surname} ${item.name} ${item.lastName}`.toLowerCase().includes(inputSearch.value.toLowerCase())) {
            return item;
          }
        })
      }
      apiClients(rest)
    }

    inputSearch.addEventListener('input', () => {
      clearInterval(interval)
      interval = setTimeout(clientSearchCreate, 300)
    });
  };
  clientSearch()
});

// select
// (function ($) {
//   $(function () {

//     $('select').styler();

//   });
// })(jQuery);