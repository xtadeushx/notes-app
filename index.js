import { DATA } from './data.js';
import { createElement } from './domHelper.js';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.table');
  const DATA_STATE = [...DATA];

  const list = createElement({
    tagName: 'ul',
    className: 'table__list',
  });

  table.appendChild(list);

  render(DATA_STATE, list);
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
          editItem();
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

function editItem() {
  console.log('edit');
}

function addToArchiveItem() {
  console.log('archive');
}
