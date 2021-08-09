import { browser } from "webextension-polyfill-ts";
import * as TrelloHelpers from "./trello-helpers";
import { createElement } from "./dom-helpers";
import "../styles/content.scss"

browser.runtime.onMessage.addListener((message) => {
  if (message === "negative-label-filter") {
    init();
  }
});

function init() {
  TrelloHelpers.getAllLists().forEach((list) => {
    addLabelsToSubHeader(list);
  });
}

function buttonClicked(list: HTMLElement, labelName) {
  const cards = TrelloHelpers.getCardsFromList(list);
  // show all cards first
  cards.forEach(TrelloHelpers.showCard);

  const cardElements = cards.filter(card => TrelloHelpers.getCardLabels(card)
        .some((l) => l.getAttribute("title") == labelName ))
  cardElements.forEach(card => {
    TrelloHelpers.hideCard(card);
  })
}

function addLabelsToSubHeader(list){
  const labels = TrelloHelpers.getListLabelsDistinct(list);
  if (!labels) {
    // nothing to do, no labels in this list
    return;
  }

  sortLabels(labels);

  const header = list.querySelector('.list-header');
  let subHeader = list.querySelector(`.negative-label-filter-list-sub-header`);
  if (!subHeader) {
    subHeader = createElement('div', [`negative-label-filter-list-sub-header`]);
    header.parentElement.insertBefore(subHeader, header.nextElementSibling);
  }

  // clear any previous added elements
  subHeader.innerHTML = '';

  // Construct the li label elements
  const buttons = labels.map(l => createAndAddLabelElement(list, l.title, l.colorClass));
  // Add reset button
  const resetButton = createAndAddLabelElement(list, "Reset", "card-label-darkgray");
  subHeader.appendChild(createElement("ul", ["negative-label-filter-list"], undefined, [...buttons, resetButton]));
}

function sortLabels(labels) {
  labels.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    } else if (a.title > b.title) {
      return 1;
    }
    return 0;
  });
}

const buttonActiveClass = `negative-label-filter-active`;
function createAndAddLabelElement(list: HTMLElement, title, colorClass){
  const button = createElement("button", [ colorClass ], { innerText: title });
  button.addEventListener('click', (event) => {
    buttonClicked(list, title)
    Array.from(list.querySelectorAll(`.${buttonActiveClass}`)).forEach((i) => {
      i.classList.remove(buttonActiveClass)
    });
    button.classList.add(buttonActiveClass);
    event.stopPropagation();
  });

  return createElement('li', ["negative-label-filter-list-item", "negative-label-filter-list-item-clickable"], undefined, [button]);
}
