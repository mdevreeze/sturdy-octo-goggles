import "styles/content.scss";
import { browser } from "webextension-polyfill-ts";

browser.runtime.onMessage.addListener((message) => {
  if (message === "negative-label-filter") {
    init();
  }
});

function init() {
  const lists = Array.from(document.querySelectorAll(".list"));
  lists.forEach((list) => {
    addLabelsToSubHeader(list);
  });
}

function buttonClicked(list: HTMLElement, labelName) {
  const cards = Array.from(list.querySelectorAll('.list-card'));
  // show all cards first
  cards.forEach((card) => {
    showCard(card);
  });

  const cardElements = cards.filter((c) => Array.from(c.querySelectorAll(".card-label"))
        .some((l) => l.getAttribute("title") == labelName ))
  cardElements.forEach(card => {
    hideCard(card);
  })
}

function onlyUnique(value, index, self) {
  return self.map(e => e.title).indexOf(value.title) === index;
}

function getUniqueLabelsInList(listElement: HTMLElement) {
  return Array.from(listElement.querySelectorAll(".card-label"))
    .map((l) => {
      const title = l.getAttribute('title')
      const colorClass = Array.from(l.classList).find((c) => c.startsWith("card-label-"))
      return { title, colorClass };
    }).filter(onlyUnique);
}

function hideCard(card) {
    card.style.height = '0px';
    card.classList.add('hide');
  }

function showCard(card) {
    card.style.removeProperty('height');
    card.classList.remove('hide');        
}

function addLabelsToSubHeader(list){
  const labels = getUniqueLabelsInList(list);
  const header = list.querySelector('.list-header');
  let subHeader = list.querySelector(`.negative-label-filter-list-sub-header`);

  if (!subHeader) {
    subHeader = document.createElement('div');
    subHeader.className = `negative-label-filter-list-sub-header`;
    header.parentElement.insertBefore(subHeader, header.nextElementSibling);
  }

  subHeader.innerHTML = '';

  if (labels.length) {
    const ul = document.createElement('ul');
    ul.className = `negative-label-filter-list`;
    
    // Sort all labels
    labels.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      } else if (a.title > b.title) {
        return 1;
      }

      return 0;
    });

    // Construct the label elements
    for (const label of labels) {
      const button = createAndAddLabelElement(ul, list, label.title, label.colorClass);
    }

    // Add reset button
    createAndAddLabelElement(ul, list, "Reset", "card-label-darkgray");

    subHeader.appendChild(ul);
  }
}

const buttonActiveClass = `negative-label-filter-active`;
function createAndAddLabelElement(ul: HTMLElement, list: HTMLElement, title, colorClass){
  const button = document.createElement("button");
  button.innerText = title;

  // Add color class from trello
  button.classList.add(colorClass);

  const li = document.createElement('li');
  li.classList.add(`negative-label-filter-list-item`, `negative-label-filter-list-item-clickable`);

  li.appendChild(button);

  ul.appendChild(li);

  button.addEventListener('click', (event) => {

    buttonClicked(list, title)
    Array.from(list.querySelectorAll(`.${buttonActiveClass}`)).forEach((i) => {
      i.classList.remove(buttonActiveClass)
    });
    button.classList.add(buttonActiveClass);
    event.stopPropagation();
  });
}
