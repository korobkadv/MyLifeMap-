// models/life-calculator.js
import { CONFIG } from "../config.js";

export class LifeCalculator {
  static calculateUnitsLived(dob, today, mode) {
    // Рахуємо кількість прожитих одиниць (тижнів, місяців, років)
    const diff = today - dob;
    const daysDiff = diff / (1000 * 60 * 60 * 24);

    switch (mode) {
      case "weeks":
        return Math.floor(daysDiff / 7);
      case "months":
        // Рахуємо кількість прожитих місяців
        const monthYears = today.getFullYear() - dob.getFullYear();
        const months = today.getMonth() - dob.getMonth();
        const adjustedMonths = monthYears * 12 + months;

        // Якщо день у місяці сьогодні менший за день народження,
        // віднімаємо один місяць (не повний місяць)
        return today.getDate() < dob.getDate()
          ? adjustedMonths - 1
          : adjustedMonths;
      case "years":
        // Визначаємо вік у роках
        let ageYears = today.getFullYear() - dob.getFullYear();
        // Якщо день народження ще не настав у поточному році
        if (
          today.getMonth() < dob.getMonth() ||
          (today.getMonth() === dob.getMonth() &&
            today.getDate() < dob.getDate())
        ) {
          ageYears--;
        }
        return ageYears;
      default:
        return 0;
    }
  }

  static calculateYears(dob, today) {
    let years = today.getFullYear() - dob.getFullYear();
    if (
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
      years--;
    }
    return years;
  }

  static calculateLifeExpectancy(countryData, gender) {
    // Перевіряємо, чи передані всі необхідні дані
    if (!countryData || !gender) {
      return gender === "male" ? 72 : 78; // Значення за замовчуванням
    }

    // Отримуємо значення очікуваної тривалості життя в залежності від статі
    let lifeExpectancy;
    switch (gender.toLowerCase()) {
      case "male":
        lifeExpectancy = countryData.male || 72; // Запасне значення, якщо дані відсутні
        break;
      case "female":
        lifeExpectancy = countryData.female || 78; // Запасне значення, якщо дані відсутні
        break;
      default:
        lifeExpectancy = (countryData.male + countryData.female) / 2 || 75; // Середнє значення
        break;
    }

    // Рахуємо фінальне значення з округленням до цілих років
    return Math.round(lifeExpectancy);
  }

  static getLifeStatistics(unitsLived, totalUnits, mode) {
    return {
      unitsLived,
      totalUnits,
      percentage: ((unitsLived / totalUnits) * 100).toFixed(1),
      remaining: totalUnits - unitsLived,
      mode,
    };
  }

  static calculateTotalUnits(lifeExpectancy, mode) {
    const unitsPerYear = {
      [CONFIG.DISPLAY_MODES.WEEKS]: 52,
      [CONFIG.DISPLAY_MODES.MONTHS]: 12,
      [CONFIG.DISPLAY_MODES.YEARS]: 1,
    };
    return Math.round(lifeExpectancy * unitsPerYear[mode]);
  }
}
