document.addEventListener("DOMContentLoaded", () => {
  // Елементи DOM
  const countrySelect = document.getElementById("country");
  const form = document.querySelector(".form");
  const dobInput = document.getElementById("dob");
  const genderSelect = document.getElementById("gender");
  const displayModeSelect = document.getElementById("display-mode");
  const visualizationContainer = document.querySelector(".visualization");
  const visualizationWrapper = document.querySelector(".visualization-wrapper");
  const statsSection = document.getElementById("stats-section");
  const captureArea = document.getElementById("capture-area");
  const saveButton = document.querySelector('[data-i18n-key="saveButton"]');
  const shareButton = document.querySelector('[data-i18n-key="shareButton"]');
  const langSwitcherButtons = document.querySelectorAll(
    ".language-switcher__button"
  );
  const statsLivedEl = document.getElementById("stats-lived");
  const statsTotalEl = document.getElementById("stats-total");
  const statsLivedUnitEl = document.getElementById("stats-lived-unit");
  const statsTotalUnitEl = document.getElementById("stats-total-unit");
  const statsExpectancyEl = document.getElementById("stats-expectancy");
  const statsGenderEl = document.getElementById("stats-gender");
  const statsCountryEl = document.getElementById("stats-country");
  const exportModal = document.getElementById("export-modal");
  const exportModalTitle = document.getElementById("export-modal-title");
  const saveDeviceButton = document.getElementById("save-device-button");
  const shareFacebookButton = document.getElementById("share-facebook-button");
  const shareTwitterButton = document.getElementById("share-twitter-button");
  const copyLinkModalButton = document.getElementById("copy-link-modal-button");
  const cancelExportButton = document.getElementById("cancel-export-button");
  const preloader = document.getElementById("preloader");
  const tooltipElement = document.getElementById("visualization-tooltip");

  // Посилання на дані
  const localesBasePath = "./locales/";
  const dataPath = "./data/life-expectancy.json";

  // Поточна мова та завантажені ресурси
  let currentLang = "ua"; // Визначатиметься в initializeApp
  let translations = {};
  let lifeExpectancyData = {};
  const LS_LANG_KEY = "myLifeMapLanguage"; // Ключ для localStorage
  const LS_FORM_STATE_KEY = "myLifeMapLastState"; // <-- Новий ключ для стану форми
  let currentImageDataUrl = null; // Для зберігання dataURL між кроками

  /**
   * Проста функція для отримання перекладу
   * @param {string} key Ключ перекладу
   * @returns {string} Перекладений рядок або ключ, якщо переклад не знайдено
   */
  function translate(key) {
    return translations[key] || key;
  }

  /**
   * Визначає збережену мову, мову браузера або використовує 'ua' за замовчуванням.
   * @returns {string} Код мови ('ua' або 'en')
   */
  function detectLanguage() {
    const savedLang = localStorage.getItem(LS_LANG_KEY);
    if (savedLang && ["ua", "en"].includes(savedLang)) {
      return savedLang;
    }
    const browserLang = navigator.language.split("-")[0];
    return ["ua", "en"].includes(browserLang) ? browserLang : "ua";
  }

  /**
   * Асинхронно завантажує JSON файл.
   * @param {string} url - Шлях до файлу JSON.
   * @returns {Promise<object>} - Проміс з розпарсеним JSON об'єктом.
   */
  async function loadJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Could not load JSON from ${url}:`, error);
      return {}; // Повертаємо порожній об'єкт у разі помилки
    }
  }

  /**
   * Оновлює текстовий контент та атрибути елементів на сторінці.
   * @param {string} [targetCountryCode=null] - Код країни, яку потрібно вибрати у списку.
   */
  function updateUI(targetCountryCode = null) {
    // Оновлення статичного тексту
    document.querySelectorAll("[data-i18n-key]").forEach((element) => {
      const key = element.getAttribute("data-i18n-key");
      const translation = translate(key);

      if (key) {
        // Перевіряємо, чи є ключ
        if (element.tagName === "TITLE") {
          document.title = translation;
        } else if (element.hasAttribute("data-i18n-aria-label")) {
          element.setAttribute("aria-label", translation);
        } else if (element.tagName === "INPUT" && element.type === "submit") {
          element.value = translation;
        } else if (element.tagName === "BUTTON") {
          element.textContent = translation;
        } else if (
          element.tagName === "P" ||
          element.tagName === "H1" ||
          element.tagName === "H2" ||
          element.tagName === "H3" ||
          element.tagName === "LEGEND" ||
          element.tagName === "LABEL" ||
          element.tagName === "SPAN" ||
          element.tagName === "OPTION"
        ) {
          // Переконуємося, що оновлюємо текст для елементів, де це безпечно
          if (
            element.closest(".stats-summary__details") &&
            element.tagName === "SPAN" &&
            key !== "statsBasedOn" &&
            key !== "statsFor" &&
            key !== "statsIn" &&
            key !== "statsYears"
          ) {
            // Не перезаписувати значення id=stats-expectancy, id=stats-gender, id=stats-country всередині stats-summary__details
          } else {
            element.innerHTML = translation; // Використовуємо innerHTML для підтримки &copy; тощо
          }
        } else {
          // Для інших елементів, якщо потрібно
          if (element.children.length === 0) {
            // Оновлюємо тільки якщо немає дочірніх елементів, щоб уникнути перезапису
            element.innerHTML = translation;
          }
        }
      } else {
        if (!element.classList.contains("language-switcher__button")) {
          console.warn("Element is missing data-i18n-key attribute:", element);
        }
      }
    });

    // Оновлення атрибуту lang кореневого елемента
    document.documentElement.lang = currentLang;

    // Заповнення випадаючого списку країн
    countrySelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent =
      translate("selectCountryPrompt") || "Оберіть країну...";
    defaultOption.disabled = true;
    defaultOption.selected = !targetCountryCode;
    countrySelect.appendChild(defaultOption);

    const sortedCountries = Object.entries(lifeExpectancyData).sort(
      ([, a], [, b]) => {
        const nameA = a.name[currentLang] || "";
        const nameB = b.name[currentLang] || "";
        return nameA.localeCompare(nameB, currentLang);
      }
    );

    let countryFoundAndSelected = false;
    sortedCountries.forEach(([code, countryData]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = countryData.name[currentLang] || code;
      if (targetCountryCode && code === targetCountryCode) {
        option.selected = true;
        countryFoundAndSelected = true;
        defaultOption.selected = false;
      }
      countrySelect.appendChild(option);
    });

    if (targetCountryCode && !countryFoundAndSelected) {
      console.warn(
        `Цільова країна ${targetCountryCode} не знайдена при оновленні UI.`
      );
      defaultOption.selected = true;
    }

    // Оновлення aria-label
    const countryLabelElement = document.querySelector(
      `label[for='${countrySelect.id}']`
    );
    if (countryLabelElement) {
      const labelText =
        countryLabelElement.textContent || translations["countryLabel"];
      countrySelect.setAttribute("aria-label", labelText);
      // Оновлюємо і текст мітки, якщо він перекладався
      if (translations["countryLabel"]) {
        countryLabelElement.textContent = translations["countryLabel"];
      }
    } else {
      countrySelect.setAttribute("aria-label", translations["countryLabel"]);
    }

    // Перевіряємо, чи є дані для активації кнопки копіювання посилання
    updateShareButtonState();

    // Оновлення стану кнопок мови
    langSwitcherButtons.forEach((button) => {
      if (button.getAttribute("data-lang") === currentLang) {
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true"); // Для доступності
      } else {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
      }
    });

    // Переконаємося, що текст модального вікна також оновлюється
    if (exportModal.getAttribute("aria-hidden") === "false") {
      exportModalTitle.textContent = translate("exportOptionsTitle");
      saveDeviceButton.textContent = translate("saveToDeviceButton");
      shareFacebookButton.textContent = translate("shareFacebook");
      shareTwitterButton.textContent = translate("shareTwitter");
      copyLinkModalButton.textContent = translate("copyLinkButton");
      cancelExportButton.textContent = translate("cancelButton");
    }
  }

  /**
   * Встановлює нову мову, завантажує переклади та оновлює UI.
   * @param {string} langCode - Код мови ('ua' або 'en').
   */
  async function setLanguage(langCode) {
    if (!["ua", "en"].includes(langCode) || langCode === currentLang) {
      return;
    }
    const currentSelectedCountry = countrySelect.value; // Зберігаємо ПОТОЧНИЙ вибір перед зміною мови

    currentLang = langCode;
    localStorage.setItem(LS_LANG_KEY, currentLang);

    const langPath = `${localesBasePath}${currentLang}.json`;
    try {
      translations = await loadJSON(langPath);
      if (Object.keys(translations).length === 0) {
        console.error(`Failed to load translations for ${currentLang}.`);
        return;
      }
      // Передаємо збережений вибір країни в updateUI
      updateUI(currentSelectedCountry);
    } catch (error) {
      console.error(`Error setting language to ${currentLang}:`, error);
    }
  }

  /**
   * Головна функція ініціалізації.
   */
  async function initializeApp() {
    currentLang = detectLanguage();
    const langPath = `${localesBasePath}${currentLang}.json`;

    // 1. Спробувати завантажити стан з localStorage
    let initialDob = "";
    let initialGender = "male"; // Значення за замовчуванням
    let initialCountry = null;
    let initialMode = "weeks"; // Значення за замовчуванням
    const savedStateJSON = localStorage.getItem(LS_FORM_STATE_KEY);
    if (savedStateJSON) {
      try {
        const savedState = JSON.parse(savedStateJSON);
        // Перевіряємо чи є дані і чи валідні (базово)
        if (savedState.dob) initialDob = savedState.dob;
        if (savedState.gender && ["male", "female"].includes(savedState.gender))
          initialGender = savedState.gender;
        if (savedState.countryCode) initialCountry = savedState.countryCode;
        if (
          savedState.displayMode &&
          ["days", "weeks", "months", "years"].includes(savedState.displayMode)
        )
          initialMode = savedState.displayMode;
        console.log("Loaded state from localStorage:", savedState);
      } catch (e) {
        console.error("Error parsing saved state:", e);
        localStorage.removeItem(LS_FORM_STATE_KEY); // Видаляємо невалідні дані
      }
    }

    // 2. Парсимо URL параметри (мають вищий пріоритет)
    const params = new URLSearchParams(window.location.search);
    const dobFromUrl = params.get("dob");
    const genderFromUrl = params.get("gender");
    const countryCodeFromUrl = params.get("country");
    const modeFromUrl = params.get("mode");

    // 3. Визначаємо кінцеві початкові значення (URL > localStorage > Default)
    const finalInitialDob = dobFromUrl || initialDob || "";
    const finalInitialGender =
      genderFromUrl && ["male", "female"].includes(genderFromUrl)
        ? genderFromUrl
        : initialGender;
    const finalInitialMode =
      modeFromUrl && ["days", "weeks", "months", "years"].includes(modeFromUrl)
        ? modeFromUrl
        : initialMode;
    // Для країни перевірка валідності відбудеться в try-catch блоці
    let finalInitialCountryCode = countryCodeFromUrl || initialCountry;

    try {
      // 4. Завантажуємо дані та переклади
      [translations, lifeExpectancyData] = await Promise.all([
        loadJSON(langPath),
        loadJSON(dataPath),
      ]);

      // ... (перевірки на завантаження даних) ...

      // 5. Валідуємо код країни (з URL або localStorage) на основі завантажених даних
      if (
        finalInitialCountryCode &&
        !lifeExpectancyData[finalInitialCountryCode]
      ) {
        console.warn(
          `Invalid country code found (${finalInitialCountryCode}), resetting.`
        );
        finalInitialCountryCode = null; // Скидаємо, якщо код невалідний
      }

      // 6. Оновлюємо UI, передаючи фінальний код країни
      updateUI(finalInitialCountryCode);

      // 7. Заповнюємо решту форми фінальними значеннями
      fillFormFields(finalInitialDob, finalInitialGender, finalInitialMode);

      setupEventListeners();

      // 8. Запускаємо авто-сабміт, якщо ВСІ фінальні значення утворюють повну форму
      if (
        finalInitialDob &&
        finalInitialGender &&
        finalInitialCountryCode &&
        finalInitialMode
      ) {
        setTimeout(() => {
          const submitEvent = new Event("submit", {
            bubbles: true,
            cancelable: true,
          });
          form.dispatchEvent(submitEvent);
        }, 150);
      }
    } catch (error) {
      console.error("Initialization failed:", error);
    }
  }

  /**
   * Заповнює поля форми (окрім країни) з переданих значень.
   * @param {string} dob
   * @param {string} gender
   * @param {string} mode
   */
  function fillFormFields(dob, gender, mode) {
    if (dob) dobInput.value = dob;
    if (gender) genderSelect.value = gender;
    if (mode) displayModeSelect.value = mode;

    // Оновлюємо стан кнопки Поділитися, оскільки форма могла заповнитись
    updateShareButtonState();
  }

  /**
   * Обробляє відправку форми.
   * @param {Event} event - Подія відправки форми.
   */
  function handleFormSubmit(event) {
    event.preventDefault();

    const dob = dobInput.value;
    const gender = genderSelect.value;
    const countryCode = countrySelect.value;
    const displayMode = displayModeSelect.value;

    // Валідація введених даних (базова)
    if (!dob || !gender || !countryCode || !displayMode) {
      alert(
        translations["validationError"] || "Будь ласка, заповніть усі поля."
      );
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
      alert(
        translations["futureDateError"] ||
          "Дата народження не може бути у майбутньому."
      );
      return;
    }

    console.log("Form submitted:", { dob, gender, countryCode, displayMode });

    // Отримуємо дані про очікувану тривалість життя
    const countryData = lifeExpectancyData[countryCode];
    if (!countryData) {
      console.error(
        `Life expectancy data not found for country code: ${countryCode}`
      );
      alert(
        translations["dataNotFoundError"] ||
          "Дані для обраної країни не знайдено."
      );
      return;
    }

    const averageLifeExpectancyYears =
      gender === "male"
        ? countryData.life_expectancy_male
        : countryData.life_expectancy_female;

    if (
      typeof averageLifeExpectancyYears !== "number" ||
      averageLifeExpectancyYears <= 0
    ) {
      console.error(
        `Invalid life expectancy data for ${countryCode}, gender ${gender}: ${averageLifeExpectancyYears}`
      );
      alert(
        translations["invalidDataError"] ||
          "Некоректні дані про тривалість життя для обраної країни та статі."
      );
      return;
    }

    // Розрахунок прожитого та загального часу
    const livedMilliseconds = today.getTime() - birthDate.getTime();

    let totalUnits, livedUnits, unitKey;

    const yearsLived = livedMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // Приблизна к-ть днів у році

    switch (displayMode) {
      case "days":
        totalUnits = Math.round(averageLifeExpectancyYears * 365.25);
        livedUnits = Math.round(livedMilliseconds / (1000 * 60 * 60 * 24));
        unitKey = "daysUnit"; // Ключ для "днів"
        break;
      case "weeks":
        totalUnits = Math.round(averageLifeExpectancyYears * 52.1775); // Середня к-ть тижнів у році
        livedUnits = Math.round(livedMilliseconds / (1000 * 60 * 60 * 24 * 7));
        unitKey = "weeksUnit"; // Ключ для "тижнів"
        break;
      case "months":
        totalUnits = Math.round(averageLifeExpectancyYears * 12);
        livedUnits = Math.floor(yearsLived * 12);
        unitKey = "monthsUnit"; // Ключ для "місяців"
        break;
      case "years":
      default: // Роки за замовчуванням
        totalUnits = Math.round(averageLifeExpectancyYears);
        livedUnits = Math.floor(yearsLived);
        unitKey = "yearsUnit"; // Ключ для "років"
        break;
    }

    // Переконуємось, що livedUnits не перевищує totalUnits (для візуалізації)
    livedUnits = Math.min(livedUnits, totalUnits);
    // Переконуємось, що livedUnits не від'ємне
    livedUnits = Math.max(0, livedUnits);

    console.log("Calculated:", {
      totalUnits,
      livedUnits,
      averageLifeExpectancyYears,
    });

    // --- Збереження стану в localStorage ПІСЛЯ успішної обробки ---
    try {
      const lastState = {
        dob,
        gender,
        countryCode, // Зберігаємо саме код країни
        displayMode,
      };
      localStorage.setItem(LS_FORM_STATE_KEY, JSON.stringify(lastState));
      console.log("Form state saved to localStorage:", lastState);
    } catch (e) {
      console.error("Failed to save form state to localStorage:", e);
      // Не критично, просто продовжуємо
    }
    // --- Кінець збереження стану ---

    // Оновлення текстової статистики
    updateStatsSummary(
      totalUnits,
      livedUnits,
      unitKey,
      averageLifeExpectancyYears,
      gender,
      countryCode
    );

    renderVisualization(totalUnits, livedUnits);
    statsSection.setAttribute("aria-hidden", "false"); // Показуємо секцію статистики
    statsSection.style.display = ""; // Переконатись що секція видима
    updateShareButtonState(); // Оновлюємо стан кнопки Поділитися
  }

  /**
   * Оновлює блок з текстовою статистикою.
   * @param {number} totalUnits
   * @param {number} livedUnits
   * @param {string} unitKey - Ключ для перекладу одиниць виміру ('daysUnit', 'weeksUnit', etc.)
   * @param {number} expectancyYears - Середня тривалість життя в роках.
   * @param {string} gender - Стать ('male' або 'female').
   * @param {string} countryCode - Код країни.
   */
  function updateStatsSummary(
    totalUnits,
    livedUnits,
    unitKey,
    expectancyYears,
    gender,
    countryCode
  ) {
    const unitText = translations[unitKey] || unitKey.replace("Unit", ""); // Отримуємо переклад одиниці
    statsLivedEl.textContent = livedUnits.toLocaleString(currentLang); // Форматуємо число
    statsTotalEl.textContent = totalUnits.toLocaleString(currentLang);
    statsLivedUnitEl.textContent = unitText;
    statsTotalUnitEl.textContent = unitText;

    // Оновлення деталей
    statsExpectancyEl.textContent = expectancyYears.toFixed(1); // Заокруглюємо до одного знака
    statsGenderEl.textContent =
      translations[gender === "male" ? "maleOption" : "femaleOption"] || gender;
    statsCountryEl.textContent =
      lifeExpectancyData[countryCode]?.name?.[currentLang] || countryCode;

    // Оновлення міток, якщо вони є
    document.querySelectorAll('[data-i18n-key^="stats"]').forEach((el) => {
      const key = el.getAttribute("data-i18n-key");
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });
  }

  /**
   * Рендерить сітку візуалізації.
   * @param {number} totalUnits - Загальна кількість одиниць часу (клітинок).
   * @param {number} livedUnits - Кількість прожитих одиниць часу (зафарбованих клітинок).
   */
  function renderVisualization(totalUnits, livedUnits) {
    visualizationContainer.innerHTML = ""; // Очищуємо попередню візуалізацію
    visualizationContainer.style.gridTemplateColumns = "";
    visualizationContainer.style.gridTemplateRows = "";

    // Захист від нульових або невалідних значень
    if (totalUnits <= 0) {
      visualizationContainer.textContent =
        translations["errorRendering"] || "Неможливо відобразити карту."; // Додати ключ
      return;
    }

    const cols = Math.ceil(Math.sqrt(totalUnits));
    const rows = Math.ceil(totalUnits / cols);

    visualizationContainer.style.setProperty("--grid-cols", cols);
    visualizationContainer.style.setProperty("--grid-rows", rows);

    // Використовуємо DocumentFragment для ефективного додавання елементів
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < totalUnits; i++) {
      const cell = document.createElement("div");
      cell.classList.add("visualization__cell");
      if (i < livedUnits) {
        cell.classList.add("visualization__cell--lived");
      } else {
        cell.classList.add("visualization__cell--remaining");
      }
      cell.dataset.index = i;
      cell.tabIndex = 0;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `Unit ${i + 1}`);

      cell.addEventListener("mouseover", handleCellHover);
      cell.addEventListener("mouseout", hideTooltip);
      cell.addEventListener("focus", handleCellHover);
      cell.addEventListener("blur", hideTooltip);

      fragment.appendChild(cell);
    }
    visualizationContainer.appendChild(fragment);

    announceToScreenReader(
      `${
        translations["visualizationRendered"] || "Карта життя оновлена."
      } ${livedUnits} ${translations["unitsLived"] || "прожито"}, ${
        totalUnits - livedUnits
      } ${translations["unitsRemaining"] || "залишилось"}.`
    );
  }

  /**
   * Показує повідомлення для скрінрідера.
   * @param {string} message - Повідомлення для озвучення.
   */
  function announceToScreenReader(message) {
    const announcer = document.createElement("div");
    announcer.setAttribute("role", "alert");
    announcer.setAttribute("aria-live", "assertive");
    announcer.style.position = "absolute";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.padding = "0";
    announcer.style.margin = "-1px";
    announcer.style.overflow = "hidden";
    announcer.style.clip = "rect(0, 0, 0, 0)";
    announcer.style.whiteSpace = "nowrap";
    announcer.style.border = "0";
    document.body.appendChild(announcer);
    announcer.textContent = message;
    // Видаляємо елемент після короткої затримки
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }

  /**
   * Налаштовує обробники подій.
   */
  function setupEventListeners() {
    form.addEventListener("submit", handleFormSubmit);
    saveButton.addEventListener("click", saveVisualizationAsImage);
    shareButton.addEventListener("click", copyShareLink);

    langSwitcherButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const lang = button.getAttribute("data-lang");
        setLanguage(lang);
      });
    });

    // Додамо закриття модалки при кліку на фон (опціонально)
    exportModal.addEventListener("click", (event) => {
      if (event.target === exportModal) {
        // Клік був саме на фоні, а не на контенті
        closeExportModal();
      }
    });

    // Додамо закриття модалки при натисканні Esc
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        exportModal.getAttribute("aria-hidden") === "false"
      ) {
        closeExportModal();
      }
    });
  }

  /**
   * Зберігає поточну візуалізацію як PNG зображення.
   */
  function saveVisualizationAsImage() {
    // Перевіряємо, чи є що зберігати
    if (!visualizationContainer || !visualizationContainer.children.length) {
      announceToScreenReader(translate("errorSavingNotVisible"));
      return;
    }

    // Перевіряємо чи є елемент для захоплення
    if (!captureArea) {
      console.error("Capture area element not found!");
      announceToScreenReader(translate("errorSavingFailed"));
      return;
    }

    announceToScreenReader(translate("savingInProgress")); // Оголошуємо початок
    showPreloader(); // Показуємо прелоадер

    html2canvas(captureArea, {
      useCORS: true,
      backgroundColor:
        getComputedStyle(document.body).backgroundColor || "#ffffff",
      scale: window.devicePixelRatio * 2,
      logging: false,
    })
      .then((canvas) => {
        const imageDataUrl = canvas.toDataURL("image/png");
        hidePreloader(); // Ховаємо прелоадер ПЕРЕД показом модалки
        showExportModal(imageDataUrl); // Відкриваємо модальне вікно
        announceToScreenReader(translate("exportOptionsTitle"));
      })
      .catch((error) => {
        console.error("Error generating image with html2canvas:", error);
        hidePreloader(); // Ховаємо прелоадер у разі помилки
        announceToScreenReader(translate("errorSavingFailed"));
        // Можна додати alert тут, якщо потрібно
        alert(translate("errorSavingFailed"));
      });
  }

  /**
   * Копіює посилання з поточними параметрами форми в буфер обміну.
   */
  async function copyShareLink() {
    const dob = dobInput.value;
    const gender = genderSelect.value;
    const countryCode = countrySelect.value;
    const displayMode = displayModeSelect.value;

    // Перевіряємо чи заповнені поля, необхідні для посилання
    if (!dob || !gender || !countryCode || !displayMode) {
      alert(
        translations["fillFormToShare"] ||
          "Будь ласка, заповніть усі поля форми, щоб поділитися."
      ); // Додати ключ
      return;
    }

    const params = new URLSearchParams({
      dob: dob,
      gender: gender,
      country: countryCode,
      mode: displayMode,
    });

    let path = window.location.pathname;
    // Якщо шлях закінчується на / або є просто /, додаємо index.html
    if (path === "/" || path.endsWith("/")) {
      path += "index.html";
    }

    const shareUrl = `${window.location.origin}${path}?${params.toString()}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        // Успішно скопійовано - змінюємо текст кнопки тимчасово
        const originalText = shareButton.textContent;
        shareButton.textContent = translations["linkCopied"] || "Скопійовано!"; // Додати ключ
        shareButton.disabled = true;
        setTimeout(() => {
          shareButton.textContent = originalText;
          shareButton.disabled = false;
        }, 2000); // Повернути текст через 2 секунди
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        alert(
          translations["copyLinkError"] ||
            "Не вдалося скопіювати посилання. Можливо, ваш браузер не підтримує цю функцію або сторінка відкрита не через HTTPS."
        ); // Додати ключ
      });
  }

  /**
   * Оновлює стан (ввімкнено/вимкнено) кнопки копіювання посилання.
   */
  function updateShareButtonState() {
    const dob = dobInput.value;
    const gender = genderSelect.value;
    const countryCode = countrySelect.value;
    const displayMode = displayModeSelect.value;

    if (dob && gender && countryCode && displayMode) {
      shareButton.disabled = false;
      shareButton.title =
        translations["copyLinkTooltip"] ||
        "Скопіювати посилання на поточну карту"; // Додати ключ
    } else {
      shareButton.disabled = true;
      shareButton.title =
        translations["fillFormTooltip"] ||
        "Заповніть форму, щоб отримати посилання"; // Додати ключ
    }
  }

  // --- Нові функції для модального вікна та експорту ---

  /**
   * Відкриває модальне вікно з опціями експорту.
   * @param {string} imageDataUrl - Data URL згенерованого зображення.
   */
  function showExportModal(imageDataUrl) {
    currentImageDataUrl = imageDataUrl;

    exportModalTitle.textContent = translate("exportOptionsTitle");
    saveDeviceButton.textContent = translate("saveToDeviceButton");
    shareFacebookButton.textContent = translate("shareFacebook");
    shareTwitterButton.textContent = translate("shareTwitter");
    copyLinkModalButton.textContent = translate("copyLinkButton");
    cancelExportButton.textContent = translate("cancelButton");

    // Прибираємо старі обробники
    const buttons = [
      saveDeviceButton,
      shareFacebookButton,
      shareTwitterButton,
      copyLinkModalButton,
      cancelExportButton,
    ];
    buttons.forEach((button) => {
      if (button) button.replaceWith(button.cloneNode(true));
    });

    // Отримуємо нові посилання на кнопки
    const newSaveDeviceButton = document.getElementById("save-device-button");
    const newShareFacebookButton = document.getElementById(
      "share-facebook-button"
    );
    const newShareTwitterButton = document.getElementById(
      "share-twitter-button"
    );
    const newCopyLinkModalButton = document.getElementById(
      "copy-link-modal-button"
    );
    const newCancelExportButton = document.getElementById(
      "cancel-export-button"
    );

    // Додаємо нові обробники
    if (newSaveDeviceButton)
      newSaveDeviceButton.addEventListener("click", handleSaveToDevice);
    if (newShareFacebookButton)
      newShareFacebookButton.addEventListener("click", handleShareFacebook);
    if (newShareTwitterButton)
      newShareTwitterButton.addEventListener("click", handleShareTwitter);
    if (newCopyLinkModalButton)
      newCopyLinkModalButton.addEventListener("click", handleCopyLinkModal);
    if (newCancelExportButton)
      newCancelExportButton.addEventListener("click", closeExportModal);

    exportModal.setAttribute("aria-hidden", "false");
  }

  /**
   * Закриває модальне вікно експорту.
   */
  function closeExportModal() {
    exportModal.setAttribute("aria-hidden", "true");
    currentImageDataUrl = null; // Очищуємо збережені дані
    // Можна також прибрати обробники, але cloneNode вже це зробив
  }

  /**
   * Обробник для кнопки "Зберегти на пристрій".
   */
  function handleSaveToDevice() {
    if (currentImageDataUrl) {
      downloadImage(currentImageDataUrl);
    }
    closeExportModal();
  }

  /**
   * Обробник для кнопки "Поділитися у Facebook".
   */
  function handleShareFacebook() {
    const urlToShare = generateCurrentStateUrl();
    if (urlToShare) {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        urlToShare
      )}`;
      window.open(facebookUrl, "_blank", "noopener,noreferrer");
    } else {
      alert(translate("fillFormToShare"));
    }
    closeExportModal();
  }

  /**
   * Обробник для кнопки "Поділитися у Twitter".
   */
  function handleShareTwitter() {
    const urlToShare = generateCurrentStateUrl();
    if (urlToShare) {
      const text = encodeURIComponent(translate("appDescription")); // Можна додати сюди статистику, якщо треба
      const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        urlToShare
      )}&text=${text}`;
      window.open(twitterUrl, "_blank", "noopener,noreferrer");
    } else {
      alert(translate("fillFormToShare"));
    }
    closeExportModal();
  }

  /**
   * Обробник для кнопки "Скопіювати посилання" в модальному вікні.
   */
  function handleCopyLinkModal() {
    const urlToShare = generateCurrentStateUrl();
    if (urlToShare) {
      navigator.clipboard
        .writeText(urlToShare)
        .then(() => {
          announceToScreenReader(translate("linkCopied"));
          // Можна додати візуальний фідбек прямо в модалці, але announce достатньо
        })
        .catch((err) => {
          console.error("Modal copy link error: ", err);
          alert(translate("copyLinkError"));
        });
    } else {
      alert(translate("fillFormToShare"));
    }
    closeExportModal();
  }

  /**
   * Завантажує зображення на пристрій користувача.
   * @param {string} imageDataUrl - Data URL зображення.
   */
  function downloadImage(imageDataUrl) {
    const link = document.createElement("a");
    link.href = imageDataUrl;
    link.download = "my-life-map.png";
    document.body.appendChild(link); // Потрібно для Firefox
    link.click();
    document.body.removeChild(link);
    announceToScreenReader(translate("Image saved.")); // Додано для доступності (треба додати ключ 'Image saved.')
  }

  /**
   * Генерує URL з поточними параметрами форми.
   * @returns {string|null} URL або null, якщо форма не заповнена.
   */
  function generateCurrentStateUrl() {
    const dob = dobInput.value;
    const gender = genderSelect.value;
    const countryCode = countrySelect.value;
    const displayMode = displayModeSelect.value;

    if (!dob || !gender || !countryCode || !displayMode) {
      return null;
    }

    const params = new URLSearchParams({
      dob: dob,
      gender: gender,
      country: countryCode,
      mode: displayMode,
    });

    let path = window.location.pathname;
    if (path === "/" || path.endsWith("/")) {
      path += "index.html";
    }
    return `${window.location.origin}${path}?${params.toString()}`;
  }

  // --- Нові функції для прелоадера ---
  function showPreloader() {
    preloader.setAttribute("aria-hidden", "false");
  }

  function hidePreloader() {
    preloader.setAttribute("aria-hidden", "true");
  }
  // --- Кінець функцій прелоадера ---

  // --- Нові функції для Tooltip ---

  /**
   * Обробляє наведення миші або фокус на клітинку.
   * @param {Event} event Подія mouseover або focus.
   */
  function handleCellHover(event) {
    const cell = event.target;
    const index = parseInt(cell.dataset.index, 10);
    const displayMode = displayModeSelect.value;
    const totalUnits = parseInt(
      statsTotalEl.textContent.replace(/\s/g, ""),
      10
    );
    const dobValue = dobInput.value; // Отримуємо дату народження

    if (
      isNaN(index) ||
      !tooltipElement ||
      !displayMode ||
      isNaN(totalUnits) ||
      !dobValue
    ) {
      // Якщо немає індексу, елемента tooltip, режиму, загальної к-сті або дати народження, не показуємо
      hideTooltip(); // Ховаємо, якщо раптом була видима
      return;
    }

    let unitLabel = "";
    let targetDate = new Date(dobValue); // Створюємо дату на основі ДН
    let dateText = "";

    try {
      // Перевірка валідності дати народження
      if (isNaN(targetDate.getTime())) {
        throw new Error("Invalid date of birth");
      }

      switch (displayMode) {
        case "days":
          unitLabel = translate("daysOption");
          targetDate.setDate(targetDate.getDate() + index);
          break;
        case "weeks":
          unitLabel = translate("weeksOption");
          // Додаємо повні тижні
          targetDate.setDate(targetDate.getDate() + index * 7);
          break;
        case "months":
          unitLabel = translate("monthsOption");
          // Додаємо повні місяці
          targetDate.setMonth(targetDate.getMonth() + index);
          break;
        case "years":
          unitLabel = translate("yearsOption");
          // Додаємо повні роки
          targetDate.setFullYear(targetDate.getFullYear() + index);
          break;
        default:
          unitLabel = "Unit";
          targetDate = null; // Не можемо розрахувати дату для невідомого юніта
      }

      // Форматуємо дату, якщо вона була розрахована
      if (targetDate) {
        dateText = targetDate.toLocaleDateString(currentLang, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      } else {
        dateText = "Invalid unit"; // Якщо displayMode невідомий
      }
    } catch (error) {
      console.error("Error calculating tooltip date:", error);
      dateText = "Error"; // Помилка при розрахунку дати
      unitLabel = "Error";
      targetDate = null; // Скидаємо дату
    }

    // Формуємо текст (1-based index)
    // Перевіряємо чи є валідна дата перед додаванням до тексту
    const tooltipText = targetDate
      ? `${unitLabel} ${index + 1} / ${totalUnits} (${dateText})`
      : `${unitLabel} ${index + 1} / ${totalUnits}`;

    cell.setAttribute("aria-label", tooltipText); // Оновлюємо aria-label

    showTooltip(tooltipText, event);
  }

  /**
   * Показує tooltip з заданим текстом біля події.
   * @param {string} text Текст для показу.
   * @param {Event} event Подія (mouseover або focus), що викликала показ.
   */
  function showTooltip(text, event) {
    if (!tooltipElement) return;

    tooltipElement.textContent = text;

    // Позиціонування біля курсора/елемента
    // Використовуємо clientX/clientY для mouseover, або координати елемента для focus
    const xOffset = 10; // Невеликий відступ від курсора/елемента
    const yOffset = 15;
    let xPos, yPos;

    if (event.type === "mouseover" || event.type === "mousemove") {
      xPos = event.clientX + xOffset;
      yPos = event.clientY + yOffset;
    } else {
      // focus
      const rect = event.target.getBoundingClientRect();
      xPos = rect.left + rect.width / 2; // Приблизно центр елемента
      yPos = rect.bottom + yOffset; // Нижче елемента
    }

    // Перевірка, щоб tooltip не виходив за межі екрану
    tooltipElement.style.left = `0px`; // Скидаємо, щоб отримати реальну ширину
    tooltipElement.style.top = `0px`;
    tooltipElement.setAttribute("aria-hidden", "false"); // Робимо видимим для розрахунку розміру

    const tooltipWidth = tooltipElement.offsetWidth;
    const tooltipHeight = tooltipElement.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (xPos + tooltipWidth > viewportWidth) {
      xPos = viewportWidth - tooltipWidth - xOffset;
    }
    if (yPos + tooltipHeight > viewportHeight) {
      yPos = event.clientY - tooltipHeight - yOffset; // Показувати над курсором, якщо знизу не влазить
      if (yPos < 0) yPos = yOffset; // Якщо і зверху не влазить, ставимо біля верху
    }
    if (xPos < 0) xPos = xOffset;
    if (yPos < 0) yPos = yOffset;

    tooltipElement.style.left = `${xPos}px`;
    tooltipElement.style.top = `${yPos}px`;
    // aria-hidden вже встановлено
  }

  /**
   * Ховає tooltip.
   */
  function hideTooltip() {
    if (!tooltipElement) return;
    tooltipElement.setAttribute("aria-hidden", "true");
  }

  // --- Кінець функцій для Tooltip ---

  // Запускаємо ініціалізацію програми
  initializeApp();
});

// Стилі для visually-hidden вже є в CSS, тут не потрібні.
