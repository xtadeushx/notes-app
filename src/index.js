import { DATA } from '../src/models/data.js';
import { formatDateLong, createElement, formatDateShort, mappingNotesStatus } from '../src/helpers/helper.js';
import { renderRow } from '../src/components/ui/renderRow.js';
import { renderSummaryRow } from './components/ui/renderSummary.js';
import { STATUSES, ICONS_SRC } from './constants/constants.js';

const CLASSES = {
  MODAL_ACTIVE: 'modal-active',
  MODAL_HIDE: 'modal-hide',
};

document.addEventListener('DOMContentLoaded', () => {
  let NOTES_LIST = [...DATA];
  const table = document.querySelector('.table');
  const summaryTable = document.querySelector('.table__summary');
  const modal = document.querySelector('.modal');
  const addNoteButton = document.querySelector('#add-note');
  const closeButton = document.querySelector('.close');
  const deleteAllButton = document.querySelector('#deleteAllButton');
  const archiveAllButton = document.querySelector('#archiveAllButton');

  let statusNotes = mappingNotesStatus(NOTES_LIST, 'archived');

  let isEditMode = false;
  let archivedMode = true;
  const list = createElement({
    tagName: 'ul',
    className: 'table__list',
  });
  table.appendChild(list);

  const summaryList = createElement({
    tagName: 'ul',
    className: 'table__list table-summary__list',
  });

  summaryTable.appendChild(summaryList);

  deleteAllButton.addEventListener('click', () => deleteAllItems(list, summaryList));
  archiveAllButton.addEventListener('click', () => archiveAllItems(list, summaryList));

  render(NOTES_LIST, list);

  renderSummary(statusNotes, summaryList);

  openModal(addNoteButton, modal);
  closeModal(closeButton, modal);

  addNewItem(modal, list);


  function render(data, root) {
    root.innerHTML = '';
    data.forEach((el) => {
      const item = renderRow(el);

      item.addEventListener('click', (event) => {
        let key = event.target?.closest('button')?.getAttribute('data-set');
        switch (key) {
          case 'delete':
            deleteItem(el.id, data, root);
            break;
          case 'archive':
            archivedItem(el.id, data, root);
            break;
          case 'edit':
            editItem(el.id, data, root);
            break;

          default:
            break;
        }
      });

      root.appendChild(item);
    });
  }

  function renderSummary(data, root) {
    root.innerHTML = '';
    const summaryNotesList = [];
    for (const iterator in data) {
      const newItem = {
        src: ICONS_SRC[iterator.toLowerCase()],
        title: iterator,
        status: {
          archived: data[iterator].status.archived,
          active: data[iterator].status.active
        }
      }
      summaryNotesList.push(newItem);
    }

    summaryNotesList.forEach((el) => {
      const item = renderSummaryRow(el);
      root.appendChild(item);
    })
  }

  function deleteItem(id, data, root) {
    const updatedData = data.filter((el) => el.id !== id);
    NOTES_LIST = [...updatedData];
    render(updatedData, root);
  }

  function editItem(id, data, root) {
    isEditMode = true;
    const modal = document.querySelector('.modal');
    const form = document.querySelector('#form');
    const currentItem = data.find((el) => el.id === id);
    if (!currentItem) return;
    form.elements.title.value = currentItem.title;
    form.elements.category.value = currentItem.category;
    form.elements.content.value = currentItem.content;
    form.elements.date.value = new Date(currentItem.createdAt).toISOString().split('T')[0];
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

      const updatedData = data.map((el) => (el.id === id ? correctedItem : el));
      NOTES_LIST = [...updatedData];
      render(updatedData, root);
      handelModalHide(modal);
    });
  }

  function archivedItem(id, data, root) {
    const currentItem = data.find((el) => el.id === id);
    if (!currentItem) return;

    const correctedItem = {
      ...currentItem,
      status: currentItem.status === STATUSES.ACTIVE ? STATUSES.ARCHIVED: STATUSES.ACTIVE
    };

    const updatedData = data.map((el) => (el.id === id ? correctedItem : el));
    NOTES_LIST = [...updatedData];
    const statusNotes = mappingNotesStatus(NOTES_LIST, STATUSES.ARCHIVED);
    render(updatedData, root);
    renderSummary(statusNotes, summaryList);
  };

  function addNewItem(modal, root) {
    isEditMode = false;
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
        status: STATUSES.ACTIVE
      };

      const updatedData = [...NOTES_LIST, newItem];
      NOTES_LIST = [...updatedData];
      render(updatedData, root);
      handelModalHide(modal);
    });
  };

  function deleteAllItems(root1, root2) {
    NOTES_LIST = [];
    render(NOTES_LIST, root1);
    renderSummary(NOTES_LIST, root2)
  }

  function archiveAllItems(root1, root2) {
    NOTES_LIST = NOTES_LIST.map(el => {
      return {
        ...el,
        status: archivedMode ?  STATUSES.ARCHIVED : STATUSES.ACTIVE
      }
    });
    archivedMode = !archivedMode;
    render(NOTES_LIST, root1);
    const statusNotes = mappingNotesStatus(NOTES_LIST, STATUSES.ARCHIVED);
    renderSummary(statusNotes, root2);
  }
  // ==========Modal =============
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

  function handelModalHide(modal) {
    modal.classList.remove(CLASSES.MODAL_ACTIVE);
    modal.classList.add(CLASSES.MODAL_HIDE);
  };

  function handelModalVisible(modal) {
    const dateLabel = document.querySelector('#dateLabel')
    const addNoteButton = document.querySelector('#add-note__button')
    if (!dateLabel || !addNoteButton) return;
    dateLabel.style.display = `${isEditMode ? 'block' : 'none'}`
    addNoteButton.textContent = `${isEditMode ? 'Edit note' : 'Add note'}`
    modal.classList.add(CLASSES.MODAL_ACTIVE);
    modal.classList.remove(CLASSES.MODAL_HIDE);
  };

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
    if (!data.date && isEditMode) {
      return false;
    } else {
      return true;
    }
  }

});

