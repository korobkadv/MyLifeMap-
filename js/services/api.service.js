// services/api.service.js
import { CONFIG } from "../config.js";

export class ApiService {
  static cache = {
    lifeExpectancy: null,
    lastUpdated: null,
  };

  static isCacheValid() {
    if (!this.cache.lifeExpectancy || !this.cache.lastUpdated) return false;
    const cacheAge = Date.now() - this.cache.lastUpdated;
    return cacheAge < 24 * 60 * 60 * 1000; // 24 години
  }

  static async getLifeExpectancyData() {
    // console.log("[ApiService] getLifeExpectancyData started."); // Закоментовано
    try {
      if (this.isCacheValid()) {
        // console.log("[ApiService] Returning cached data."); // Можна додати, якщо цікаво
        return this.cache.lifeExpectancy;
      }

      // Спроба завантажити через API
      try {
        // console.log(`[ApiService] Fetching from: ${CONFIG.API.LIFE_EXPECTANCY_URL}`); // Закоментовано
        const response = await fetch(CONFIG.API.LIFE_EXPECTANCY_URL);
        if (!response.ok) {
          throw new Error(`HTTP помилка! статус: ${response.status}`);
        }
        const data = await response.json();
        // console.log("[ApiService] Data fetched and parsed successfully."); // Закоментовано

        if (!data || !Array.isArray(data)) {
          throw new Error("Невірний формат відповіді API: очікується масив");
        }

        // Валідуємо отримані дані
        const validatedData = this.validateData(data);

        // Оновлюємо кеш
        this.cache.lifeExpectancy = validatedData;
        this.cache.lastUpdated = Date.now();

        return validatedData;
      } catch (fetchError) {
        console.warn("[ApiService] Error during fetch:", fetchError); // Залишено

        // Якщо резервні дані теж не працюють, повертаємо помилку
        throw new Error(
          `Не вдалося завантажити дані про тривалість життя з ${CONFIG.API.LIFE_EXPECTANCY_URL}. Помилка: ${fetchError.message}`
        );
      }
    } catch (error) {
      throw error;
    }
  }

  static validateData(data) {
    if (!Array.isArray(data)) {
      throw new Error("Невірний формат даних");
    }

    const validatedData = data.filter((item) => {
      const isValid =
        item.code &&
        item.name &&
        typeof item.male === "number" &&
        typeof item.female === "number";

      return isValid;
    });

    if (validatedData.length === 0) {
      throw new Error("Немає валідних даних про країни");
    }

    return validatedData;
  }

  // Отримати дані по конкретній країні
  async getCountryData(countryCode) {
    try {
      if (!countryCode) {
        return null;
      }

      // Отримуємо всі дані про країни
      const countries = await ApiService.getLifeExpectancyData();

      // Шукаємо потрібну країну
      const country = countries.find((c) => c.code === countryCode);

      if (!country) {
        console.warn(`Країна з кодом ${countryCode} не знайдена`);
        return null;
      }

      // Перетворюємо на формат, що очікується в додатку
      return {
        code: country.code,
        name: country.name,
        male_life_expectancy: country.male,
        female_life_expectancy: country.female,
      };
    } catch (error) {
      console.error("Помилка отримання даних по країні:", error);
      return null;
    }
  }

  static clearCache() {
    this.cache.lifeExpectancy = null;
    this.cache.lastUpdated = null;
  }
}
