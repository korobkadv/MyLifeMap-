// models/user-preferences.js
import { CONFIG } from "../config.js";

export class UserPreferences {
  constructor(data = null) {
    const preferences = data || {};
    this.dob = preferences.dob || "";
    this.gender = preferences.gender || "male";
    this.country = preferences.country || "";
    this.displayMode = preferences.displayMode || CONFIG.DEFAULTS.DISPLAY_MODE;
  }

  validate() {
    const errors = [];

    if (!this.dob) {
      errors.push("Вкажіть дату народження");
    }
    if (!this.gender) {
      errors.push("Вкажіть стать");
    }
    if (!this.country) {
      errors.push("Виберіть країну");
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
      country: this.country,
      displayMode: this.displayMode,
    };
  }
}
