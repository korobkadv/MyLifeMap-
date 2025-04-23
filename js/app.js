// Імпорт конфігурації
import { CONFIG } from "./config.js";

// Імпорт представлень
import { VisualizationView } from "./views/visualization.view.js";
import { StatsView } from "./views/stats.view.js";
import { ModalView } from "./views/modal.view.js";
import { HistoricalEventsView } from "./views/historical-events.view.js";
import { FunFactsView } from "./views/fun-facts.view.js";

// Імпорт сервісів
import { ApiService } from "./services/api.service.js";
import { StorageService } from "./services/storage.service.js";
import { ExportService } from "./services/export.service.js";
import { ValidationService } from "./services/validation.service.js";
import { ComparisonService } from "./services/comparison.service.js";
import { HistoricalEventsService } from "./services/historical-events.service.js";
import { FunFactsService } from "./services/fun-facts.service.js";

// Імпорт моделей
import { LifeCalculator } from "./models/life-calculator.js";
import { UserPreferences } from "./models/user-preferences.js";

class App {
  constructor() {
    // Ініціалізація сервісів
    this.apiService = new ApiService();
    this.validationService = new ValidationService();
    this.lifeCalculator = new LifeCalculator();
    // ComparisonService - це статичний клас, не потрібно створювати екземпляр
    this.exportService = new ExportService();
    this.historicalEventsService = new HistoricalEventsService();
    // FunFactsService - це статичний клас, не потрібно створювати екземпляр

    this.resizeTimeout = null;

    this.initialize().catch((error) => this.handleError(error));
  }

  async initialize() {
    // console.log("[App] Initializing..."); // Закоментовано
    try {
      this.initializeServices();
      this.initializeViews();
      // this.applyInitialFormDefaults(); // Викликаємо, але лог всередині закоментуємо
      this.hideStatsSection();
      this.setupEventListeners();
      // console.log("[App] Calling loadInitialData..."); // Закоментовано
      await this.loadInitialData();
      this.restoreUserPreferences(); // Викликаємо, але лог всередині закоментуємо
    } catch (error) {
      this.handleError(error);
    }
  }

  initializeServices() {
    try {
      // Отримання збережених налаштувань
      const savedPreferences = StorageService.getPreferences();
      this.userPreferences = new UserPreferences(savedPreferences);
    } catch (error) {
      console.error("Service initialization error:", error);
      // Створюємо preferences з дефолтними значеннями у випадку помилки
      this.userPreferences = new UserPreferences();
    }
  }

  initializeViews() {
    // Ініціалізація основних елементів інтерфейсу
    this.form = document.getElementById("user-form");
    this.loader = document.getElementById("loader");
    this.statsSection = document.getElementById("stats-section");

    // Ініціалізація представлень
    this.modalView = new ModalView();
    this.visualizationView = new VisualizationView(
      document.getElementById("visualization")
    );
    this.statsView = new StatsView(document.getElementById("stats-summary"));
    this.historicalEventsView = new HistoricalEventsView(
      document.querySelector(".historical-events-section")
    );
    this.funFactsView = new FunFactsView(
      document.getElementById("fun-facts-container"),
      FunFactsService
    );
  }

  setupEventListeners() {
    // Обробка подій форми
    this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
    this.form.addEventListener("change", this.handleFormChange.bind(this));

    // Обробка кнопок
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
    // console.log("[App] loadInitialData started."); // Закоментовано
    this.showLoader();
    try {
      // console.log("[App] Calling ApiService.getLifeExpectancyData..."); // Закоментовано
      const data = await ApiService.getLifeExpectancyData();

      if (!data || data.length === 0) {
        throw new Error("Немає даних про тривалість життя");
      }

      const select = document.getElementById("region");
      if (!select) {
        throw new Error("Не знайдено елемент вибору регіону");
      }

      // console.log("[App] Calling populateRegionSelect..."); // Закоментовано
      this.populateRegionSelect(data);
      this.lifeExpectancyData = data;

      // Не встановлюємо автоматично першу країну зі списку
      // Залишаємо обраною опцію "Оберіть регіон"
    } catch (error) {
      console.error("Помилка завантаження даних:", error);

      this.modalView.show(`
        <h3>Помилка завантаження даних</h3>
        <p>Не вдалося завантажити дані про тривалість життя. Будь ласка, перевірте підключення до інтернету та спробуйте пізніше.</p>
        <p>Деталі помилки: ${error.message}</p>
      `);

      // Спробуємо отримати дані ще раз через ApiService, який використовує резервні дані
      try {
        const fallbackData = await ApiService.getLifeExpectancyData();
        if (fallbackData && fallbackData.length > 0) {
          this.lifeExpectancyData = fallbackData;
          const select = document.getElementById("region");
          if (select) {
            this.populateRegionSelect(this.lifeExpectancyData);
            select.value = "";
          }
        }
      } catch (fallbackError) {
        console.error("Не вдалося отримати резервні дані:", fallbackError);
      }
    } finally {
      this.hideLoader();
    }
  }

