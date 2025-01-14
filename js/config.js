export const CONFIG = {
  API: {
    LIFE_EXPECTANCY_URL: "../data/life_expectancy.json",
  },
  DISPLAY_MODES: {
    WEEKS: "weeks",
    MONTHS: "months",
    YEARS: "years",
  },
  STORAGE_KEYS: {
    USER_PREFERENCES: "life-map-preferences",
    THEME: "life-map-theme",
  },
  THEMES: {
    LIGHT: "light",
    DARK: "dark",
  },
  ANIMATION: {
    DURATION: 300,
    DELAY_BETWEEN_BLOCKS: 20,
  },
  DEFAULTS: {
    THEME: "dark",
    DISPLAY_MODE: "weeks",
  },
  TOOLTIPS: {
    WEEKS: "тиждень життя",
    MONTHS: "місяць життя",
    YEARS: "рік життя",
  },
  EXPORT: {
    FILENAME: "my-life-map",
    IMAGE_TYPE: "image/png",
    QUALITY: 0.95,
  },
};

Object.freeze(CONFIG);
// export default CONFIG;
