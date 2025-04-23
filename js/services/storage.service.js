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
      if (!data) return {};

      const preferences = JSON.parse(data);

      // Перевіряємо наявність обов'язкових полів
      if (!preferences.dob || !preferences.region || !preferences.gender) {
        console.warn("Збережені дані не містять обов'язкових полів");
        return {};
      }

      // Перевіряємо правильність дати народження
      const dobDate = new Date(preferences.dob);
      if (isNaN(dobDate.getTime()) || dobDate > new Date()) {
        console.warn("Некоректна дата народження у збережених даних");
        return {};
      }

      return preferences;
    } catch (error) {
      console.error("Storage Error:", error);
      // У випадку помилки повертаємо порожній об'єкт
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