  populateRegionSelect(regions) {
    // console.log("[App] populateRegionSelect started."); // Закоментовано
    const select = document.getElementById("region");
    if (!select) return;

    select.innerHTML = '<option value="">Оберіть регіон</option>';

    regions
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((region) => {
        const option = document.createElement("option");
        option.value = region.code;
        option.textContent = region.name;
        select.appendChild(option);
      });
  }

  restoreUserPreferences() {
    const preferences = StorageService.getPreferences();
    let regionSetFromStorage = false; // Прапорець для відстеження

    if (preferences && Object.keys(preferences).length > 0) {
      Object.entries(preferences).forEach(([key, value]) => {
        const input = this.form.elements[key];
        if (input) {
          input.value = value;
          if (key === "region") {
            regionSetFromStorage = true; // Регіон встановлено зі сховища
          }
        }
      });

      // Встановлюємо регіон за замовчуванням, ТІЛЬКИ ЯКЩО він не був встановлений зі сховища
      // і елемент select існує (був заповнений в loadInitialData)
      if (!regionSetFromStorage && this.form.elements["region"]) {
        // console.log("[App] Applying default region from CONFIG because none was saved."); // Закоментовано
        this.form.elements["region"].value = CONFIG.DEFAULT_COUNTRY;
      }

      // Автоматично оновлюємо візуалізацію на основі збережених налаштувань
      this.autoLoadVisualization(preferences);
    } else {
      // Якщо немає збережених preferences взагалі, встановлюємо регіон за замовчуванням
      // Переконуємося, що select вже існує
      if (this.form.elements["region"]) {
        // console.log("[App] Applying default region from CONFIG because no preferences exist."); // Закоментовано
        this.form.elements["region"].value = CONFIG.DEFAULT_COUNTRY;
      }
    }
  }

