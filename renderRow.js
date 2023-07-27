import { createElement } from "./helpers/domHelper.js";

function renderRow(element) {
  const item = createElement({
    tagName: 'li',
    className: 'table__item item',
  });
  item.id = element.id;

  const itemContainer =  createElement({
    tagName: 'div',
    className: 'item__img-container',
  });

  const imgWrapper =  createElement({
    tagName: 'span',
    className: 'item__img-wrapper',
  });

const img =  createElement({
    tagName: 'img',
    className: 'item__img button--light',
    attributes:{
    src: element.src,
    alt: element.title
    }
  });
  imgWrapper.appendChild(img);

  const itemTitle = createElement({
    tagName: 'p',
    className: 'item__title',
  });
  itemTitle.textContent = element.title;

  itemContainer.appendChild(imgWrapper);
  itemContainer.appendChild(itemTitle);

  item.appendChild(itemContainer);

  const itemCreatedAt = createElement({
    tagName: 'p',
    className: 'item__createdAt',
  });
  itemCreatedAt.textContent = element.createdAt;
  item.appendChild(itemCreatedAt);

  const itemCategory = createElement({
    tagName: 'p',
    className: 'item__category',
  });
  itemCategory.textContent = element.category;
  item.appendChild(itemCategory);

  const itemContent = createElement({
    tagName: 'p',
    className: 'item__content',
  });
  itemContent.textContent = element?.content.join(', ');
  item.appendChild(itemContent);

  const itemDates = createElement({
    tagName: 'p',
    className: 'item__dates',
  });
  itemDates.textContent = element?.dates.join(', ');
  item.appendChild(itemDates);

  const buttonsWrapper = createElement({
    tagName: 'div',
    className: 'item__buttons buttons__wrapper',
  });

  const editButton = createElement({
    tagName: 'button',
    className: 'button edit',
    attributes:{
      ['data-set']: 'edit',
      }
  });
  const editIcon =  createElement({
    tagName: 'img',
    className: 'item__img',
    attributes:{
    src: "./assets/editing.png",
    alt: "edit button"
    }
  });
  editButton.appendChild(editIcon);

  const archiveButton = createElement({
    tagName: 'button',
    className: 'button archive',
    attributes:{
      ['data-set']: 'archive',
      }
  });
  const archiveIcon =  createElement({
    tagName: 'img',
    className: 'item__img',
    attributes:{
    src: "./assets/archive.png",
    alt: "archive button"
    }
  });
  archiveButton.appendChild(archiveIcon);

  const deleteButton = createElement({
    tagName: 'button',
    className: 'button delete',
    attributes:{
      ['data-set']: 'delete',
      }
  });
  const deleteIcon =  createElement({
    tagName: 'img',
    className: 'item__img',
    attributes:{
    src: "./assets/delete.png",
    alt: "delete button"
    }
  });

  deleteButton.appendChild(deleteIcon);

  buttonsWrapper.appendChild(editButton);
  buttonsWrapper.appendChild(archiveButton);
  buttonsWrapper.appendChild(deleteButton);

  item.appendChild(buttonsWrapper);

  return item;
}

export {renderRow}