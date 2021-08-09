/*!
 * Chrome Extension Boilerplate - Storage 1.2
 * https://github.com/williankeller/chrome-extension-boilerplate/blob/master/src/utils/storage.min.js
 * Copyright 2017 "Chrome Extension Boilerplate"
 * Licensed under MIT
 */

/* global chrome, browser */

import { browser, Storage as BrowserStorage } from "webextension-polyfill-ts";

/**
 * Define Chrome storage settings.
 */
export class Storage {
  /**
   * Make sure we are initializing the storage.
   */
  synchronize(): BrowserStorage.LocalStorageArea | BrowserStorage.StorageAreaSync {
    let section: BrowserStorage.LocalStorageArea | BrowserStorage.StorageAreaSync = undefined;

    // Try to request as Chrome.
    try {
      if (browser.storage) {
        // Check if exist sync session.
        if (browser.storage.sync) {
          section = browser.storage.sync
        } else { // Else, get local value.
          section = browser.storage.local
        }
      }
    } catch (e) { }

    // Try to request as Window.
    try {
      if ((window as any).storage) {
        section = (window as any).storage.local as BrowserStorage.LocalStorageArea
      }
    } catch (e) { }

    // Try to request as Browser.
    try {
      if (browser.storage) {
        section = browser.storage.local
      }
    } catch (e) { }

    // Return element of session.
    return section
  }

  /**
   * Save values under Chrome Storage.
   * An object which gives each key/value pair to update storage with.
   * Any other key/value pairs in storage will not be affected.
   */
  save(keys: any): Promise<boolean> {
    return new Promise(async resolve => {
      await this.synchronize().set(keys);
      resolve(true)
    })
  }

  /**
   * Gets one or more items from storage.
   * A single key to get, list of keys to get, or a dictionary specifying
   * default values (see description of the object).
   * An empty list or object will return an empty result object.
   * Pass in null to get the entire contents of storage.
   */
  get(keys: any): Promise<{ [s: string]: any }> {
    return new Promise(async resolve => {
      const items = await this.synchronize().get(keys);
      resolve(items)
    })
  }

  /**
   * Removes one or more items from storage.
   */
  remove(keys: any): Promise<void> {
    return new Promise(async resolve => {
      await this.synchronize().remove(keys)
      resolve();
    });
  }
}

export const storage = new Storage()
