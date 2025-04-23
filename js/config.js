export const CONFIG = {
  API: {
    LIFE_EXPECTANCY_URL: "/data/life_expectancy.json",
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
    EASING: "cubic-bezier(0.4, 0, 0.2, 1)",
    BLOCK_APPEARANCE: {
      SCALE: "scale(0)",
      OPACITY: 0,
      TRANSFORM: "translateY(20px)",
    },
    BLOCK_FINAL: {
      SCALE: "scale(1)",
      OPACITY: 1,
      TRANSFORM: "translateY(0)",
    },
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
  VALIDATION: {
    MIN_AGE: 0,
    MAX_AGE: 120,
    DATE_FORMAT: "YYYY-MM-DD",
    REQUIRED_FIELDS: ["dob", "gender", "region", "display-mode"],
  },
  PERFORMANCE: {
    BATCH_SIZE: 100,
    VIRTUALIZATION_THRESHOLD: 1000,
    DEBOUNCE_DELAY: 300,
  },
  SECURITY: {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTRIBUTES: ["class", "id", "style"],
    SANITIZE_OPTIONS: {
      allowedTags: ["b", "i", "em", "strong", "p", "br"],
      allowedAttributes: {
        "*": ["class", "id", "style"],
      },
    },
  },
  COMPARISON: {
    AVERAGE_LIFE_EXPECTANCY: {
      MALE: 72,
      FEMALE: 78,
      GLOBAL: 75,
    },
    MILESTONES: {
      EDUCATION: 18,
      CAREER_START: 22,
      RETIREMENT: 65,
    },
  },
  DEFAULT_COUNTRY: "UA",
  DEFAULT_LIFE_EXPECTANCY: 75,
  DEFAULT_SLEEP_HOURS: 7,
  DEFAULT_WORK_HOURS: 8,
  DEFAULT_SPORT_HOURS: 1,
  DEFAULT_SOCIAL_HOURS: 2,
  DEFAULT_FOOD_HOURS: 2,
  DEFAULT_SCREEN_HOURS: 3,
  DEFAULT_READING_HOURS: 1,
  DEFAULT_GAMING_HOURS: 1,
  DEFAULT_TRANSPORT_HOURS: 1,
  DEFAULT_TRIPS_PER_YEAR: 2,
  DEFAULT_TRANSPORT_TYPE: "car",
  AVERAGE_TRIP_DISTANCE: 1000,
  GLOBAL_LIFE_EXPECTANCY: 75,
  DEFAULT_GENDER: "male",
  DEFAULT_MEAT_PER_DAY: 0.25,
  DEFAULT_VEGETABLES_PER_DAY: 0.5,
};

Object.freeze(CONFIG);
