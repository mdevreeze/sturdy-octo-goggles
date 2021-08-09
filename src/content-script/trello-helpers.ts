export function hideCard(card) {
    card.style.height = '0px';
    card.classList.add('hide');
  }

export function showCard(card) {
    card.style.removeProperty('height');
    card.classList.remove('hide');        
}

export function getAllLists() {
  return Array.from(document.querySelectorAll(".list"));
}

export function getCardsFromList(list: HTMLElement) {
  return Array.from(list.querySelectorAll('.list-card'));
}

function onlyUnique(value, index, self) {
  return self.map(e => e.title).indexOf(value.title) === index;
}

export function getListLabels(list: HTMLElement) {
  return Array.from(list.querySelectorAll(".card-label"));
}

export function getListLabelsDistinct(list: HTMLElement) {
  return getListLabels(list).map((l) => {
    const title = l.getAttribute('title')
    const colorClass = Array.from(l.classList).find((c) => c.startsWith("card-label-"))
    return { title, colorClass };
  }).filter(onlyUnique);
}

export function getCardLabels(card: Element) {
  return Array.from(card.querySelectorAll(".card-label"))
}