export class HistoricalEventsView {
  constructor(container) {
    this.container =
      container || document.querySelector(".historical-events-section");
  }

  render(events) {
    if (!this.container || !events) return;

    // Отримуємо рік народження користувача з URL-параметрів або з localStorage
    const userBirthYear = this.getUserBirthYear();

    // Сортуємо події в хронологічному порядку
    const sortedEvents = [...events].sort((a, b) => a.year - b.year);

    const completedEvents = sortedEvents.filter(
      (event) => event.year <= new Date().getFullYear()
    );
    const upcomingEvents = sortedEvents.filter(
      (event) => event.year > new Date().getFullYear()
    );

    this.container.innerHTML = `
      <div class="historical-events-wrapper">
        <h3 class="historical-events__title">Видатні події життя</h3>
        
        <div class="historical-events__timeline">
          ${completedEvents
            .map((event) => {
              // Вік користувача на момент події
              const userAge = userBirthYear
                ? Math.max(0, event.year - userBirthYear)
                : 0;
              const ageText = userAge > 0 ? `(Вам було ${userAge} років)` : "";

              return `
                  <div class="historical-event">
                    <div class="historical-event__icon"></div>
                    <div class="historical-event__content">
                      <h5 class="historical-event__title">${event.title}</h5>
                      <div class="historical-event__meta">
                        <span class="historical-event__year">${event.year}</span>
                        <span class="historical-event__age">${ageText}</span>
                      </div>
                      <p class="historical-event__description">${event.description}</p>
                    </div>
                  </div>
                `;
            })
            .join("")}
        </div>
        
        ${
          upcomingEvents.length > 0
            ? `
            <div class="historical-events__upcoming">
              <h4 class="historical-events__subtitle">Майбутні події</h4>
              <div class="historical-events__timeline">
                ${upcomingEvents
                  .map((event) => {
                    // Вік користувача на момент майбутньої події
                    const userAge = userBirthYear
                      ? Math.max(0, event.year - userBirthYear)
                      : 0;
                    const ageText =
                      userAge > 0 ? `(Вам буде ${userAge} років)` : "";

                    return `
                        <div class="historical-event">
                          <div class="historical-event__icon historical-event__icon--future"></div>
                          <div class="historical-event__content">
                            <h5 class="historical-event__title">${event.title}</h5>
                            <div class="historical-event__meta">
                              <span class="historical-event__year">${event.year}</span>
                              <span class="historical-event__age">${ageText}</span>
                            </div>
                            <p class="historical-event__description">${event.description}</p>
                          </div>
                        </div>
                      `;
                  })
                  .join("")}
              </div>
            </div>
            `
            : ""
        }
      </div>
    `;
  }

  // Додамо метод showEmptyMessage для відображення повідомлення про відсутність історичних подій
  showEmptyMessage(message) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="historical-events-wrapper">
        <h3 class="historical-events__title">Видатні події життя</h3>
        <div class="historical-events__empty">
          <p class="historical-events__empty-message">${
            message || "Не знайдено історичних подій для цього періоду"
          }</p>
        </div>
      </div>
    `;
  }

  getUserBirthYear() {
    try {
      // Спробуємо отримати дані з localStorage
      const preferences = JSON.parse(
        localStorage.getItem("life-map-preferences") || "{}"
      );
      if (preferences.dob) {
        return new Date(preferences.dob).getFullYear();
      }

      // Або з URL-параметрів
      const urlParams = new URLSearchParams(window.location.search);
      const dob = urlParams.get("dob");
      if (dob) {
        return new Date(dob).getFullYear();
      }

      return null;
    } catch (e) {
      console.error("Помилка при отриманні року народження:", e);
      return null;
    }
  }
}
