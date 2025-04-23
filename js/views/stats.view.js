// views/stats.view.js
import { CONFIG } from "../config.js";

export class StatsView {
  constructor(container) {
    this.container = container;

    // Базові значення для статистики за замовчуванням
    this.defaultStats = {
      statistics: {
        lived: 0,
        remaining: 0,
        total: 0,
        percentage: 0,
      },
      comparison: {
        sleepTime: "0 років",
        workTime: "0 років",
        exerciseTime: "0 років",
        socialTime: "0 років",
        foodTime: "0 років",
        screenTime: "0 років",
        readingTime: "0 років",
        gamingTime: "0 років",
        transportTime: "0 років",
        leisureTime: "0 років",
        historicalEventsCount: 0,
        sleepPercentage: 0,
        workPercentage: 0,
        exercisePercentage: 0,
        socialPercentage: 0,
        foodPercentage: 0,
        screenPercentage: 0,
        readingPercentage: 0,
        gamingPercentage: 0,
        transportPercentage: 0,
        leisurePercentage: 0,
      },
      countryData: {
        name: "-",
        code: "-",
      },
    };

    this.hasData = false;
  }

  render(data) {
    if (!this.container) return;

    // Перевіряємо, чи є дані
    if (!data || !data.statistics) {
      this.hasData = false;
      // Замінюємо консольний лог на інформативне повідомлення для користувача
      this.container.innerHTML = `
        <div class="stats-empty-state">
          <h3>Немає даних для відображення</h3>
          <p>Будь ласка, введіть ваші дані у формі вище, щоб побачити персоналізовану статистику.</p>
        </div>
      `;
      return;
    }

    // Позначаємо що є дані
    this.hasData = true;

    const { statistics = {}, comparison = {}, countryData = {} } = data;

    // Перевірка обов'язкових полів statistics
    const validatedStats = {
      lived: statistics.lived ?? 0,
      remaining: statistics.remaining ?? 0,
      percentage: statistics.percentage ?? 0,
      mode: statistics.mode ?? "years",
      total: statistics.total ?? 0,
    };

    // Перевірка обов'язкових полів comparison
    const validatedComparison = {
      lifeExpectancy: {
        countryLifeExpectancy:
          comparison.lifeExpectancy?.countryLifeExpectancy ?? 0,
        percentage: comparison.lifeExpectancy?.percentage ?? 0,
        difference: comparison.lifeExpectancy?.difference ?? 0,
      },
      sleepTime: comparison.sleepTime || "0 років",
      workTime: comparison.workTime || "0 років",
      exerciseTime: comparison.exerciseTime || "0 років",
      socialTime: comparison.socialTime || "0 років",
      foodTime: comparison.foodTime || "0 років",
      screenTime: comparison.screenTime || "0 років",
      readingTime: comparison.readingTime || "0 років",
      gamingTime: comparison.gamingTime || "0 років",
      transportTime: comparison.transportTime || "0 років",
      leisureTime: comparison.leisureTime || "0 років",
      historicalEventsCount: comparison.historicalEventsCount || 0,
      sleepPercentage: comparison.sleepPercentage || 0,
      workPercentage: comparison.workPercentage || 0,
      exercisePercentage: comparison.exercisePercentage || 0,
      socialPercentage: comparison.socialPercentage || 0,
      foodPercentage: comparison.foodPercentage || 0,
      screenPercentage: comparison.screenPercentage || 0,
      readingPercentage: comparison.readingPercentage || 0,
      gamingPercentage: comparison.gamingPercentage || 0,
      transportPercentage: comparison.transportPercentage || 0,
      leisurePercentage: comparison.leisurePercentage || 0,
      foodConsumption: comparison.foodConsumption || { meat: 0, vegetables: 0 },
      trips: comparison.trips || { perYear: 0, distancePerLifetime: 0 },
    };

    // Формуємо додаткову інформацію про країну
    const countryCode = countryData.code ? countryData.code.toLowerCase() : "";
    const countryFlag = countryCode
      ? `<img class="country-flag" src="https://flagcdn.com/w80/${countryCode}.png" 
            alt="${countryData.name} прапор" 
            data-country-code="${countryCode}">`
      : "";

    // Формування HTML для статистики
    const statsHTML = `
      <div class="stats-summary__content">
        <div class="country-header">
          <h3 class="country-info-title">
            ${countryData.name || "Не вказано"} ${countryFlag}
          </h3>
        </div>

        <div class="comparison-section">
          <h3 class="comparison-title">Порівняння з середніми показниками</h3>
          
          <div class="comparison-grid">
            <div class="comparison-card">
              <h4 class="comparison-title">Середня тривалість життя</h4>
              <p class="comparison-value">${
                this.isValidNumber(
                  validatedComparison.lifeExpectancy.countryLifeExpectancy
                )
                  ? validatedComparison.lifeExpectancy.countryLifeExpectancy
                  : "Н/Д"
              } років</p>
              <p class="comparison-description">У вашій країні</p>
            </div>

            <div class="comparison-card">
              <h4 class="comparison-title">Прожито</h4>
              <p class="comparison-value">${
                this.isValidNumber(
                  validatedComparison.lifeExpectancy.percentage
                )
                  ? `${validatedComparison.lifeExpectancy.percentage}%`
                  : "Н/Д"
              }</p>
              <p class="comparison-description">від середньої тривалості життя</p>
            </div>

            <div class="comparison-card">
              <h4 class="comparison-title">Залишилось</h4>
              <p class="comparison-value">${
                this.isValidNumber(
                  validatedComparison.lifeExpectancy.difference
                )
                  ? Math.round(validatedComparison.lifeExpectancy.difference)
                  : "Н/Д"
              } років</p>
              <p class="comparison-description">за середніми показниками</p>
            </div>
          </div>
        </div>
        
        <!-- Секція використаного часу -->
        <div class="comparison-section">
          <h3 class="comparison-title">Статистика життя</h3>
          
          <div class="comparison-grid">
            <div class="comparison-card">
              <h4 class="comparison-title">Сон</h4>
              <div class="activity-icon">💤</div>
              <p class="comparison-value">${validatedComparison.sleepTime}</p>
              <p class="comparison-description">${
                validatedComparison.sleepPercentage
              }% вашого часу</p>
            </div>

            <div class="comparison-card">
              <h4 class="comparison-title">Робота/Навчання</h4>
              <div class="activity-icon">💼</div>
              <p class="comparison-value">${validatedComparison.workTime}</p>
              <p class="comparison-description">${
                validatedComparison.workPercentage
              }% вашого часу</p>
            </div>

            <div class="comparison-card">
              <h4 class="comparison-title">Фізична активність</h4>
              <div class="activity-icon">🏃‍♂️</div>
              <p class="comparison-value">${
                validatedComparison.exerciseTime
              }</p>
              <p class="comparison-description">${
                validatedComparison.exercisePercentage
              }% вашого часу</p>
            </div>
            
            <div class="comparison-card">
              <h4 class="comparison-title">Соцмережі</h4>
              <div class="activity-icon">📱</div>
              <p class="comparison-value">${
                validatedComparison.socialTime || "0 років"
              }</p>
              <p class="comparison-description">${
                validatedComparison.socialPercentage || 0
              }% вашого часу</p>
            </div>
            
            <div class="comparison-card">
              <h4 class="comparison-title">Харчування</h4>
              <div class="activity-icon">🍽️</div>
              <p class="comparison-value">${
                validatedComparison.foodTime || "0 років"
              }</p>
              <p class="comparison-description">${
                validatedComparison.foodPercentage || 0
              }% вашого часу</p>
            </div>
            
            <!-- Нові картки для цифрової активності -->
            <div class="comparison-card">
              <h4 class="comparison-title">Екранний час</h4>
              <div class="activity-icon">📺</div>
              <p class="comparison-value">${
                validatedComparison.screenTime || "0 років"
              }</p>
              <p class="comparison-description">${
                validatedComparison.screenPercentage || 0
              }% вашого часу</p>
            </div>
            
            <div class="comparison-card">
              <h4 class="comparison-title">Читання</h4>
              <div class="activity-icon">📚</div>
              <p class="comparison-value">${
                validatedComparison.readingTime || "0 років"
              }</p>
              <p class="comparison-description">${
                validatedComparison.readingPercentage || 0
              }% вашого часу</p>
            </div>
            
            <div class="comparison-card">
              <h4 class="comparison-title">Відеоігри</h4>
              <div class="activity-icon">🎮</div>
              <p class="comparison-value">${
                validatedComparison.gamingTime || "0 років"
              }</p>
              <p class="comparison-description">${
                validatedComparison.gamingPercentage || 0
              }% вашого часу</p>
            </div>
            
            <div class="comparison-card">
              <h4 class="comparison-title">Транспорт</h4>
              <div class="activity-icon">🚗</div>
              <p class="comparison-value">${
                validatedComparison.transportTime || "0 років"
              }</p>
              <p class="comparison-description">${
                validatedComparison.transportPercentage || 0
              }% вашого часу</p>
            </div>

            <div class="comparison-card">
              <h4 class="comparison-title">Дозвілля</h4>
              <div class="activity-icon">🎨</div>
              <p class="comparison-value">${validatedComparison.leisureTime}</p>
              <p class="comparison-description">${
                validatedComparison.leisurePercentage
              }% вашого часу</p>
            </div>
          </div>
        </div>
        
        <!-- Секція подорожей -->
        <div class="comparison-section">
          <h3 class="comparison-title">Подорожі та транспорт</h3>
          
          <div class="comparison-grid">
            <div class="comparison-card">
              <h4 class="comparison-title">Подорожі на рік</h4>
              <div class="activity-icon">✈️</div>
              <p class="comparison-value">${
                validatedComparison.trips.perYear || 0
              }</p>
              <p class="comparison-description">${
                validatedComparison.trips.comparisonText || "Подорожі"
              }</p>
            </div>
            
            <div class="comparison-card">
              <h4 class="comparison-title">Загальна відстань</h4>
              <div class="activity-icon">🗺️</div>
              <p class="comparison-value">${this.formatDistance(
                validatedComparison.trips.distancePerLifetime
              )}</p>
              <p class="comparison-description">за все життя</p>
            </div>
          </div>
        </div>

        <!-- Секція споживання -->
        <div class="comparison-section">
          <h3 class="comparison-title">Споживання їжі</h3>
          
          <div class="comparison-grid">
            <div class="comparison-card">
              <h4 class="comparison-title">М'ясо та риба</h4>
              <div class="activity-icon">🥩</div>
              <p class="comparison-value">${
                validatedComparison.foodConsumption?.totalMeat
                  ? `${validatedComparison.foodConsumption.totalMeat} кг`
                  : "0 кг"
              }</p>
              <p class="comparison-description">за все життя</p>
            </div>
            
            <div class="comparison-card">
              <h4 class="comparison-title">Овочі та фрукти</h4>
              <div class="activity-icon">🥗</div>
              <p class="comparison-value">${
                validatedComparison.foodConsumption?.totalVegetables
                  ? `${validatedComparison.foodConsumption.totalVegetables} кг`
                  : "0 кг"
              }</p>
              <p class="comparison-description">за все життя</p>
            </div>
          </div>
        </div>
        
        <!-- Секція історичних подій -->
        <div class="comparison-section">
          <h3 class="comparison-title">Історичні події</h3>
          
          <div class="comparison-grid">
            <div class="comparison-card full-width">
              <h4 class="comparison-title">Значущі події</h4>
              <p class="comparison-value">${
                validatedComparison.historicalEventsCount
              }</p>
              <p class="comparison-description">визначних подій відбулося за ваше життя</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = statsHTML;
    this.setupFlagErrorHandlers();
  }

  hasValidData() {
    return this.hasData;
  }

  formatPopulation(population) {
    if (!population) return "Невідомо";

    if (population >= 1000000000) {
      return (population / 1000000000).toFixed(1) + " млрд";
    } else if (population >= 1000000) {
      return (population / 1000000).toFixed(1) + " млн";
    } else if (population >= 1000) {
      return (population / 1000).toFixed(1) + " тис";
    } else {
      return population.toString();
    }
  }

  formatDistance(distance) {
    if (!distance) return "0 км";

    if (distance >= 1000000) {
      return Math.round(distance / 10000) / 100 + " млн км";
    } else if (distance >= 1000) {
      return Math.round(distance / 10) / 100 + " тис км";
    } else {
      return distance + " км";
    }
  }

  isValidNumber(value) {
    return typeof value === "number" && !isNaN(value) && isFinite(value);
  }

  setupFlagErrorHandlers() {
    const flags = this.container.querySelectorAll(".country-flag");
    flags.forEach((flag) => {
      flag.addEventListener("error", this.handleFlagError);
    });
  }

  handleFlagError(event) {
    // Якщо зображення прапора не завантажилося, показуємо код країни
    const img = event.target;
    const countryCode = img.getAttribute("data-country-code");
    if (countryCode) {
      // Створюємо елемент для відображення коду країни
      const code = document.createElement("span");
      code.className = "country-code";
      code.textContent = countryCode.toUpperCase();

      // Замінюємо зображення на код
      img.parentNode.replaceChild(code, img);
    } else {
      // Якщо немає коду, просто ховаємо зображення
      img.style.display = "none";
    }
  }

  static getCountryEmoji(countryCode) {
    if (!countryCode) return "";

    // Перетворюємо двобуквений код країни в emoji прапор
    // Використовуємо Regional Indicator Symbols
    const firstLetter = countryCode.charCodeAt(0) - 65 + 0x1f1e6;
    const secondLetter = countryCode.charCodeAt(1) - 65 + 0x1f1e6;

    // Перевіряємо чи вхідні символи валідні
    if (
      firstLetter < 0x1f1e6 ||
      firstLetter > 0x1f1ff ||
      secondLetter < 0x1f1e6 ||
      secondLetter > 0x1f1ff
    ) {
      return "";
    }

    return (
      String.fromCodePoint(firstLetter) + String.fromCodePoint(secondLetter)
    );
  }

  getUnitText(mode) {
    switch (mode) {
      case "weeks":
        return "тижнів";
      case "months":
        return "місяців";
      case "years":
        return "років";
      default:
        return "";
    }
  }

  renderMilestones(milestones) {
    if (!milestones) return "";

    const { completed, upcoming } = milestones;

    // Визначаємо, скільки віх відображати
    const completedMilestonesToShow = completed.slice(0, 3);
    const upcomingMilestonesToShow = upcoming.slice(0, 3);

    const completedHTML = completedMilestonesToShow.length
      ? `
      <div class="milestones-group">
        <h4 class="milestones-title">Пройдені віхи життя</h4>
        <div class="milestones-list">
          ${completedMilestonesToShow
            .map(
              (ms) => `
            <div class="milestone-item completed">
              <div class="milestone-age">${ms.age} років</div>
              <div class="milestone-details">
                <h5 class="milestone-name">${this.formatMilestoneName(
                  ms.name
                )}</h5>
                <p class="milestone-description">${ms.description}</p>
                <p class="milestone-timing">${ms.yearsAgo} ${
                ms.yearsAgo === 1 ? "рік" : "років"
              } тому</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      : "";

    const upcomingHTML = upcomingMilestonesToShow.length
      ? `
      <div class="milestones-group">
        <h4 class="milestones-title">Майбутні віхи життя</h4>
        <div class="milestones-list">
          ${upcomingMilestonesToShow
            .map(
              (ms) => `
            <div class="milestone-item upcoming">
              <div class="milestone-age">${ms.age} років</div>
              <div class="milestone-details">
                <h5 class="milestone-name">${this.formatMilestoneName(
                  ms.name
                )}</h5>
                <p class="milestone-description">${ms.description}</p>
                <p class="milestone-timing">через ${ms.yearsLeft} ${
                ms.yearsLeft === 1 ? "рік" : "років"
              }</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      : "";

    return completedHTML + upcomingHTML;
  }

  formatMilestoneName(name) {
    // Прибираємо HTML-теги для безпеки
    return name.replace(/<\/?[^>]+(>|$)/g, "");
  }
}
