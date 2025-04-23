import { CONFIG } from "../config.js";

export class ComparisonService {
  /**
   * Порівняння з середніми показниками
   * @param {Object} userData - дані користувача
   * @returns {Object} - дані порівняння
   */
  static compareWithAverage(userData) {
    if (!userData) return {};

    const {
      sleepHours,
      workHours,
      sportHours,
      socialHours,
      foodHours,
      screenTimeHours,
      readingHours,
      gamingHours,
      transportHours,
      tripsPerYear,
      transportType,
      meatPerDay,
      vegetablesPerDay,
    } = userData;
    const ageInYears = userData.age?.years || 30;

    // Середня тривалість життя (глобально)
    const avgLifeExpectancy = 72;

    // Стандартні години на день для активностей
    const avgSleepHours = 8;
    const avgWorkHours = 8;
    const avgSportHours = 0.5;
    const avgSocialHours = 2;
    const avgFoodHours = 2;
    const avgScreenTimeHours = 3;
    const avgReadingHours = 0.5;
    const avgGamingHours = 0.5;
    const avgTransportHours = 1.5;
    const avgLeisureHours = 5;

    // Середня кількість подорожей на рік
    const avgTripsPerYear = 2;

    // Середнє споживання їжі (в грамах)
    const avgMeatPerDay = 150;
    const avgVegetablesPerDay = 300;

    // Розрахунок часу, проведеного на різні активності за життя
    const calculateTimeSpent = (hoursPerDay, totalYears) => {
      const totalHours = hoursPerDay * 365 * totalYears;
      const years = (totalHours / (24 * 365)).toFixed(1);
      const days = Math.floor((totalHours % (24 * 365)) / 24);
      return { hours: totalHours, days, years };
    };

    // Очікуваний вік користувача для розрахунків
    const expectedAge =
      userData.countryData?.lifeExpectancy || avgLifeExpectancy;

    // Розрахунок часу, проведеного за різними активностями
    const timeSpent = {
      sleeping: calculateTimeSpent(sleepHours || avgSleepHours, expectedAge),
      working: calculateTimeSpent(workHours || avgWorkHours, expectedAge * 0.6), // Робота ~60% життя
      exercising: calculateTimeSpent(sportHours || avgSportHours, expectedAge),
      social: calculateTimeSpent(socialHours || avgSocialHours, expectedAge),
      food: calculateTimeSpent(foodHours || avgFoodHours, expectedAge),
      screenTime: calculateTimeSpent(
        screenTimeHours || avgScreenTimeHours,
        expectedAge
      ),
      reading: calculateTimeSpent(readingHours || avgReadingHours, expectedAge),
      gaming: calculateTimeSpent(gamingHours || avgGamingHours, expectedAge),
      transport: calculateTimeSpent(
        transportHours || avgTransportHours,
        expectedAge
      ),
      leisure: calculateTimeSpent(leisure || avgLeisureHours, expectedAge),
    };

    // Розрахунок споживання їжі за життя
    const foodConsumption = {
      meat: Math.floor(
        ((meatPerDay || avgMeatPerDay) * 365 * expectedAge) / 1000
      ), // в кг
      vegetables: Math.floor(
        ((vegetablesPerDay || avgVegetablesPerDay) * 365 * expectedAge) / 1000
      ), // в кг
    };

    // Розрахунок подорожей і відстаней
    const calculateTravelDistance = (trips, type, years) => {
      // Середні відстані на подорож (в км) залежно від типу транспорту
      const avgDistanceByType = {
        car: 500,
        bus: 300,
        train: 800,
        plane: 2500,
        bike: 20,
        walk: 5,
      };

      const distancePerYear =
        trips * (avgDistanceByType[type] || avgDistanceByType.car);
      return Math.floor(distancePerYear * years);
    };

    const trips = {
      perYear: tripsPerYear || avgTripsPerYear,
      distancePerLifetime: calculateTravelDistance(
        tripsPerYear || avgTripsPerYear,
        transportType || "car",
        expectedAge
      ),
    };

    return {
      expectedAge,
      currentAge: ageInYears,
      timeSpent,
      foodConsumption,
      trips,
    };
  }