  async autoLoadVisualization(savedPreferences) {
    // Перевіряємо чи є всі необхідні дані
    if (savedPreferences && savedPreferences.dob && savedPreferences.region) {
      try {
        this.showLoader();

        // Створюємо об'єкт UserPreferences з налаштувань
        const preferences = new UserPreferences({
          dob: savedPreferences.dob,
          gender: savedPreferences.gender,
          region: savedPreferences.region,
          displayMode: savedPreferences.displayMode,
          "sleep-hours": savedPreferences["sleep-hours"],
          "work-hours": savedPreferences["work-hours"],
          "sport-hours": savedPreferences["sport-hours"],
          "social-hours": savedPreferences["social-hours"],
          "food-hours": savedPreferences["food-hours"],
          "meat-per-day": savedPreferences["meat-per-day"],
          "vegetables-per-day": savedPreferences["vegetables-per-day"],
        });

        // Оновлюємо візуалізацію
        await this.updateVisualization(preferences);

        // Показуємо секцію статистики
        this.showStatsSection();
      } catch (error) {
        console.error(
          "Помилка при автоматичному завантаженні візуалізації:",
          error
        );
        // Не показуємо помилку користувачу при автоматичному завантаженні
      } finally {
        this.hideLoader();
      }
    }
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    // console.log("[App] handleFormSubmit started."); // Видалено

    try {
      this.showLoader();
      // console.log("[App] Loader shown."); // Закоментовано
      const formData = new FormData(this.form);
      // console.log("[App] FormData created:", Object.fromEntries(formData)); // Закоментовано
      // console.log("[App] Calling ValidationService.validateFormData..."); // Закоментовано
      const errors = ValidationService.validateFormData(formData);
      // console.log("[App] Validation errors:", errors); // Закоментовано
      if (errors.length > 0) {
        this.hideStatsSection();
        // console.error("[App] Validation failed:", errors); // Закоментовано
        throw new Error(errors.join("\n"));
      }

      // console.log("[App] Sanitizing data..."); // Закоментовано
      const sanitizedData = {
        dob: ValidationService.validateAndSanitizeUserInput(
          formData.get("dob")
        ),
        gender: ValidationService.validateAndSanitizeUserInput(
          formData.get("gender")
        ),
        region: ValidationService.validateAndSanitizeUserInput(
          formData.get("region")
        ),
        displayMode: ValidationService.validateAndSanitizeUserInput(
          formData.get("display-mode")
        ),
        "sleep-hours": ValidationService.validateAndSanitizeUserInput(
          formData.get("sleep-hours")
        ),
        "work-hours": ValidationService.validateAndSanitizeUserInput(
          formData.get("work-hours")
        ),
        "sport-hours": ValidationService.validateAndSanitizeUserInput(
          formData.get("sport-hours")
        ),
        "social-hours": ValidationService.validateAndSanitizeUserInput(
          formData.get("social-hours")
        ),
        "food-hours": ValidationService.validateAndSanitizeUserInput(
          formData.get("food-hours")
        ),
        "screen-time-hours": ValidationService.validateAndSanitizeUserInput(
          formData.get("screen-time-hours")
        ),
        "reading-hours": ValidationService.validateAndSanitizeUserInput(
          formData.get("reading-hours")
        ),
        "gaming-hours": ValidationService.validateAndSanitizeUserInput(
          formData.get("gaming-hours")
        ),
        "transport-hours": ValidationService.validateAndSanitizeUserInput(
          formData.get("transport-hours")
        ),
        "trips-per-year": ValidationService.validateAndSanitizeUserInput(
          formData.get("trips-per-year")
        ),
        "transport-type": ValidationService.validateAndSanitizeUserInput(
          formData.get("transport-type")
        ),
        "meat-per-day": ValidationService.validateAndSanitizeUserInput(
          formData.get("meat-per-day")
        ),
        "vegetables-per-day": ValidationService.validateAndSanitizeUserInput(
          formData.get("vegetables-per-day")
        ),
      };
      // console.log("[App] Data sanitized:", sanitizedData); // Закоментовано

      const preferences = new UserPreferences(sanitizedData);
      // console.log("[App] UserPreferences created:", preferences); // Закоментовано
      // console.log("[App] Saving preferences..."); // Закоментовано
      StorageService.savePreferences(preferences.toJSON());
      // console.log("[App] Preferences saved."); // Закоментовано

      // console.log("[App] Calling updateVisualization..."); // Закоментовано
      await this.updateVisualization(preferences);
      // console.log("[App] updateVisualization finished."); // Закоментовано

      this.showStatsSection();
      // console.log("[App] Stats section shown."); // Закоментовано
    } catch (error) {
      console.error("[App] Error in handleFormSubmit:", error); // <<< ЗАЛИШЕНО (Catch)
      this.handleError(error);
    } finally {
      this.hideLoader();
      // console.log("[App] Loader hidden (finally)."); // Закоментовано
    }
  }

