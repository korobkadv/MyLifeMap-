// services/fun-facts.service.js
export class FunFactsService {
  static timeFactsUa = [
    { text: "Людина в середньому проводить 26 років у сні за своє життя." },
    { text: "Середня людина витрачає близько 90,000 годин життя на роботу." },
    {
      text: "Діти сміються близько 300-400 разів на день, дорослі лише 15-20.",
    },
    {
      text: "Людина моргає приблизно 15-20 разів на хвилину, що становить до 10 мільйонів разів на рік.",
    },
    { text: "Протягом життя серце б'ється близько 2.5 мільярдів разів." },
    {
      text: "Середня людина витрачає 6 місяців життя на очікування червоного світла світлофора.",
    },
    {
      text: "За все життя людина проходить відстань, рівну приблизно 5 обертам довкола Землі.",
    },
  ];

  static healthFactsUa = [
    { text: "В тілі людини знаходиться близько 100 000 км кровоносних судин." },
    {
      text: "Протягом життя легені обробляють близько 300 мільйонів літрів повітря.",
    },
    {
      text: "За життя людина виробляє стільки слини, що могла б заповнити два басейни.",
    },
    { text: "Шкіра людини оновлюється повністю приблизно кожні 27 днів." },
    { text: "Шлунок виробляє новий шар слизової оболонки кожні 2 тижні." },
  ];

  static cultureFactsUa = [
    {
      text: "Найдавніший музичний інструмент - це флейта, виготовлена з кістки птаха 40 000 років тому.",
    },
    {
      text: "Найбільш читана книга у світі - Біблія, яка була перекладена більш ніж 700 мовами.",
    },
    {
      text: "Перший у світі фільм був менше 1 хвилини довжиною і не мав звуку.",
    },
    { text: "Найдовший концерт в історії тривав 639 годин." },
  ];

  // Нові факти про соціальні мережі
  static socialFactsUa = [
    {
      text: "В середньому користувач проводить 2 години та 24 хвилини щодня в соціальних мережах.",
    },
    {
      text: "Близько 3,96 мільярдів людей активно використовують соціальні мережі щодня.",
    },
    {
      text: "Кожну хвилину в Instagram завантажується приблизно 65,000 фотографій.",
    },
    {
      text: "Середньостатистична людина перевіряє свій телефон приблизно 58 разів на день.",
    },
    {
      text: "Користувачі TikTok в середньому проводять 52 хвилини на день в додатку.",
    },
  ];

  // Нові факти про харчування
  static foodFactsUa = [
    { text: "Середня людина за життя споживає близько 35 тонн їжі." },
    {
      text: "Для вирощування 1 кг яловичини потрібно близько 15,000 літрів води.",
    },
    { text: "Людина з'їдає приблизно 7,000 кг їжі за перші 10 років життя." },
    { text: "Середня людина споживає м'ясо приблизно 4 рази на тиждень." },
    { text: "За життя людина може з'їсти близько 5 тонн овочів та фруктів." },
  ];

  // Нові факти про цифрову активність
  static digitalFactsUa = [
    {
      text: "Перший електронний комп'ютер ENIAC (1945) важив 27 тонн і займав площу 167 кв.м.",
    },
    {
      text: "За день у світі надсилається понад 300 мільярдів електронних листів.",
    },
    {
      text: "Щохвилини на YouTube завантажується близько 500 годин відеоконтенту.",
    },
    {
      text: "Кожну секунду в світі проводиться понад 70 000 пошукових запитів у Google.",
    },
    {
      text: "Середня людина проводить близько 6 років життя за переглядом відео та телевізора.",
    },
  ];