  /**
   * Порівняння життєвих віх
   * @param {Object} userData - дані користувача
   * @returns {Array} - віхи життя з відмітками досягнення
   */
  static compareMilestones(userData) {
    if (!userData || !userData.age) return [];

    const age = userData.age.years;
    const gender = userData.gender || "male";

    // Список життєвих віх для порівняння
    const milestones = [
      {
        name: "Народження",
        age: 0,
        achieved: true,
        description: "Початок подорожі життя",
      },
      {
        name: "Перші кроки",
        age: 1,
        achieved: age >= 1,
        description: "Перші самостійні кроки",
      },
      {
        name: "Початок шкільного навчання",
        age: 6,
        achieved: age >= 6,
        description: "Перший день у школі",
      },
      {
        name: "Підлітковий вік",
        age: 13,
        achieved: age >= 13,
        description: "Початок підліткового віку",
      },
      {
        name: "Повноліття",
        age: 18,
        achieved: age >= 18,
        description: "Юридичне повноліття",
      },
      {
        name: "Середній вік першого шлюбу",
        age: gender === "male" ? 27 : 25,
        achieved: age >= (gender === "male" ? 27 : 25),
        description: `Середній вік першого шлюбу в Україні для ${
          gender === "male" ? "чоловіків" : "жінок"
        }`,
      },
      {
        name: "Середній вік народження першої дитини",
        age: gender === "male" ? 28 : 26,
        achieved: age >= (gender === "male" ? 28 : 26),
        description: "Середній вік народження першої дитини в Україні",
      },
      {
        name: "Середина життя",
        age: 40,
        achieved: age >= 40,
        description: "Половина середньої тривалості життя досягнута",
      },
      {
        name: "Пенсійний вік",
        age: gender === "male" ? 60 : 60,
        achieved: age >= (gender === "male" ? 60 : 60),
        description: `Пенсійний вік в Україні для ${
          gender === "male" ? "чоловіків" : "жінок"
        }`,
      },
    ];

    return milestones;
  }

  /**
   * Обчислює очікувану тривалість життя
   */
  static getLifeExpectancy(countryData, gender) {
    if (!countryData) {
      return gender === "male" ? 70 : 75;
    }
    return gender === "male" ? countryData.male : countryData.female;
  }

  /**
   * Обчислює час, витрачений на певну активність
   * @param {number} ageInYears - вік у роках
   * @param {number} hoursPerDay - годин на день
   * @param {boolean} adultOnly - чи враховувати лише дорослий вік
   * @returns {number} - витрачений час у роках
   */
  static calculateTimeSpent(ageInYears, hoursPerDay, adultOnly = false) {
    const activeYears = adultOnly
      ? Math.max(0, ageInYears - 18) // Врахування лише дорослого віку
      : ageInYears;

    // Переведення годин на день у роки
    return (hoursPerDay * activeYears) / 24;
  }

  /**
   * Повертає середню кількість годин сну залежно від віку
   */
  static getAvgSleepHours(ageInYears) {
    if (ageInYears < 3) return 14;
    if (ageInYears < 6) return 12;
    if (ageInYears < 14) return 10;
    if (ageInYears < 18) return 9;
    if (ageInYears < 65) return 8;
    return 7;
  }

  /**
   * Повертає середню кількість годин роботи/навчання залежно від віку
   */
  static getAvgWorkHours(ageInYears) {
    if (ageInYears < 6) return 0;
    if (ageInYears < 18) return 6; // школа
    if (ageInYears < 65) return 8; // робота
    return 2; // пенсія
  }

  /**
   * Повертає порівняльний текст про сон
   */
  static getSleepComparison(userHours, avgHours) {
    const diff = userHours - avgHours;
    if (diff > 1)
      return `Ви спите більше ніж середньостатистична людина на ${diff} годин`;
    if (diff < -1)
      return `Ви спите менше ніж середньостатистична людина на ${Math.abs(
        diff
      )} годин`;
    return "Ваш сон відповідає середньостатистичному";
  }

  /**
   * Повертає порівняльний текст про роботу
   */
  static getWorkComparison(userHours, avgHours) {
    const diff = userHours - avgHours;
    if (diff > 1)
      return `Ви працюєте більше ніж середньостатистична людина на ${diff} годин`;
    if (diff < -1)
      return `Ви працюєте менше ніж середньостатистична людина на ${Math.abs(
        diff
      )} годин`;
    return "Ваш робочий час відповідає середньостатистичному";
  }

