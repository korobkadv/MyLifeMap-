// models/user-preferences.js
import { CONFIG } from "../config.js";

export class UserPreferences {
  constructor(data = {}) {
    this.dob = data.dob || "";
    this.gender = data.gender || "male";
    this.region = data.region || "";
    this.displayMode = data.displayMode || CONFIG.DEFAULTS.DISPLAY_MODE;

    // Додаємо нові поля для відстеження активностей
    this.sleepHours = parseFloat(data["sleep-hours"]) || 8;
    this.workHours = parseFloat(data["work-hours"]) || 8;
    this.sportHours = parseFloat(data["sport-hours"]) || 1;
    // Нові активності
    this.socialHours = parseFloat(data["social-hours"]) || 2;
    this.foodHours = parseFloat(data["food-hours"]) || 1.5;

    // Нові поля: Цифрова активність
    this.screenTimeHours = parseFloat(data["screen-time-hours"]) || 4;
    this.readingHours = parseFloat(data["reading-hours"]) || 0.5;
    this.gamingHours = parseFloat(data["gaming-hours"]) || 1;

    // Нові поля: Подорожі та транспорт
    this.transportHours = parseFloat(data["transport-hours"]) || 1;
    this.tripsPerYear = parseFloat(data["trips-per-year"]) || 2;
    this.transportType = data["transport-type"] || "public";

    // Розрахунок годин дозвілля (інший час)
    this.leisureHours = Math.max(
      24 -
        this.sleepHours -
        this.workHours -
        this.sportHours -
        this.socialHours -
        this.foodHours -
        this.screenTimeHours -
        this.readingHours -
        this.gamingHours -
        this.transportHours,
      0
    );

    // Розрахунок споживання їжі
    this.meatPerDay = parseFloat(data["meat-per-day"]) || 0.25; // в кг
    this.vegetablesPerDay = parseFloat(data["vegetables-per-day"]) || 0.5; // в кг

    // Об'єкт з усіма годинами активності
    this.activityHours = {
      sleep: this.sleepHours,
      work: this.workHours,
      sport: this.sportHours,
      social: this.socialHours,
      food: this.foodHours,
      screen: this.screenTimeHours,
      reading: this.readingHours,
      gaming: this.gamingHours,
      transport: this.transportHours,
      leisure: this.leisureHours,
    };

    // Об'єкт з даними про харчування
    this.foodConsumption = {
      meat: this.meatPerDay,
      vegetables: this.vegetablesPerDay,
    };

    // Об'єкт з даними про подорожі
    this.travelData = {
      tripsPerYear: this.tripsPerYear,
      transportType: this.transportType,
      transportHours: this.transportHours,
    };
  }

  validate() {
    const errors = [];

    if (!this.dob) {
      errors.push("Вкажіть дату народження");
    }
    if (!this.gender) {
      errors.push("Вкажіть стать");
    }
    if (!this.region) {
      errors.push("Виберіть регіон");
    }
    if (!this.displayMode) {
      errors.push("Виберіть режим відображення");
    }

    return errors;
  }

  toJSON() {
    return {
      dob: this.dob,
      gender: this.gender,
      region: this.region,
      displayMode: this.displayMode,
      "sleep-hours": this.sleepHours,
      "work-hours": this.workHours,
      "sport-hours": this.sportHours,
      "social-hours": this.socialHours,
      "food-hours": this.foodHours,
      "screen-time-hours": this.screenTimeHours,
      "reading-hours": this.readingHours,
      "gaming-hours": this.gamingHours,
      "transport-hours": this.transportHours,
      "trips-per-year": this.tripsPerYear,
      "transport-type": this.transportType,
      "meat-per-day": this.meatPerDay,
      "vegetables-per-day": this.vegetablesPerDay,
      activityHours: this.activityHours,
      foodConsumption: this.foodConsumption,
      travelData: this.travelData,
    };
  }

  // Отримати відсотки розподілу часу
  getActivityPercentages() {
    const total =
      this.sleepHours +
      this.workHours +
      this.sportHours +
      this.socialHours +
      this.foodHours +
      this.screenTimeHours +
      this.readingHours +
      this.gamingHours +
      this.transportHours +
      this.leisureHours;

    return {
      sleep: Math.round((this.sleepHours / total) * 100),
      work: Math.round((this.workHours / total) * 100),
      sport: Math.round((this.sportHours / total) * 100),
      social: Math.round((this.socialHours / total) * 100),
      food: Math.round((this.foodHours / total) * 100),
      screen: Math.round((this.screenTimeHours / total) * 100),
      reading: Math.round((this.readingHours / total) * 100),
      gaming: Math.round((this.gamingHours / total) * 100),
      transport: Math.round((this.transportHours / total) * 100),
      leisure: Math.round((this.leisureHours / total) * 100),
    };
  }

  // Розрахувати загальне споживання їжі за роки життя
  calculateLifetimeConsumption(ageInYears) {
    if (!ageInYears || ageInYears <= 0) return null;

    // Припускаємо, що споживання їжі почалося з 1 року
    const effectiveYears = Math.max(0, ageInYears - 1);

    return {
      meat: Math.round(this.meatPerDay * 365 * effectiveYears),
      vegetables: Math.round(this.vegetablesPerDay * 365 * effectiveYears),
    };
  }

  // Розрахувати загальний час подорожей за життя
  calculateLifetimeTravel(ageInYears) {
    if (!ageInYears || ageInYears <= 0) return null;

    // Враховуємо, що активні подорожі зазвичай починаються з 5 років
    const travelYears = Math.max(0, ageInYears - 5);

    // Кількість днів в подорожах за все життя (в середньому 5 днів на подорож)
    const travelDays = this.tripsPerYear * travelYears * 5;

    // Загальна відстань (приблизно - використовуємо середні значення)
    let totalDistance = 0;
    switch (this.transportType) {
      case "car":
        totalDistance = travelDays * 200; // 200 км/день в середньому
        break;
      case "public":
        totalDistance = travelDays * 100; // 100 км/день в середньому
        break;
      case "bicycle":
        totalDistance = travelDays * 30; // 30 км/день в середньому
        break;
      default:
        totalDistance = travelDays * 150; // середнє значення
    }

    return {
      trips: Math.round(this.tripsPerYear * travelYears),
      days: travelDays,
      distance: Math.round(totalDistance),
      transportHours: Math.round(
        (this.transportHours * 365 * travelYears) / 24
      ),
    };
  }
}