  // Нові факти про подорожі та транспорт
  static travelFactsUa = [
    {
      text: "За життя середня людина проводить близько 4.3 років у дорозі.",
    },
    {
      text: "Найдовша залізнична мережа - Транссибірська магістраль - має довжину 9289 км.",
    },
    {
      text: "Велосипед є найбільш енергоефективним транспортним засобом, витрачаючи лише 35 калорій на кілометр.",
    },
    {
      text: "Людина, що користується громадським транспортом, зменшує свій вуглецевий слід на 2.2 тонни CO2 на рік.",
    },
    {
      text: "Середній автомобіль проїжджає близько 320 000 км за свій життєвий цикл.",
    },
  ];

  static activityFactsUa = {
    sleep: {
      text: "Якісний сон покращує пам'ять та здатність до навчання на 40%.",
    },
    work: {
      text: "Короткі перерви під час роботи збільшують продуктивність на 16%.",
    },
    sport: {
      text: "Регулярна фізична активність знижує ризик серцевих захворювань на 35%.",
    },
    social: {
      text: "Використання соціальних мереж більше 3 годин на день може збільшити відчуття самотності на 43%.",
    },
    food: {
      text: "Регулярне споживання їжі в спокійному середовищі покращує травлення на 30%.",
    },
    // Нові факти про цифрову активність
    screenTime: {
      text: "Перегляд екранів перед сном зменшує вироблення мелатоніну на 22%, погіршуючи якість сну.",
    },
    reading: {
      text: "Регулярне читання знижує ризик розвитку деменції на 32% у пізньому віці.",
    },
    gaming: {
      text: "Помірні відеоігри покращують координацію рук та очей на 27%.",
    },
    // Нові факти про подорожі
    transport: {
      text: "Щоденне ходіння пішки протягом 20 хвилин зменшує ризик серцево-судинних захворювань на 30%.",
    },
    leisure: {
      text: "Люди, які виділяють час на хобі, на 34% менше страждають від стресу.",
    },
  };

  static ageFactsUa = [
    {
      minAge: 0,
      maxAge: 12,
      text: "Ви все ще ростете швидше, ніж будь-коли в своєму житті!",
    },
    {
      minAge: 13,
      maxAge: 19,
      text: "Ваш мозок розвивається найактивніше, формуючи ваше майбутнє.",
    },
    {
      minAge: 20,
      maxAge: 29,
      text: "Ви зараз на піку своїх фізичних можливостей.",
    },
    {
      minAge: 30,
      maxAge: 39,
      text: "Ваша емоційна стабільність зараз краща, ніж коли-небудь.",
    },
    {
      minAge: 40,
      maxAge: 49,
      text: "Ви перебуваєте на піку кар'єрного зростання та життєвої мудрості.",
    },
    {
      minAge: 50,
      maxAge: 59,
      text: "Ваша здатність вирішувати складні життєві проблеми досягає максимуму.",
    },
    {
      minAge: 60,
      maxAge: 69,
      text: "Ви зараз відчуваєте найбільше задоволення від життя, згідно з дослідженнями.",
    },
    {
      minAge: 70,
      maxAge: 120,
      text: "Ви маєте унікальний життєвий досвід, який цінніший за золото.",
    },
  ];

  static countryFactsUa = {
    UA: { text: "В Україні знаходиться географічний центр Європи." },
    US: {
      text: "США має найбільшу економіку в світі з ВВП понад 20 трильйонів доларів.",
    },
    GB: {
      text: "Лондонське метро є найстарішим у світі, воно було відкрито в 1863 році.",
    },
    CA: { text: "Канада має найдовшу берегову лінію у світі — 202,080 км." },
    AU: { text: "В Австралії більше кенгуру, ніж людей." },
    DE: { text: "Німеччина має понад 1,500 видів ковбас і 1,000 видів хліба." },
    FR: {
      text: "У Франції незаконно викидати хліб, так як він вважається символом Франції.",
    },
    IT: {
      text: "В Італії знаходиться найбільша кількість об'єктів світової спадщини ЮНЕСКО.",
    },
  };