  /**
   * Повертає порівняльний текст про фізичну активність
   */
  static getExerciseComparison(userHours, avgHours) {
    const diff = userHours - avgHours;
    if (diff > 0.5)
      return `Ви більш фізично активні ніж середньостатистична людина на ${diff} годин`;
    if (diff < -0.5)
      return `Ви менш фізично активні ніж середньостатистична людина на ${Math.abs(
        diff
      )} годин`;
    return "Ваша фізична активність відповідає середньостатистичній";
  }

  /**
   * Повертає порівняльний текст про історичні події
   */
  static getHistoricalEventsComparison(userEvents, avgEvents) {
    if (userEvents > avgEvents) {
      return `Ви пережили більше значних історичних подій, ніж середня людина вашого віку`;
    }
    if (userEvents < avgEvents) {
      return `Ви пережили менше значних історичних подій, ніж середня людина вашого віку`;
    }
    return `Кількість значних історичних подій, які ви пережили, відповідає середній`;
  }

  /**
   * Обчислює час, витрачений у соціальних мережах з урахуванням їх появи
   * @param {number} birthYear - рік народження
   * @param {number} hoursPerDay - годин на день у соціальних мережах
   * @returns {number} - витрачений час у роках
   */
  static calculateSocialNetworkTime(birthYear, hoursPerDay) {
    const currentYear = new Date().getFullYear();
    // Соціальні мережі почали активно використовуватись приблизно з 2004 року
    const socialNetworksStartYear = 2004;

    // Якщо людина народилась після 2004, розраховуємо час з віку 10 років
    // (припускаємо, що до 10 років діти не користуються активно соціальними мережами)
    if (birthYear >= socialNetworksStartYear) {
      const socialNetworksAge = Math.max(0, currentYear - birthYear - 10);
      return (hoursPerDay * socialNetworksAge) / 24;
    }

    // Для людей, які народились до 2004, рахуємо тільки час після 2004 року
    const yearsAfterSocialNetworks = currentYear - socialNetworksStartYear;
    return (hoursPerDay * yearsAfterSocialNetworks) / 24;
  }

  /**
   * Обчислює час, витрачений на харчування з урахуванням віку
   * @param {number} ageInYears - вік у роках
   * @param {number} hoursPerDay - годин на день на харчування у дорослому віці
   * @returns {number} - витрачений час у роках
   */
  static calculateFoodTime(ageInYears, hoursPerDay) {
    // Діти до 3 років проводять менше часу на їжу
    let totalFoodTime = 0;

    // Діти до 3 років - приблизно 1 година на день
    if (ageInYears >= 3) {
      totalFoodTime += (1 * Math.min(3, ageInYears)) / 24;
    }

    // Діти від 3 до 12 років - приблизно 1.2 години на день
    if (ageInYears > 3) {
      totalFoodTime += (1.2 * Math.min(9, ageInYears - 3)) / 24;
    }

    // Підлітки від 12 до 18 років - приблизно 1.3 години на день
    if (ageInYears > 12) {
      totalFoodTime += (1.3 * Math.min(6, ageInYears - 12)) / 24;
    }

    // Дорослі - вказана кількість годин на день
    if (ageInYears > 18) {
      totalFoodTime += (hoursPerDay * (ageInYears - 18)) / 24;
    }

    return totalFoodTime;
  }

