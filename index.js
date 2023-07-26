import { DATA } from './data.js';
import { formatDateLong, formatDateShort } from './helpers/dateHelper.js';
import { createElement } from './helpers/domHelper.js';

const CLASSES = {
  MODAL_ACTIVE: 'modal-active',
  MODAL_HIDE: 'modal-hide',
};

const ICONS_SRC = {
  task: './assets/shopping-cart.png',
  'random thoughts': './assets/thought.png',
  idea: './assets/lightbulb.png',
  quote: './assets/quote.png',
};

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.table');
  const modal = document.querySelector('.modal');
  const NOTES_LIST = [...DATA];
  const addNoteButton = document.querySelector('#add-note');
  const closeButton = document.querySelector('.close');

  let isEdiMode = false;

  const list = createElement({
    tagName: 'ul',
    className: 'table__list',
  });

  table.appendChild(list);

  render(NOTES_LIST, list);

  openModal(addNoteButton, modal);

  closeModal(closeButton, modal);

  addNewItem(modal, NOTES_LIST, list);
});

function render(data, root) {
  root.innerHTML = '';
  data.map((el) => {
    const item = createElement({
      tagName: 'li',
      className: 'table__item item',
    });
    item.id = el.id;
    item.addEventListener('click', (event) => {
      let key = event.target?.closest('button')?.getAttribute('data-set');
      switch (key) {
        case 'delete':
          deleteItem(el.id, data, root);
          break;
        case 'archive':
          addToArchiveItem();
          break;
        case 'edit':
          editItem(event, data);
          break;

        default:
          break;
      }
    });
    item.innerHTML = `
    <div class="item__img-container">
      <span class="item__img-wrapper"><img class="item__img button--light" src=${
        el.src
      }
          alt=${el.title}></span>
      <p class="item__title">${el.title}</p>
    </div>
    <p class="item__createdAt">${el.createdAt}</p>
    <p class="item__category">${el.category}</p>
    <p class="item__content">${el.content.join(', ')}</p>
    <p class="item__dates">${el.dates.join(', ')}</p>
    <div class="item__buttons buttons__wrapper">
      <button class="button edit" data-set='edit'><img src="./assets/editing.png" alt="editing button"></button>
      <button class="button archive" data-set='archive'><img src="./assets/archive.png" alt="archive button"></button>
      <button class="button delete" data-set='delete'><img src="./assets/delete.png" alt="delete button"></button>
    </div>`;

    root.appendChild(item);
  });
}

function deleteItem(id, data, root) {
  const NEW_DATA = data.filter((el) => el.id != +(+id));
  render(NEW_DATA, root);
}

function editItem(event, data) {
  const modal = document.querySelector('.modal');
  const form = document.querySelector('#form');
  const currentId = event.target?.closest('li').getAttribute('id');
  const currentItem = data.find((el) => el.id == currentId);

  if (!currentItem) return;
  form.elements.name.value = currentItem.title;
  form.elements.select.value = currentItem.category.toUpperCase();
  form.elements.content.value = currentItem.content;
  form.elements.date.value = new Date(currentItem.content.createdAt);
  console.log(form.elements.select.value);

  handelModalVisible(modal);
}

function addToArchiveItem() {
  console.log('archive');
}

function openModal(el, target) {
  el.addEventListener('click', () => {
    handelModalVisible(target);
  });
}

function closeModal(trigger, modal) {
  document.addEventListener('click', (event) => {
    if (
      (event.target.classList.contains('close') && trigger) ||
      event.target.classList.contains('modal__wrapper')
    ) {
      handelModalHide(modal);
    } else {
      return;
    }
  });
}

function addNewItem(modal, notesList, root) {
  const form = document.querySelector('#form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    const newItem = {
      id: Math.random().toString(),
      src: ICONS_SRC[data.category.toLowerCase()],
      title: data.title,
      createdAt: formatDateLong(new Date(Date.now())),
      category: data.category,
      content: [data.content],
      dates: [],
    };

    notesList.push(newItem);

    render(notesList, root);

    handelModalHide(modal);
  });
}

function handelModalHide(modal) {
  modal.classList.remove(CLASSES.MODAL_ACTIVE);
  modal.classList.add(CLASSES.MODAL_HIDE);
}
function handelModalVisible(modal) {
  modal.classList.add(CLASSES.MODAL_ACTIVE);
  modal.classList.remove(CLASSES.MODAL_HIDE);
}