  static genderFactsUa = {
    male: {
      text: "Чоловіки в середньому говорять приблизно 7,000 слів на день, тоді як жінки — близько 20,000.",
    },
    female: {
      text: "Жінки мають на 10% більше нейронів у мозкових центрах слуху, що дозволяє їм краще чути нюанси звуків.",
    },
  };

  // Генерує персоналізовані факти на основі даних користувача
  static generatePersonalizedFacts(userData) {
    try {
      // Створюємо об'єкт для фактів та ініціалізуємо його
      const facts = {
        timeFacts: [],
        healthFacts: [],
        cultureFacts: [],
        socialFacts: [],
        foodFacts: [],
        digitalFacts: [],
        travelFacts: [],
        activityFacts: {
          sleepFacts: [],
          workFacts: [],
          sportFacts: [],
          socialFacts: [],
          foodFacts: [],
          screenTimeFacts: [],
          readingFacts: [],
          gamingFacts: [],
          transportFacts: [],
          leisureFacts: [],
        },
        ageFacts: [],
        countryFacts: [],
        genderFacts: [],
      };

      // Отримуємо відсотки активностей користувача
      const activityPercentages = this.calculateActivityPercentages(userData);

      // Генеруємо випадкові факти з різних категорій
      facts.timeFacts = this.getRandomFacts(this.timeFactsUa, 3);
      facts.healthFacts = this.getRandomFacts(this.healthFactsUa, 3);
      facts.cultureFacts = this.getRandomFacts(this.cultureFactsUa, 3);
      facts.socialFacts = this.getRandomFacts(this.socialFactsUa, 3);
      facts.foodFacts = this.getRandomFacts(this.foodFactsUa, 3);
      facts.digitalFacts = this.getRandomFacts(this.digitalFactsUa, 3);
      facts.travelFacts = this.getRandomFacts(this.travelFactsUa, 3);

      // Додаємо факти за активностями
      if (this.activityFactsUa.sleep) {
        facts.activityFacts.sleepFacts.push(this.activityFactsUa.sleep);
      }

      if (this.activityFactsUa.work) {
        facts.activityFacts.workFacts.push(this.activityFactsUa.work);
      }

      if (this.activityFactsUa.sport) {
        facts.activityFacts.sportFacts.push(this.activityFactsUa.sport);
      }

      if (this.activityFactsUa.social) {
        facts.activityFacts.socialFacts.push(this.activityFactsUa.social);
      }

      if (this.activityFactsUa.food) {
        facts.activityFacts.foodFacts.push(this.activityFactsUa.food);
      }

      if (this.activityFactsUa.screenTime) {
        facts.activityFacts.screenTimeFacts.push(
          this.activityFactsUa.screenTime
        );
      }

      if (this.activityFactsUa.reading) {
        facts.activityFacts.readingFacts.push(this.activityFactsUa.reading);
      }

      if (this.activityFactsUa.gaming) {
        facts.activityFacts.gamingFacts.push(this.activityFactsUa.gaming);
      }

      if (this.activityFactsUa.transport) {
        facts.activityFacts.transportFacts.push(this.activityFactsUa.transport);
      }

      if (this.activityFactsUa.leisure) {
        facts.activityFacts.leisureFacts.push(this.activityFactsUa.leisure);
      }

      // Додаємо факти за віком, країною та статтю якщо вони доступні
      if (userData.age) {
        facts.ageFacts = [this.getFactByAge(userData.age)];
      }

      if (userData.country) {
        facts.countryFacts = [this.getFactByCountry(userData.country)];
      }

      if (userData.gender) {
        facts.genderFacts = [this.getFactByGender(userData.gender)];
      }

      return facts;
    } catch (error) {
      console.error("Error generating personalized facts:", error);
      return {
        timeFacts: [],
        healthFacts: [],
        cultureFacts: [],
        socialFacts: [],
        foodFacts: [],
        digitalFacts: [],
        travelFacts: [],
        activityFacts: {
          sleepFacts: [],
          workFacts: [],
          sportFacts: [],
          socialFacts: [],
          foodFacts: [],
          screenTimeFacts: [],
          readingFacts: [],
          gamingFacts: [],
          transportFacts: [],
          leisureFacts: [],
        },
        ageFacts: [],
        countryFacts: [],
        genderFacts: [],
      };
    }
  }

