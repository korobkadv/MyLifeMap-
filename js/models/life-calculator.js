// models/life-calculator.js
import { CONFIG } from "../config.js";

export class LifeCalculator {
  static calculateUnitsLived(dob, today, mode) {
    if (!(dob instanceof Date) || !(today instanceof Date)) {
      throw new Error("Невірний формат дати");
    }

    const diffTime = today - dob;
    if (diffTime < 0) {
      throw new Error("Дата народження не може бути в майбутньому");
    }

    const calculations = {
      [CONFIG.DISPLAY_MODES.WEEKS]: () =>
        Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)),
      [CONFIG.DISPLAY_MODES.MONTHS]: () =>
        Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)),
      [CONFIG.DISPLAY_MODES.YEARS]: () => this.calculateYears(dob, today),
    };

    if (!calculations[mode]) {
      throw new Error("Невірний режим відображення");
    }

    return calculations[mode]();
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
    if (!countryData || !gender) {
      throw new Error("Недостатньо даних для розрахунку");
    }
    return gender === "male" ? countryData.male : countryData.female;
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
