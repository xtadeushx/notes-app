import { createElement } from "../../helpers/helper.js";

function renderRow(element) {
  const item = createElement({
    tagName: 'li',
    className: `table__item item `,
  });

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
  itemCreatedAt.textContent = element.active;
  item.appendChild(itemCreatedAt);

  const itemCategory = createElement({
    tagName: 'p',
    className: 'item__category',
  });
  itemCategory.textContent = element.archived;
  item.appendChild(itemCategory);

  return item;
}

export {renderRow}