  /**
   * Обчислює час, витрачений на перегляд екранів
   * @param {number} birthYear - рік народження
   * @param {number} hoursPerDay - годин на день перед екраном
   * @returns {number} - витрачений час у роках
   */
  static calculateScreenTime(birthYear, hoursPerDay) {
    const currentYear = new Date().getFullYear();

    // Персональні комп'ютери стали популярними у 1990-х, смартфони - у 2010-х
    const pcEraStartYear = 1990;
    const smartphoneEraStartYear = 2010;

    let totalScreenTime = 0;

    // Якщо народився після початку ери ПК, але до смартфонів
    if (birthYear < smartphoneEraStartYear && birthYear >= pcEraStartYear) {
      // Час до ери смартфонів (менше годин - приблизно половина сучасного часу)
      const pcOnlyYears = Math.min(
        smartphoneEraStartYear - Math.max(birthYear, pcEraStartYear),
        smartphoneEraStartYear - pcEraStartYear
      );
      totalScreenTime += (hoursPerDay * 0.5 * pcOnlyYears) / 24;

      // Час після появи смартфонів
      if (birthYear < smartphoneEraStartYear) {
        const smartphoneYears = currentYear - smartphoneEraStartYear;
        totalScreenTime += (hoursPerDay * smartphoneYears) / 24;
      }
    }
    // Якщо народився після ери смартфонів
    else if (birthYear >= smartphoneEraStartYear) {
      // Починаємо рахувати активне використання з 5 років
      const activeYears = Math.max(0, currentYear - (birthYear + 5));
      totalScreenTime += (hoursPerDay * activeYears) / 24;
    }
    // Якщо народився до ери ПК
    else {
      // Час до ери ПК - незначний екранний час (телебачення)
      const preComputerYears = pcEraStartYear - birthYear;
      totalScreenTime += (hoursPerDay * 0.2 * preComputerYears) / 24;

      // Час від ери ПК до смартфонів
      const pcOnlyYears = smartphoneEraStartYear - pcEraStartYear;
      totalScreenTime += (hoursPerDay * 0.5 * pcOnlyYears) / 24;

      // Час після появи смартфонів
      const smartphoneYears = currentYear - smartphoneEraStartYear;
      totalScreenTime += (hoursPerDay * smartphoneYears) / 24;
    }

    return totalScreenTime;
  }

  /**
   * Обчислює час, витрачений на читання
   * @param {number} ageInYears - вік у роках
   * @param {number} hoursPerDay - годин на день на читання у дорослому віці
   * @returns {number} - витрачений час у роках
   */
  static calculateReadingTime(ageInYears, hoursPerDay) {
    let totalReadingTime = 0;

    // До 5 років - переважно батьки читають дітям, мало часу
    if (ageInYears >= 5) {
      totalReadingTime += (0.2 * Math.min(5, ageInYears)) / 24;
    }

    // 5-10 років - період навчання читанню
    if (ageInYears > 5) {
      totalReadingTime += (0.5 * Math.min(5, ageInYears - 5)) / 24;
    }

    // 10-18 років - шкільне читання
    if (ageInYears > 10) {
      totalReadingTime += (0.7 * Math.min(8, ageInYears - 10)) / 24;
    }

    // 18+ років - доросле читання
    if (ageInYears > 18) {
      totalReadingTime += (hoursPerDay * (ageInYears - 18)) / 24;
    }

    return totalReadingTime;
  }

  /**
   * Обчислює час, витрачений на ігри
   * @param {number} birthYear - рік народження
   * @param {number} hoursPerDay - годин на день на ігри
   * @returns {number} - витрачений час у роках
   */
  static calculateGamingTime(birthYear, hoursPerDay) {
    const currentYear = new Date().getFullYear();

    // Відеоігри стали популярними у середині 1980-х
    const gamingEraStartYear = 1985;

    let totalGamingTime = 0;

    // Якщо народився після початку ери відеоігор
    if (birthYear >= gamingEraStartYear) {
      // Припускаємо, що активний ігровий вік починається з 8 років
      const activeGamingAge = Math.max(0, currentYear - (birthYear + 8));
      totalGamingTime = (hoursPerDay * activeGamingAge) / 24;
    }
    // Якщо народився до ери відеоігор
    else {
      // Час після початку ери відеоігор
      const gamingYears = currentYear - gamingEraStartYear;

      // Обчислюємо вік на момент початку ери відеоігор
      const ageAtGamingStart = gamingEraStartYear - birthYear;

      // Якщо був молодшим за 30 на початку ери відеоігор, вважаємо активним гравцем
      if (ageAtGamingStart < 30) {
        totalGamingTime = (hoursPerDay * gamingYears) / 24;
      }
      // Якщо був старшим за 30, вважаємо меншу активність у відеоіграх
      else {
        totalGamingTime = (hoursPerDay * 0.3 * gamingYears) / 24;
      }
    }

    return totalGamingTime;
  }

