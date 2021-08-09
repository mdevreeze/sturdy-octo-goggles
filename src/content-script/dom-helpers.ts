export function createElement(
  tagName, 
  classNames: string[] = undefined, 
  attributes: { [key: string]: string} = undefined, 
  children: Element[] = undefined) 
  {
  const element = Object.assign(document.createElement(tagName), attributes);
  if (classNames) {
    for(const className of classNames) {
      element.classList.add(className);
    }
  }
  if (children) {
    for(const child of children) {
      element.appendChild(child);
    }
  }
  return element;
}