  // Отримати випадковий факт з масиву
  static getRandomFact(factsArray) {
    const randomIndex = Math.floor(Math.random() * factsArray.length);
    return factsArray[randomIndex];
  }

  // Метод для отримання декількох випадкових фактів з масиву
  static getRandomFacts(factsArray, count = 1) {
    if (!factsArray || factsArray.length === 0) {
      return ["Інформація відсутня"];
    }

    const result = [];
    const tempArray = [...factsArray]; // Копіюємо масив, щоб не змінювати оригінал

    // Якщо фактів менше, ніж запитано, повертаємо всі доступні
    if (tempArray.length <= count) {
      return tempArray;
    }

    // Вибираємо випадкові унікальні факти
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * tempArray.length);
      result.push(tempArray[randomIndex]);
      tempArray.splice(randomIndex, 1); // Видаляємо використаний факт
    }

    return result;
  }

  // Отримати факт за віком
  static getFactByAge(age) {
    if (!age || age <= 0) return null;

    // Пошук факту відповідно до вікового діапазону
    const ageFact = this.ageFactsUa.find(
      (fact) => age >= fact.minAge && age <= fact.maxAge
    );

    return ageFact || this.ageFactsUa[this.ageFactsUa.length - 1];
  }

  // Отримати факт за статтю
  static getFactByGender(gender) {
    if (!gender) return null;
    return this.genderFactsUa[gender] || this.genderFactsUa["male"];
  }

  // Отримати факт за країною
  static getFactByCountry(country) {
    if (!country) return null;
    return this.countryFactsUa[country] || this.countryFactsUa["UA"];
  }

  // Розрахувати відсотки активностей на основі даних користувача
  static calculateActivityPercentages(userData) {
    // Якщо є дані про активності, використовуємо їх
    if (
      userData.sleepHours !== undefined &&
      userData.workHours !== undefined &&
      userData.sportHours !== undefined
    ) {
      // Використовуємо дані, надані користувачем
      const sleepHours = userData.sleepHours;
      const workHours = userData.workHours;
      const sportHours = userData.sportHours;
      const socialHours = userData.socialHours || 2;
      const foodHours = userData.foodHours || 1.5;
      const screenHours = userData.screenTimeHours || 4;
      const readingHours = userData.readingHours || 0.5;
      const gamingHours = userData.gamingHours || 1;
      const transportHours = userData.transportHours || 1;
      const leisureHours = Math.max(
        24 -
          sleepHours -
          workHours -
          sportHours -
          socialHours -
          foodHours -
          screenHours -
          readingHours -
          gamingHours -
          transportHours,
        0
      );

      // Розрахуємо загальну кількість годин
      const totalHours =
        sleepHours +
        workHours +
        sportHours +
        socialHours +
        foodHours +
        screenHours +
        readingHours +
        gamingHours +
        transportHours +
        leisureHours;

      // Розрахуємо відсотки
      return {
        sleep: Math.round((sleepHours / totalHours) * 100),
        work: Math.round((workHours / totalHours) * 100),
        sport: Math.round((sportHours / totalHours) * 100),
        social: Math.round((socialHours / totalHours) * 100),
        food: Math.round((foodHours / totalHours) * 100),
        screenTime: Math.round((screenHours / totalHours) * 100),
        reading: Math.round((readingHours / totalHours) * 100),
        gaming: Math.round((gamingHours / totalHours) * 100),
        transport: Math.round((transportHours / totalHours) * 100),
        leisure: Math.round((leisureHours / totalHours) * 100),
      };
    } else {
      // Стандартні значення, якщо не надано даних
      return {
        sleep: 33,
        work: 33,
        sport: 4,
        social: 8,
        food: 6,
        screenTime: 5,
        reading: 2,
        gaming: 3,
        transport: 4,
        leisure: 2,
      };
    }
  }

  static calculateLifetimeConsumption(userData) {
    if (!userData || !userData.age) return null;

    // Отримуємо дані про споживання
    const meatPerDay = userData.meatPerDay || 0.25; // кг
    const vegetablesPerDay = userData.vegetablesPerDay || 0.5; // кг

    // Розраховуємо споживання за все життя (припускаємо, що дитина починає їсти тверду їжу з 1 року)
    const effectiveYears = Math.max(0, userData.age - 1);

    // Загальне споживання в кг
    const totalMeat = Math.round(meatPerDay * 365 * effectiveYears);
    const totalVegetables = Math.round(vegetablesPerDay * 365 * effectiveYears);

    // Деякі цікаві порівняння
    const elephantWeight = 5000; // кг
    const carWeight = 1500; // кг

    return {
      totalMeat: totalMeat,
      totalVegetables: totalVegetables,
      totalFood: totalMeat + totalVegetables,
      comparisons: {
        elephantPercentage: (
          ((totalMeat + totalVegetables) / elephantWeight) *
          100
        ).toFixed(1),
        carPercentage: (
          ((totalMeat + totalVegetables) / carWeight) *
          100
        ).toFixed(1),
      },
    };
  }

  // Додаємо новий метод для розрахунку даних про подорожі
  static calculateLifetimeTravel(userData) {
    if (!userData || !userData.age) return null;

    // Отримуємо дані про подорожі
    const tripsPerYear = userData.tripsPerYear || 2;
    const transportHours = userData.transportHours || 1;
    const transportType = userData.transportType || "public";

    // Активні подорожі зазвичай починаються з 5 років
    const travelYears = Math.max(0, userData.age - 5);

    // Кількість днів в подорожах за все життя (в середньому 5 днів на подорож)
    const travelDays = tripsPerYear * travelYears * 5;

    // Загальна відстань (приблизно - використовуємо середні значення)
    let avgDistancePerDay = 0;
    let avgSpeed = 0;
    let co2Reduction = 0;

    switch (transportType) {
      case "car":
        avgDistancePerDay = 200; // 200 км/день в середньому
        avgSpeed = 60; // км/год
        co2Reduction = -0.2; // збільшення викидів
        break;
      case "public":
        avgDistancePerDay = 100; // 100 км/день в середньому
        avgSpeed = 30; // км/год
        co2Reduction = 0.5; // зменшення викидів
        break;
      case "bicycle":
        avgDistancePerDay = 30; // 30 км/день в середньому
        avgSpeed = 15; // км/год
        co2Reduction = 0.9; // максимальне зменшення викидів
        break;
      default:
        avgDistancePerDay = 150; // середнє значення
        avgSpeed = 40; // км/год
        co2Reduction = 0.3; // середнє зменшення викидів
    }

    const totalDistance = travelDays * avgDistancePerDay;
    const earthCircumference = 40075; // км
    const timesAroundEarth = (totalDistance / earthCircumference).toFixed(2);

    return {
      totalTrips: Math.round(tripsPerYear * travelYears),
      totalDays: travelDays,
      totalDistance: Math.round(totalDistance),
      transportHoursPerYear: Math.round(transportHours * 365),
      transportYears:
        Math.round(((transportHours * 365 * travelYears) / 24 / 365) * 10) / 10,
      comparisons: {
        timesAroundEarth: timesAroundEarth,
        toMoonPercentage: ((totalDistance / 384400) * 100).toFixed(1), // відстань до Місяця ~384400 км
        co2Saved: Math.round(co2Reduction * travelYears), // приблизна оцінка CO2 в тоннах
      },
    };
  }
}
