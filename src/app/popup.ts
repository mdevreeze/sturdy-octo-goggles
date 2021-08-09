var browser = require("webextension-polyfill");


import 'styles/popup.scss'

class Popup {
  constructor () {
    document.addEventListener('DOMContentLoaded', () => this.bind());
  }

  bind () {
    document.querySelectorAll("#negative-label-filter")[0].addEventListener("click", () => {
      browser.tabs.query({active: true, currentWindow: true})
        .then((tabs) => browser.tabs.sendMessage(tabs[0].id, "negative-label-filter"));
    });
  }
}

export const popup = new Popup()
