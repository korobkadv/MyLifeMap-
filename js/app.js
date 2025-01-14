// Імпорт конфігурації
import { CONFIG } from "./config.js";

// Імпорт представлень
import { VisualizationView } from "./views/visualization.view.js";
import { StatsView } from "./views/stats.view.js";
import { ModalView } from "./views/modal.view.js";

// Імпорт сервісів
import { ApiService } from "./services/api.service.js";
import { StorageService } from "./services/storage.service.js";
import { ExportService } from "./services/export.service.js";
import { ThemeService } from "./services/theme.service.js";

// Імпорт моделей
import { LifeCalculator } from "./models/life-calculator.js";
import { UserPreferences } from "./models/user-preferences.js";

class App {
  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      // Ініціалізація сервісів
      this.initializeServices();

      // Ініціалізація представлень
      this.initializeViews();

      // Гарантуємо що секція статистики прихована при старті
      this.hideStatsSection();

      // Налаштування обробників подій
      this.setupEventListeners();

      // Завантаження початкових даних
      await this.loadInitialData();

      // Відновлення збережених налаштувань
      this.restoreUserPreferences();
    } catch (error) {
      this.handleError(error);
    }
  }

  initializeServices() {
    try {
      // Ініціалізація теми
      ThemeService.initialize();

      // Отримання збережених налаштувань
      const savedPreferences = StorageService.getPreferences();
      this.preferences = new UserPreferences(savedPreferences);
    } catch (error) {
      console.error("Service initialization error:", error);
      // Створюємо preferences з дефолтними значеннями у випадку помилки
      this.preferences = new UserPreferences();
    }
  }

  initializeViews() {
    // Ініціалізація основних елементів інтерфейсу
    this.form = document.getElementById("user-form");
    this.loader = document.getElementById("loader");
    this.statsSection = document.getElementById("stats-section");

    // Ініціалізація представлень
    this.visualizationView = new VisualizationView(
      document.getElementById("visualization")
    );
    this.statsView = new StatsView(document.getElementById("stats-summary"));
    this.modalView = new ModalView();
  }

  setupEventListeners() {
    // Обробка подій форми
    this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
    this.form.addEventListener("change", this.handleFormChange.bind(this));

    // Обробка кнопок
    document
      .getElementById("theme-toggle")
      .addEventListener("click", () => ThemeService.toggleTheme());
    document
      .getElementById("export-btn")
      .addEventListener("click", this.handleExport.bind(this));
    document
      .getElementById("share-btn")
      .addEventListener("click", this.handleShare.bind(this));

    // Обробка зміни розміру вікна
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  async loadInitialData() {
    this.showLoader();
    try {
      const data = await ApiService.getLifeExpectancyData();
      this.populateCountrySelect(data);
      this.lifeExpectancyData = data;
    } catch (error) {
      throw new Error("Не вдалося завантажити дані про тривалість життя");
    } finally {
      this.hideLoader();
    }
  }

  populateCountrySelect(countries) {
    const select = document.getElementById("country");
    select.innerHTML = '<option value="">Оберіть країну</option>';

    countries
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((country) => {
        const option = document.createElement("option");
        option.value = country.code;
        option.textContent = country.name;
        select.appendChild(option);
      });
  }

  restoreUserPreferences() {
    const preferences = StorageService.getPreferences();
    if (preferences) {
      Object.entries(preferences).forEach(([key, value]) => {
        const input = this.form.elements[key];
        if (input) {
          input.value = value;
        }
      });
    }
  }

  async handleFormSubmit(event) {
    event.preventDefault();

    try {
      this.showLoader();

      const formData = new FormData(this.form);
      const preferences = new UserPreferences({
        dob: formData.get("dob"),
        gender: formData.get("gender"),
        country: formData.get("country"),
        displayMode: formData.get("display-mode"),
      });

      // Валідація даних
      const errors = preferences.validate();
      if (errors.length > 0) {
        this.hideStatsSection();
        throw new Error(errors.join("\n"));
      }

      // Збереження налаштувань
      StorageService.savePreferences(preferences.toJSON());

      // Оновлення візуалізації
      await this.updateVisualization(preferences);

      // Показ секції статистики
      this.showStatsSection();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoader();
    }
  }

  async updateVisualization(preferences) {
    const countryData = this.lifeExpectancyData.find(
      (country) => country.code === preferences.country
    );

    if (!countryData) {
      throw new Error("Країну не знайдено");
    }

    const today = new Date();
    const dob = new Date(preferences.dob);

    const unitsLived = LifeCalculator.calculateUnitsLived(
      dob,
      today,
      preferences.displayMode
    );

    const lifeExpectancy = LifeCalculator.calculateLifeExpectancy(
      countryData,
      preferences.gender
    );

    const totalUnits = this.calculateTotalUnits(
      lifeExpectancy,
      preferences.displayMode
    );

    const statistics = LifeCalculator.getLifeStatistics(
      unitsLived,
      totalUnits,
      preferences.displayMode
    );

    // Оновлення відображення
    this.visualizationView.render(
      totalUnits,
      unitsLived,
      preferences.displayMode
    );
    this.statsView.render(statistics);
  }

  calculateTotalUnits(lifeExpectancy, mode) {
    const unitsPerYear = {
      [CONFIG.DISPLAY_MODES.WEEKS]: 52,
      [CONFIG.DISPLAY_MODES.MONTHS]: 12,
      [CONFIG.DISPLAY_MODES.YEARS]: 1,
    };
    return Math.floor(lifeExpectancy * unitsPerYear[mode]);
  }

  async handleExport() {
    try {
      this.showLoader();
      await ExportService.exportAsImage(
        document.getElementById("visualization")
      );
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoader();
    }
  }

  async handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Life Map",
          text: "Подивіться на візуалізацію мого життя!",
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          this.handleError(error);
        }
      }
    } else {
      this.modalView.show(`
                <h3>Поділитися</h3>
                <p>Скопіюйте посилання: ${window.location.href}</p>
            `);
    }
  }

  handleFormChange() {
    const formData = new FormData(this.form);
    const preferences = Object.fromEntries(formData.entries());
    StorageService.savePreferences(preferences);
  }

  handleResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      if (this.statsSection.style.display !== "none") {
        this.visualizationView.adjustToViewport();
      }
    }, 150);
  }

  handleError(error) {
    console.error("Application Error:", error);
    this.modalView.show(`
            <h3>Помилка</h3>
            <p>${error.message}</p>
        `);
  }

  showLoader() {
    this.loader.classList.add("loader--visible");
  }

  hideLoader() {
    this.loader.classList.remove("loader--visible");
  }

  showStatsSection() {
    this.statsSection.style.display = "block";
    // Використовуємо setTimeout щоб DOM встиг оновитися
    setTimeout(() => {
      this.statsSection.classList.add("stats-section--visible");
    }, 10);
  }

  hideStatsSection() {
    this.statsSection.classList.remove("stats-section--visible");
    setTimeout(() => {
      this.statsSection.style.display = "none";
    }, 300); // Час має співпадати з transition у CSS
  }
}

// Ініціалізація додатку після завантаження DOM
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
