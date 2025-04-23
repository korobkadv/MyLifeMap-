import { HISTORICAL_EVENTS } from "../data/historical-events.js";

export class HistoricalEventsService {
  constructor() {
    this.events = HISTORICAL_EVENTS;
  }

  getEventsForLifespan(birthYear, currentYear, region) {
    // Отримуємо глобальні події, які відповідають терміну життя
    const globalEvents = this.filterEventsByPeriod(
      this.events.GLOBAL || [],
      birthYear,
      currentYear
    );

    // Отримуємо регіональні події для вказаної країни
    const regionalEvents = this.filterEventsByPeriod(
      this.events[region] || [],
      birthYear,
      currentYear
    );

    // Об'єднуємо глобальні та регіональні події
    const allEvents = [...globalEvents, ...regionalEvents];

    // Сортуємо події за роком
    return allEvents.sort((a, b) => a.year - b.year);
  }

  filterEventsByPeriod(events, birthYear, currentYear) {
    return events
      .filter((event) => {
        const eventYear = new Date(event.date).getFullYear();
        return eventYear >= birthYear && eventYear <= currentYear;
      })
      .map((event) => ({
        ...event,
        year: new Date(event.date).getFullYear(),
      }));
  }

  getAllEvents() {
    // Повертає всі події (може бути корисно для адмін-панелі або повного списку)
    const allEvents = [];

    // Додаємо глобальні події
    if (this.events.GLOBAL) {
      allEvents.push(
        ...this.events.GLOBAL.map((event) => ({
          ...event,
          year: new Date(event.date).getFullYear(),
        }))
      );
    }

    // Додаємо регіональні події
    Object.keys(this.events).forEach((region) => {
      if (region !== "GLOBAL") {
        allEvents.push(
          ...this.events[region].map((event) => ({
            ...event,
            region,
            year: new Date(event.date).getFullYear(),
          }))
        );
      }
    });

    // Сортуємо за роком
    return allEvents.sort((a, b) => a.year - b.year);
  }
}