  /**
   * Обчислює час, витрачений у транспорті
   * @param {number} ageInYears - вік у роках
   * @param {number} hoursPerDay - годин на день у транспорті у дорослому віці
   * @returns {number} - витрачений час у роках
   */
  static calculateTransportTime(ageInYears, hoursPerDay) {
    let totalTransportTime = 0;

    // До 6 років - мінімальний самостійний час у транспорті
    if (ageInYears >= 6) {
      totalTransportTime += (0.3 * Math.min(6, ageInYears)) / 24;
    }

    // 6-18 років - транспорт до школи та назад
    if (ageInYears > 6) {
      totalTransportTime += (0.8 * Math.min(12, ageInYears - 6)) / 24;
    }

    // 18+ років - доросле використання транспорту
    if (ageInYears > 18) {
      totalTransportTime += (hoursPerDay * (ageInYears - 18)) / 24;
    }

    return totalTransportTime;
  }

  /**
   * Обчислює приблизну загальну відстань, пройдену в подорожах за життя
   * @param {number} ageInYears - вік у роках
   * @param {number} tripsPerYear - кількість подорожей на рік
   * @param {string} transportType - основний тип транспорту
   * @returns {number} - приблизна відстань в кілометрах
   */
  static calculateLifetimeDistance(ageInYears, tripsPerYear, transportType) {
    // Враховуємо, що активні подорожі починаються з 5 років
    const travelYears = Math.max(0, ageInYears - 5);

    // Середня відстань на одну подорож за типом транспорту
    let avgDistancePerTrip = 0;
    switch (transportType) {
      case "car":
        avgDistancePerTrip = 500; // 500 км на подорож
        break;
      case "public":
        avgDistancePerTrip = 300; // 300 км на подорож
        break;
      case "bicycle":
        avgDistancePerTrip = 100; // 100 км на подорож
        break;
      default:
        avgDistancePerTrip = 1000; // для літака або комбінованого транспорту
    }

    return Math.round(travelYears * tripsPerYear * avgDistancePerTrip);
  }

  /**
   * Повертає порівняльний текст про екранний час
   */
  static getScreenTimeComparison(userHours, avgHours) {
    const diff = userHours - avgHours;
    if (diff > 1)
      return `Ви проводите перед екраном більше часу, ніж середньостатистична людина на ${diff} годин на день`;
    if (diff < -1)
      return `Ви проводите перед екраном менше часу, ніж середньостатистична людина на ${Math.abs(
        diff
      )} годин на день`;
    return "Ваш екранний час відповідає середньостатистичному";
  }

  /**
   * Повертає порівняльний текст про читання
   */
  static getReadingComparison(userHours, avgHours) {
    const diff = userHours - avgHours;
    if (diff > 0.2)
      return `Ви читаєте більше, ніж середньостатистична людина на ${diff.toFixed(
        1
      )} годин на день`;
    if (diff < -0.2)
      return `Ви читаєте менше, ніж середньостатистична людина на ${Math.abs(
        diff
      ).toFixed(1)} годин на день`;
    return "Ваш час на читання відповідає середньостатистичному";
  }

  /**
   * Повертає порівняльний текст про транспорт
   */
  static getTransportComparison(userHours, avgHours) {
    const diff = userHours - avgHours;
    if (diff > 0.5)
      return `Ви проводите в дорозі більше часу, ніж середньостатистична людина на ${diff.toFixed(
        1
      )} годин на день`;
    if (diff < -0.5)
      return `Ви проводите в дорозі менше часу, ніж середньостатистична людина на ${Math.abs(
        diff
      ).toFixed(1)} годин на день`;
    return "Ваш час у дорозі відповідає середньостатистичному";
  }

  /**
   * Повертає порівняльний текст про подорожі
   */
  static getTripsComparison(userTrips, avgTrips) {
    const diff = userTrips - avgTrips;
    if (diff > 0.5)
      return `Ви подорожуєте частіше, ніж середньостатистична людина на ${diff.toFixed(
        1
      )} подорожей на рік`;
    if (diff < -0.5)
      return `Ви подорожуєте рідше, ніж середньостатистична людина на ${Math.abs(
        diff
      ).toFixed(1)} подорожей на рік`;
    return "Ваша частота подорожей відповідає середньостатистичній";
  }
}
