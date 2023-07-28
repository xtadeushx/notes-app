import { createElement } from "../../helpers/helper.js";
function renderSummaryRow(element) {
  const item = createElement({
    tagName: 'li',
    className: `table__item item table__item--summary`,
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

  const itemActive = createElement({
    tagName: 'p',
    className: 'item-summary__active',
  });
  itemActive.textContent = element.status.active;
  item.appendChild(itemActive);

  const itemArchived = createElement({
    tagName: 'p',
    className: 'item-summary__archived',
  });
  itemArchived.textContent = element.status.archived;
  item.appendChild(itemArchived);

  return item;
}

export {renderSummaryRow}