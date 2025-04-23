import { CONFIG } from "../config.js";

export class ValidationService {
  static validateFormData(formData) {
    const errors = [];
    const today = new Date();
    const dob = new Date(formData.get("dob"));
    const age = this.calculateAge(dob, today);

    // Валідація дати народження
    if (!formData.get("dob")) {
      errors.push("Дата народження є обов'язковою");
    } else if (isNaN(dob.getTime())) {
      errors.push("Некоректна дата народження");
    } else if (age < CONFIG.VALIDATION.MIN_AGE) {
      errors.push("Вік не може бути меншим за 0");
    } else if (age > CONFIG.VALIDATION.MAX_AGE) {
      errors.push("Вік не може бути більшим за 120");
    }

    // Валідація статі
    if (!formData.get("gender")) {
      errors.push("Стать є обов'язковою");
    }

    // Валідація регіону
    if (!formData.get("region")) {
      errors.push("Регіон є обов'язковим");
    }

    // Валідація режиму відображення
    if (!formData.get("display-mode")) {
      errors.push("Режим відображення є обов'язковим");
    }

    return errors;
  }

  static calculateAge(dob, today) {
    const diff = today - dob;
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  static sanitizeInput(input) {
    if (typeof window.DOMPurify !== "undefined") {
      return window.DOMPurify.sanitize(input, CONFIG.SECURITY.SANITIZE_OPTIONS);
    }
    // Якщо DOMPurify не завантажений, повертаємо вхідний текст без змін
    console.warn("DOMPurify не завантажений, санітизація не виконана");
    return input;
  }

  static validateAndSanitizeUserInput(input) {
    const sanitized = this.sanitizeInput(input);
    // Додаткові перевірки на XSS
    if (sanitized !== input) {
      console.warn("Потенційно небезпечний ввід було очищено");
    }
    return sanitized;
  }
}