  async updateVisualization(preferences) {
    try {
      this.showLoader();

      // Отримуємо дані про країну і стать
      const countryData = await this.apiService.getCountryData(
        preferences.region
      );
      const gender = preferences.gender;

      // Розраховуємо очікувану тривалість життя на основі статі і країни
      const lifeExpectancy = countryData
        ? gender === "male"
          ? countryData.male_life_expectancy
          : countryData.female_life_expectancy
        : gender === "male"
        ? CONFIG.COMPARISON.AVERAGE_LIFE_EXPECTANCY.MALE
        : CONFIG.COMPARISON.AVERAGE_LIFE_EXPECTANCY.FEMALE;

      // Розраховуємо загальну кількість одиниць (тижнів/місяців/років)
      const totalUnits = this.calculateTotalUnits(
        lifeExpectancy,
        preferences.mode || CONFIG.DEFAULTS.DISPLAY_MODE
      );

      // Розраховуємо кількість прожитих одиниць на основі дати народження
      const currentDate = new Date();
      const birthDate = new Date(preferences.dob);
      const age = this.calculateAge(birthDate);

      let unitsLived = 0;

      switch (preferences.mode || CONFIG.DEFAULTS.DISPLAY_MODE) {
        case CONFIG.DISPLAY_MODES.WEEKS:
          unitsLived = Math.floor(age * 52);
          break;
        case CONFIG.DISPLAY_MODES.MONTHS:
          unitsLived = Math.floor(age * 12);
          break;
        case CONFIG.DISPLAY_MODES.YEARS:
          unitsLived = Math.floor(age);
          break;
      }

      // Діяльність розподіляється в годинах на день
      const activityDistribution = {
        sleep: parseFloat(preferences.sleepHours || CONFIG.DEFAULT_SLEEP_HOURS),
        work: parseFloat(preferences.workHours || CONFIG.DEFAULT_WORK_HOURS),
        sport: parseFloat(preferences.sportHours || CONFIG.DEFAULT_SPORT_HOURS),
        social: parseFloat(
          preferences.socialHours || CONFIG.DEFAULT_SOCIAL_HOURS
        ),
        food: parseFloat(preferences.foodHours || CONFIG.DEFAULT_FOOD_HOURS),
        screen: parseFloat(
          preferences.screenTimeHours || CONFIG.DEFAULT_SCREEN_HOURS
        ),
        reading: parseFloat(
          preferences.readingHours || CONFIG.DEFAULT_READING_HOURS
        ),
        gaming: parseFloat(
          preferences.gamingHours || CONFIG.DEFAULT_GAMING_HOURS
        ),
        transport: parseFloat(
          preferences.transportHours || CONFIG.DEFAULT_TRANSPORT_HOURS
        ),
        // Розраховуємо вільний час як залишок від загальної кількості годин
        leisure: 0,
      };

      // Розраховуємо кількість вільного часу
      let totalHours = 0;
      for (const activity in activityDistribution) {
        if (activity !== "leisure") {
          totalHours += activityDistribution[activity];
        }
      }

      activityDistribution.leisure = Math.max(0, 24 - totalHours);

      // Дані для порівняння з середніми показниками
      const userData = {
        age,
        gender: preferences.gender,
        country: preferences.region,
        sleepHours: activityDistribution.sleep,
        workHours: activityDistribution.work,
        sportHours: activityDistribution.sport,
        socialHours: activityDistribution.social,
        foodHours: activityDistribution.food,
        screenTimeHours: activityDistribution.screen,
        readingHours: activityDistribution.reading,
        gamingHours: activityDistribution.gaming,
        transportHours: activityDistribution.transport,
        leisureHours: activityDistribution.leisure,
        tripsPerYear: parseInt(
          preferences.tripsPerYear || CONFIG.DEFAULT_TRIPS_PER_YEAR
        ),
        transportType:
          preferences.transportType || CONFIG.DEFAULT_TRANSPORT_TYPE,
        meatPerDay: parseFloat(
          preferences.meatPerDay || CONFIG.DEFAULT_MEAT_PER_DAY
        ),
        vegetablesPerDay: parseFloat(
          preferences.vegetablesPerDay || CONFIG.DEFAULT_VEGETABLES_PER_DAY
        ),
      };

      // Отримуємо історичні події на основі дати народження
      let historicalEvents;
      try {
        // Використовуємо правильний сервіс та метод
        const birthYear = birthDate.getFullYear();
        const currentYear = currentDate.getFullYear();
        // Передаємо роки та регіон
        historicalEvents = this.historicalEventsService.getEventsForLifespan(
          birthYear,
          currentYear,
          preferences.region
        );
      } catch (error) {
        console.warn("Не вдалося отримати історичні події:", error);
        historicalEvents = [];
      }

      // Генеруємо персоналізовані цікаві факти на основі даних користувача
      const facts = FunFactsService.generatePersonalizedFacts(userData);

      // Будуємо об'єкт даних для відображення статистики ВІДПОВІДНО ДО ОЧІКУВАНЬ StatsView
      const statsData = {
        statistics: {
          // Дані про прожитий/залишковий час (можливо, StatsView очікує конкретні одиниці? Поки що передамо роки)
          lived: parseFloat(age.toFixed(1)), // Років прожито
          remaining: parseFloat((lifeExpectancy - age).toFixed(1)), // Років залишилось (приблизно)
          total: parseFloat(lifeExpectancy.toFixed(1)), // Загальна очікувана тривалість
          percentage: parseFloat(((age / lifeExpectancy) * 100).toFixed(1)), // Відсоток прожитого
          mode: preferences.mode || CONFIG.DEFAULTS.DISPLAY_MODE, // Режим відображення для можливого використання
        },
        comparison: {
          // Порівняння тривалості життя
          lifeExpectancy: {
            countryLifeExpectancy: parseFloat(lifeExpectancy.toFixed(1)),
            percentage: parseFloat(((age / lifeExpectancy) * 100).toFixed(1)),
            difference: parseFloat((lifeExpectancy - age).toFixed(1)),
          },
          // Розрахунок часу на активності за все життя
          sleepTime: `~${(
            (activityDistribution.sleep / 24) *
            lifeExpectancy
          ).toFixed(1)} років`,
          workTime: `~${(
            (activityDistribution.work / 24) *
            lifeExpectancy
          ).toFixed(1)} років`,
          exerciseTime: `~${(
            (activityDistribution.sport / 24) *
            lifeExpectancy
          ).toFixed(1)} років`,
          socialTime: `~${(
            (activityDistribution.social / 24) *
            lifeExpectancy
          ).toFixed(1)} років`,
          foodTime: `~${(
            (activityDistribution.food / 24) *
            lifeExpectancy
          ).toFixed(1)} років`,
          screenTime: `~${(
            (activityDistribution.screen / 24) *
            lifeExpectancy
          ).toFixed(1)} років`,
          readingTime: `~${(
            (activityDistribution.reading / 24) *
            lifeExpectancy
          ).toFixed(1)} років`,
          gamingTime: `~${(
            (activityDistribution.gaming / 24) *
            lifeExpectancy
          ).toFixed(1)} років`,
          transportTime: `~${(
            (activityDistribution.transport / 24) *
            lifeExpectancy
          ).toFixed(1)} років`,
          leisureTime: `~${(
            (activityDistribution.leisure / 24) *
            lifeExpectancy
          ).toFixed(1)} років`,
          // Відсотки часу на активності
          sleepPercentage: parseFloat(
            ((activityDistribution.sleep / 24) * 100).toFixed(1)
          ),
          workPercentage: parseFloat(
            ((activityDistribution.work / 24) * 100).toFixed(1)
          ),
          exercisePercentage: parseFloat(
            ((activityDistribution.sport / 24) * 100).toFixed(1)
          ), // Виправлено назву на exercisePercentage
          socialPercentage: parseFloat(
            ((activityDistribution.social / 24) * 100).toFixed(1)
          ),
          foodPercentage: parseFloat(
            ((activityDistribution.food / 24) * 100).toFixed(1)
          ),
          screenPercentage: parseFloat(
            ((activityDistribution.screen / 24) * 100).toFixed(1)
          ),
          readingPercentage: parseFloat(
            ((activityDistribution.reading / 24) * 100).toFixed(1)
          ),
          gamingPercentage: parseFloat(
            ((activityDistribution.gaming / 24) * 100).toFixed(1)
          ),
          transportPercentage: parseFloat(
            ((activityDistribution.transport / 24) * 100).toFixed(1)
          ),
          leisurePercentage: parseFloat(
            ((activityDistribution.leisure / 24) * 100).toFixed(1)
          ),
          // Подорожі
          trips: {
            perYear: userData.tripsPerYear,
            distancePerLifetime: parseFloat(
              (
                userData.tripsPerYear *
                CONFIG.AVERAGE_TRIP_DISTANCE *
                lifeExpectancy
              ).toFixed(0)
            ),
          },
          // Харчування
          foodConsumption: {
            meat: parseFloat(
              (userData.meatPerDay * 365 * lifeExpectancy).toFixed(0)
            ),
            vegetables: parseFloat(
              (userData.vegetablesPerDay * 365 * lifeExpectancy).toFixed(0)
            ),
          },
          // Кількість історичних подій
          historicalEventsCount: (historicalEvents || []).length,
        },
        countryData: {
          code: preferences.region,
          name: countryData ? countryData.name : "Н/Д", // Використовуємо завантажені дані про країну
        },
        // Ці дані передаються окремо до відповідних Views
        visualizationData: {
          totalUnits,
          unitsLived,
          mode: preferences.mode || CONFIG.DEFAULTS.DISPLAY_MODE,
          activityDistribution,
        },
        historicalEventsData: historicalEvents || [],
        funFactsData: facts,
      };

      // Відображаємо візуалізацію
      /* // Видалено лог
      console.log(
        "[App] Data being passed to visualizationView.render:",
        statsData.visualizationData
      );
      */
      this.visualizationView.render(statsData.visualizationData);

      // Відображаємо статистику
      // console.log("[App] Data being passed to statsView.render:", statsData); // Закоментовано
      this.statsView.render(statsData);

      // Відображаємо історичні події
      // console.log("[App] Data being passed to historicalEventsView.render:", statsData.historicalEventsData); // Закоментовано
      if (
        statsData.historicalEventsData &&
        statsData.historicalEventsData.length > 0
      ) {
        this.historicalEventsView.render(statsData.historicalEventsData);
      } else {
        this.historicalEventsView.render(null);
        // console.log("Немає історичних подій для відображення."); // Закоментовано
      }

      // Відображаємо цікаві факти
      // console.log("[App] Data being passed to funFactsView.render:", statsData.funFactsData); // Закоментовано
      this.funFactsView.render(statsData.funFactsData);

      this.hideLoader();
      this.showStatsSection();
    } catch (error) {
      console.error("Помилка при оновленні візуалізації:", error); // <<< ЗАЛИШЕНО (Catch)
      this.hideLoader();
      this.handleError(error);
    }
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

      // Експортуємо основний контент
      const mainContent = document.querySelector(".layout__main");
      await ExportService.exportAsImage(mainContent);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoader();
    }
  }

  async handleShare() {
    // Перевіряємо, чи доступне API Navigator.share
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
      // Якщо API недоступне, показуємо модальне вікно з посиланням
      this.modalView.show(`
        <div class="share-modal">
          <h3>Поділитися візуалізацією</h3>
          <div class="share-options">
            <div class="share-link-container">
              <p>Скопіюйте посилання:</p>
              <div class="copy-link-input">
                <input type="text" value="${
                  window.location.href
                }" id="share-link" readonly>
                <button id="copy-link-btn" class="copy-link-btn">Копіювати</button>
              </div>
            </div>
            
            <div class="share-options-divider">або</div>
            
            <div class="social-share-buttons">
              <p>Поділитися через:</p>
              <div class="social-buttons">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}" target="_blank" class="social-button facebook">Facebook</a>
                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  window.location.href
                )}&text=${encodeURIComponent(
        "Моя візуалізація життя у квадратах"
      )}" target="_blank" class="social-button twitter">Twitter</a>
                <a href="https://t.me/share/url?url=${encodeURIComponent(
                  window.location.href
                )}&text=${encodeURIComponent(
        "Моя візуалізація життя у квадратах"
      )}" target="_blank" class="social-button telegram">Telegram</a>
              </div>
            </div>
            
            <div class="export-option">
              <p>Зберегти візуалізацію як зображення:</p>
              <button id="modal-export-btn" class="modal-export-btn">Зберегти як зображення</button>
            </div>
          </div>
        </div>
      `);

      // Додаємо обробник для копіювання посилання
      const copyBtn = document.getElementById("copy-link-btn");
      const shareLink = document.getElementById("share-link");

      if (copyBtn && shareLink) {
        copyBtn.addEventListener("click", () => {
          shareLink.select();
          document.execCommand("copy");
          copyBtn.textContent = "Скопійовано!";
          setTimeout(() => {
            copyBtn.textContent = "Копіювати";
          }, 2000);
        });
      }

      // Додаємо обробник для кнопки експорту в модальному вікні
      const modalExportBtn = document.getElementById("modal-export-btn");
      if (modalExportBtn) {
        modalExportBtn.addEventListener("click", () => {
          this.modalView.hide();
          this.handleExport();
        });
      }
    }
  }

  handleFormChange() {
    const formData = new FormData(this.form);
    const preferences = Object.fromEntries(formData.entries());

    // Перевіряємо, чи заповнені ключові поля перед збереженням
    if (preferences.dob && preferences.region && preferences.gender) {
      StorageService.savePreferences(preferences);
    }
  }

  handleResize() {
    // Простий обробник без додаткових перевірок
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    // Довший таймаут для кращої продуктивності
    this.resizeTimeout = setTimeout(() => {
      // Виконуємо адаптацію тільки якщо статистика видима
      if (this.statsSection.style.display !== "none") {
        this.visualizationView.adjustToViewport();
      }
    }, 500);
  }

  handleError(error) {
    console.error("Application Error:", error);
    this.modalView.show(`
            <h3>Помилка</h3>
            <p>${error.message}</p>
        `);
  }

  // Допоміжні методи для відображення/приховування секцій
  showStatsSection() {
    if (this.statsSection) {
      // console.log("[App] Attempting to show stats section:", this.statsSection); // Закоментовано
      this.statsSection.style.display = "block";
      setTimeout(() => {
        this.statsSection.style.opacity = "1";
        this.statsSection.setAttribute("aria-hidden", "false");
      }, 10);
    } else {
      console.error(
        "[App] statsSection element not found in showStatsSection!"
      );
    }
  }

  hideStatsSection() {
    if (this.statsSection) {
      // console.log("[App] Attempting to hide stats section:", this.statsSection); // Закоментовано
      this.statsSection.style.opacity = "0";
      this.statsSection.setAttribute("aria-hidden", "true");
      setTimeout(() => {
        this.statsSection.style.display = "none";
      }, CONFIG.ANIMATION.DURATION || 300);
    } else {
      console.error(
        "[App] statsSection element not found in hideStatsSection!"
      );
    }
  }

  showLoader() {
    if (this.loader) {
      this.loader.style.display = "flex";
    }
  }

  hideLoader() {
    if (this.loader) {
      this.loader.style.display = "none";
    }
  }

  calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  applyInitialFormDefaults() {
    const savedPreferences = StorageService.getPreferences();
    if (!savedPreferences || Object.keys(savedPreferences).length === 0) {
      // console.log("Applying default form values from CONFIG."); // Закоментовано
      try {
        this.form.elements["gender"].value = CONFIG.DEFAULT_GENDER;
        this.form.elements["display-mode"].value = CONFIG.DEFAULTS.DISPLAY_MODE;
        this.form.elements["sleep-hours"].value = CONFIG.DEFAULT_SLEEP_HOURS;
        this.form.elements["work-hours"].value = CONFIG.DEFAULT_WORK_HOURS;
        this.form.elements["sport-hours"].value = CONFIG.DEFAULT_SPORT_HOURS;
        this.form.elements["social-hours"].value = CONFIG.DEFAULT_SOCIAL_HOURS;
        this.form.elements["food-hours"].value = CONFIG.DEFAULT_FOOD_HOURS;
        this.form.elements["screen-time-hours"].value =
          CONFIG.DEFAULT_SCREEN_HOURS;
        this.form.elements["reading-hours"].value =
          CONFIG.DEFAULT_READING_HOURS;
        this.form.elements["gaming-hours"].value = CONFIG.DEFAULT_GAMING_HOURS;
        this.form.elements["transport-hours"].value =
          CONFIG.DEFAULT_TRANSPORT_HOURS;
        this.form.elements["trips-per-year"].value =
          CONFIG.DEFAULT_TRIPS_PER_YEAR;
        this.form.elements["meat-per-day"].value = CONFIG.DEFAULT_MEAT_PER_DAY;
        this.form.elements["vegetables-per-day"].value =
          CONFIG.DEFAULT_VEGETABLES_PER_DAY;
        this.form.elements["transport-type"].value =
          CONFIG.DEFAULT_TRANSPORT_TYPE;
      } catch (error) {
        console.error("Error applying default form values:", error);
        // Можна додати обробку помилки, якщо елемент форми не знайдено
      }
    }
  }
}

// Створюємо екземпляр класу для запуску програми
new App();
