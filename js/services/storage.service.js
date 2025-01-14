// services/storage.service.js
import { CONFIG } from "../config.js";

export class StorageService {
  static savePreferences(preferences) {
    try {
      localStorage.setItem(
        CONFIG.STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(preferences)
      );
      return true;
    } catch (error) {
      console.error("Storage Error:", error);
      return false;
    }
  }

  static getPreferences() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Storage Error:", error);
      return {};
    }
  }

  static saveTheme(theme) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
  }

  static getTheme() {
    return (
      localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || CONFIG.DEFAULTS.THEME
    );
  }
}
