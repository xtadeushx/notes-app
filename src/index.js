import { DATA } from '../src/models/data.js';
import { formatDateLong, createElement, formatDateShort } from '../src/helpers/helper.js';
import { renderRow } from '../src/components/ui/renderRow.js';

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
  let NOTES_LIST = [...DATA];
  const table = document.querySelector('.table');
  const modal = document.querySelector('.modal');
  const addNoteButton = document.querySelector('#add-note');
  const closeButton = document.querySelector('.close');

  let archivedNotes = NOTES_LIST.reduce((acc, prev) => {
    if (prev.status === 'archived') {
      acc[prev.category]++;
    } else {
      acc[prev.category] = 1;
    }
    return acc;
  }, {});

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


  function render(data, root) {
    const list = document.querySelector('.table__list')
    if (!list) return
    list.innerHTML = '';
    data.forEach((el) => {
      const item = renderRow(el);

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
            editItem(event, data, root);
            break;

          default:
            break;
        }
      });

      list.appendChild(item);
    });
  }


  function deleteItem(id, data, root) {
    const updatedData = data.filter((el) => el.id !== id);
    NOTES_LIST = [...updatedData];
    render(updatedData, root);
  }

  function editItem(event, data, root) {

    const modal = document.querySelector('.modal');
    const form = document.querySelector('#form');
    const currentId = event.target.closest('li').getAttribute('id');
    const currentItem = data.find((el) => el.id == currentId);

    if (!currentItem) return;
    form.elements.title.value = currentItem.title;
    form.elements.category.value = currentItem.category.toUpperCase();
    form.elements.content.value = currentItem.content;
    form.elements.date.value = new Date(currentItem.createdAt).toISOString().split('T')[0]; // Correctly set the date value
    handelModalVisible(modal);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(form).entries());

      const isFormValid = isValid(formData);
      if (!isFormValid) return;

      const correctedItem = {
        ...currentItem,
        src: ICONS_SRC[formData?.category?.toLowerCase()],
        title: formData.title,
        createdAt: formatDateLong(new Date(formData.date)),
        category: formData?.category,
        content: [formData.content],
        dates: [...currentItem.dates, formatDateShort(new Date(formData.date))],
      };

      const updatedData = data.map((el) => (el.id === +currentId ? correctedItem : el));
      NOTES_LIST = [...updatedData];
      console.log(NOTES_LIST);
      render(updatedData, root);
      handelModalHide(modal);
    });
  }

  function addToArchiveItem() {
    console.log('archive');
  };

  function openModal(el, target) {
    el.addEventListener('click', () => {
      handelModalVisible(target);
    });
  };

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
  };

  function addNewItem(modal, root) {
    const form = document.querySelector("#form");
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      const isFormValid = isValid(data);
      if (!isFormValid) return;

      const newItem = {
        id: Math.random().toString(),
        src: ICONS_SRC[data.category.toLowerCase()],
        title: data.title,
        createdAt: formatDateLong(new Date(Date.now())),
        category: data.category,
        content: [data.content],
        dates: [],
      };

      const updatedData = [...NOTES_LIST, newItem];
      NOTES_LIST = [...updatedData];
      render(updatedData, root);
      handelModalHide(modal);
    });
  };

  function handelModalHide(modal) {
    modal.classList.remove(CLASSES.MODAL_ACTIVE);
    modal.classList.add(CLASSES.MODAL_HIDE);
  };

  function handelModalVisible(modal) {
    modal.classList.add(CLASSES.MODAL_ACTIVE);
    modal.classList.remove(CLASSES.MODAL_HIDE);
  };
});


function isValid(data) {
  if (!data.title && !data.title.trim()) {
    return false;
  }
  if (!data.category) {
    return false;
  }
  if (!data.content && !data.content.trim()) {
    return false;
  }
  if (!data.date) {
    return false;
  }
}