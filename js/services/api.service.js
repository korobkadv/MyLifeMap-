// services/api.service.js
import { CONFIG } from "../config.js";

export class ApiService {
  static async getLifeExpectancyData() {
    try {
      const response = await fetch(CONFIG.API.LIFE_EXPECTANCY_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return this.validateData(data.countries); // Отримуємо масив з countries
    } catch (error) {
      console.error("API Error:", error);
      throw new Error("Не вдалося завантажити дані про тривалість життя");
    }
  }

  static validateData(data) {
    if (!Array.isArray(data)) {
      throw new Error("Невірний формат даних");
    }
    return data.filter(
      (item) =>
        item.code &&
        item.name &&
        typeof item.male === "number" &&
        typeof item.female === "number"
    );
  }
}
