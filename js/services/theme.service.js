// services/theme.service.js
import { CONFIG } from "../config.js";
import { StorageService } from "./storage.service.js";

export class ThemeService {
  static initialize() {
    const savedTheme = StorageService.getTheme();
    this.setTheme(savedTheme);
  }

  static setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    StorageService.saveTheme(theme);
  }

  static toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme =
      currentTheme === CONFIG.THEMES.LIGHT
        ? CONFIG.THEMES.DARK
        : CONFIG.THEMES.LIGHT;
    this.setTheme(newTheme);
  }
}
