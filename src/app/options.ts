import { storage } from './utils/storage'
import '../styles/options.scss'

class Options {
  private defaults = {
    messageSuccess: 'Options saved successfully!',
    messageError: 'Please fill all items in the form.',
    messageTime: 2000
  };

  constructor() {
    document.addEventListener('DOMContentLoaded', () => this.bind());
  }

  bind() {
    /**
    * Detect click action under save button.
    */
    document.querySelector('.save-options').addEventListener("click", () => {
      // Get filled
      const options = this.getOptions()

      // Check if exists some field filled.
      if (!options.standard) {
        // Set error message.
        this.response(this.defaults.messageError, 'error')
        return
      }

      // Store values to the Chrome storage.
      storage.save(options)
        .then(() => {
          this.response(this.defaults.messageSuccess, 'success')
        })
    })

    // Set default options or saved options already.
    this.setOptions()
  }

  /**
   * Get values from the form
   *
   * @param {Callback} callback
   */
  getOptions() {
    return {
      standard: (document.querySelector('#default-input') as HTMLInputElement).value,
      checkbox: (document.querySelector('#default-checkbox') as HTMLInputElement).checked
    }
  }

  /**
   * Retrieve values from Chrome storage and set as default value.
   */
  setOptions() {
    storage.get({
      standard: '',
      checkbox: false
    }).then((data) => {
      // Set degault values or saved options.
      (document.querySelector('#default-input') as HTMLInputElement).value = data.standard,
        (document.querySelector('#default-checkbox') as HTMLInputElement).checked = data.checkbox
    })
  }

  /**
   * Set message to the options container.
   *
   * @param {String} message
   * @param {String} classname
   */
  response(message, classname) {
    // Set text message.
    document.querySelector('.response').innerHTML = message;
    // Add provided class.
    document.querySelector('.response').classList.add(classname);

    // Remove class after defined time.
    setTimeout(() => {
      document.querySelector('.response').classList.remove(classname);
    }, this.defaults.messageTime)
  }
}

export const options = new Options()
