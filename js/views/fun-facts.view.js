export class FunFactsView {
  constructor(container, funFactsService) {
    this.container = container;
    this.funFactsService = funFactsService;
    this.userData = {
      age: 0,
      gender: "male",
      country: "UA",
    };
    this.personalData = null;
    this.currentFactIndex = 0;
  }

  // Встановити дані користувача
  setUserData(userData) {
    this.userData = {
      age: parseInt(userData.age) || 0,
      gender: userData.gender || "male",
      country: userData.country || "UA",
      sleepHours: parseFloat(userData.sleepHours) || 8,
      workHours: parseFloat(userData.workHours) || 8,
      sportHours: parseFloat(userData.sportHours) || 1,
      socialHours: parseFloat(userData.socialHours) || 2,
      foodHours: parseFloat(userData.foodHours) || 1.5,
      screenTimeHours: parseFloat(userData.screenTimeHours) || 4,
      readingHours: parseFloat(userData.readingHours) || 0.5,
      gamingHours: parseFloat(userData.gamingHours) || 1,
      transportHours: parseFloat(userData.transportHours) || 1,
      leisureHours: parseFloat(userData.leisureHours) || 7,
      tripsPerYear: parseInt(userData.tripsPerYear) || 2,
      transportType: userData.transportType || "auto",
      hideActivitySection: userData.hideActivitySection || false,
    };
  }

  // Відрендерити вид з персональною статистикою
  render(factsData) {
    // Отримуємо масив фактів від сервісу
    const factsArray = this.getFactsArray(factsData);

    // Створюємо HTML-контейнер для фактів
    const factsContainer = document.createElement("div");
    factsContainer.className = "fun-facts-section";

    // Додаємо заголовок
    const factsTitle = document.createElement("h2");
    factsTitle.className = "fun-facts-title";
    factsTitle.textContent = "Цікаві факти про ваше життя";
    factsContainer.appendChild(factsTitle);

    // Створюємо карусель для фактів
    const carousel = document.createElement("div");
    carousel.className = "facts-carousel";

    // Додаємо навігаційну кнопку "Назад"
    const prevButton = document.createElement("button");
    prevButton.className = "fact-nav prev-fact";
    prevButton.innerHTML = "&lsaquo;";
    prevButton.setAttribute("aria-label", "Попередній факт");
    carousel.appendChild(prevButton);

    // Створюємо контейнер для фактів
    const factsSlider = document.createElement("div");
    factsSlider.className = "facts-slider";

    // Додаємо кожен факт у карусель
    factsArray.forEach((fact, index) => {
      const factContainer = document.createElement("div");
      factContainer.className = "fact-container";
      factContainer.dataset.index = index;

      // Додаємо іконку залежно від категорії факту
      const factIcon = document.createElement("span");
      factIcon.className = "fact-icon";

      // Визначаємо іконку в залежності від типу факту
      if (fact.includes("сну") || fact.includes("спите")) {
        factIcon.textContent = "💤";
      } else if (
        fact.includes("їжу") ||
        fact.includes("їсте") ||
        fact.includes("споживаєте")
      ) {
        factIcon.textContent = "🍽️";
      } else if (
        fact.includes("спорту") ||
        fact.includes("займаєтесь спортом")
      ) {
        factIcon.textContent = "🏋️";
      } else if (fact.includes("роботі") || fact.includes("працюєте")) {
        factIcon.textContent = "💼";
      } else if (fact.includes("віку") || fact.includes("років")) {
        factIcon.textContent = "🎂";
      } else if (
        fact.includes("інтернеті") ||
        fact.includes("екраном") ||
        fact.includes("технології")
      ) {
        factIcon.textContent = "💻";
      } else if (fact.includes("читанні") || fact.includes("читаєте")) {
        factIcon.textContent = "📚";
      } else if (fact.includes("ігри") || fact.includes("граєте")) {
        factIcon.textContent = "🎮";
      } else if (
        fact.includes("подорожі") ||
        fact.includes("подорожуєте") ||
        fact.includes("транспорт")
      ) {
        factIcon.textContent = "✈️";
      } else if (fact.includes("спілкуванні") || fact.includes("спілкуєтесь")) {
        factIcon.textContent = "👥";
      } else {
        factIcon.textContent = "❓";
      }

      factContainer.appendChild(factIcon);

      // Додаємо текст факту
      const factText = document.createElement("p");
      factText.className = "fact-text";
      factText.textContent = fact;
      factContainer.appendChild(factText);

      factsSlider.appendChild(factContainer);
    });

    carousel.appendChild(factsSlider);

    // Додаємо навігаційну кнопку "Вперед"
    const nextButton = document.createElement("button");
    nextButton.className = "fact-nav next-fact";
    nextButton.innerHTML = "&rsaquo;";
    nextButton.setAttribute("aria-label", "Наступний факт");
    carousel.appendChild(nextButton);

    factsContainer.appendChild(carousel);

    // Додаємо пагінацію
    const pagination = document.createElement("div");
    pagination.className = "facts-pagination";

    factsArray.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.className = "fact-dot";
      dot.dataset.index = index;
      if (index === 0) {
        dot.classList.add("active");
      }
      pagination.appendChild(dot);
    });

    factsContainer.appendChild(pagination);

    // Очищаємо контейнер перед додаванням нового вмісту
    this.container.innerHTML = "";
    this.container.appendChild(factsContainer);

    // Встановлюємо поточний індекс на перший факт
    this.currentFactIndex = 0;

    // Показуємо перший факт
    this.showCurrentFact();

    // Додаємо обробники подій для навігації
    this.addEventListeners();
  }

  // Додати обробники подій
  addEventListeners() {
    // Викликаємо setupEventListeners для налаштування всіх обробників
    this.setupEventListeners();

    // Показуємо перший факт при початковому рендері
    this.showCurrentFact();
  }

  getFactsArray(factsData) {
    const factsArray = [];

    // Додаємо факти про час
    if (factsData.timeFacts && factsData.timeFacts.length) {
      factsData.timeFacts.forEach((fact) => {
        if (typeof fact === "object" && fact.text) {
          factsArray.push(fact.text);
        } else if (typeof fact === "string") {
          factsArray.push(fact);
        }
      });
    }

    // Додаємо факти про здоров'я
    if (factsData.healthFacts && factsData.healthFacts.length) {
      factsData.healthFacts.forEach((fact) => {
        if (typeof fact === "object" && fact.text) {
          factsArray.push(fact.text);
        } else if (typeof fact === "string") {
          factsArray.push(fact);
        }
      });
    }

    // Додаємо факти про культуру
    if (factsData.cultureFacts && factsData.cultureFacts.length) {
      factsData.cultureFacts.forEach((fact) => {
        if (typeof fact === "object" && fact.text) {
          factsArray.push(fact.text);
        } else if (typeof fact === "string") {
          factsArray.push(fact);
        }
      });
    }

    // Додаємо вікові факти
    if (factsData.ageFacts && factsData.ageFacts.length) {
      factsData.ageFacts.forEach((fact) => {
        if (typeof fact === "object" && fact.text) {
          factsArray.push(fact.text);
        } else if (typeof fact === "string") {
          factsArray.push(fact);
        }
      });
    }

    // Додаємо країнні факти
    if (factsData.countryFacts && factsData.countryFacts.length) {
      factsData.countryFacts.forEach((fact) => {
        if (typeof fact === "object" && fact.text) {
          factsArray.push(fact.text);
        } else if (typeof fact === "string") {
          factsArray.push(fact);
        }
      });
    }

    // Додаємо ґендерні факти
    if (factsData.genderFacts && factsData.genderFacts.length) {
      factsData.genderFacts.forEach((fact) => {
        if (typeof fact === "object" && fact.text) {
          factsArray.push(fact.text);
        } else if (typeof fact === "string") {
          factsArray.push(fact);
        }
      });
    }

    // Додаємо факти про соціальні мережі
    if (factsData.socialFacts && factsData.socialFacts.length) {
      factsData.socialFacts.forEach((fact) => {
        if (typeof fact === "object" && fact.text) {
          factsArray.push(fact.text);
        } else if (typeof fact === "string") {
          factsArray.push(fact);
        }
      });
    }

    // Додаємо факти про харчування
    if (factsData.foodFacts && factsData.foodFacts.length) {
      factsData.foodFacts.forEach((fact) => {
        if (typeof fact === "object" && fact.text) {
          factsArray.push(fact.text);
        } else if (typeof fact === "string") {
          factsArray.push(fact);
        }
      });
    }

    // Додаємо факти про цифрову активність
    if (factsData.digitalFacts && factsData.digitalFacts.length) {
      factsData.digitalFacts.forEach((fact) => {
        if (typeof fact === "object" && fact.text) {
          factsArray.push(fact.text);
        } else if (typeof fact === "string") {
          factsArray.push(fact);
        }
      });
    }

    // Додаємо факти про подорожі
    if (factsData.travelFacts && factsData.travelFacts.length) {
      factsData.travelFacts.forEach((fact) => {
        if (typeof fact === "object" && fact.text) {
          factsArray.push(fact.text);
        } else if (typeof fact === "string") {
          factsArray.push(fact);
        }
      });
    }

    // Додаємо факти про активності з activityFacts
    if (factsData.activityFacts) {
      // Додаємо факти про сон
      if (
        factsData.activityFacts.sleepFacts &&
        factsData.activityFacts.sleepFacts.length
      ) {
        factsData.activityFacts.sleepFacts.forEach((fact) => {
          if (typeof fact === "object" && fact.text) {
            factsArray.push(fact.text);
          } else if (typeof fact === "string") {
            factsArray.push(fact);
          }
        });
      }

      // Додаємо факти про роботу
      if (
        factsData.activityFacts.workFacts &&
        factsData.activityFacts.workFacts.length
      ) {
        factsData.activityFacts.workFacts.forEach((fact) => {
          if (typeof fact === "object" && fact.text) {
            factsArray.push(fact.text);
          } else if (typeof fact === "string") {
            factsArray.push(fact);
          }
        });
      }

      // Додаємо факти про спорт
      if (
        factsData.activityFacts.sportFacts &&
        factsData.activityFacts.sportFacts.length
      ) {
        factsData.activityFacts.sportFacts.forEach((fact) => {
          if (typeof fact === "object" && fact.text) {
            factsArray.push(fact.text);
          } else if (typeof fact === "string") {
            factsArray.push(fact);
          }
        });
      }

      // Додаємо факти про соціальну активність
      if (
        factsData.activityFacts.socialFacts &&
        factsData.activityFacts.socialFacts.length
      ) {
        factsData.activityFacts.socialFacts.forEach((fact) => {
          if (typeof fact === "object" && fact.text) {
            factsArray.push(fact.text);
          } else if (typeof fact === "string") {
            factsArray.push(fact);
          }
        });
      }

      // Додаємо факти про харчування
      if (
        factsData.activityFacts.foodFacts &&
        factsData.activityFacts.foodFacts.length
      ) {
        factsData.activityFacts.foodFacts.forEach((fact) => {
          if (typeof fact === "object" && fact.text) {
            factsArray.push(fact.text);
          } else if (typeof fact === "string") {
            factsArray.push(fact);
          }
        });
      }

      // Додаємо факти про екранний час
      if (
        factsData.activityFacts.screenTimeFacts &&
        factsData.activityFacts.screenTimeFacts.length
      ) {
        factsData.activityFacts.screenTimeFacts.forEach((fact) => {
          if (typeof fact === "object" && fact.text) {
            factsArray.push(fact.text);
          } else if (typeof fact === "string") {
            factsArray.push(fact);
          }
        });
      }

      // Додаємо факти про читання
      if (
        factsData.activityFacts.readingFacts &&
        factsData.activityFacts.readingFacts.length
      ) {
        factsData.activityFacts.readingFacts.forEach((fact) => {
          if (typeof fact === "object" && fact.text) {
            factsArray.push(fact.text);
          } else if (typeof fact === "string") {
            factsArray.push(fact);
          }
        });
      }

      // Додаємо факти про ігри
      if (
        factsData.activityFacts.gamingFacts &&
        factsData.activityFacts.gamingFacts.length
      ) {
        factsData.activityFacts.gamingFacts.forEach((fact) => {
          if (typeof fact === "object" && fact.text) {
            factsArray.push(fact.text);
          } else if (typeof fact === "string") {
            factsArray.push(fact);
          }
        });
      }

      // Додаємо факти про транспорт
      if (
        factsData.activityFacts.transportFacts &&
        factsData.activityFacts.transportFacts.length
      ) {
        factsData.activityFacts.transportFacts.forEach((fact) => {
          if (typeof fact === "object" && fact.text) {
            factsArray.push(fact.text);
          } else if (typeof fact === "string") {
            factsArray.push(fact);
          }
        });
      }

      // Додаємо факти про дозвілля
      if (
        factsData.activityFacts.leisureFacts &&
        factsData.activityFacts.leisureFacts.length
      ) {
        factsData.activityFacts.leisureFacts.forEach((fact) => {
          if (typeof fact === "object" && fact.text) {
            factsArray.push(fact.text);
          } else if (typeof fact === "string") {
            factsArray.push(fact);
          }
        });
      }
    }

    return factsArray;
  }

  // Налаштувати обробники подій
  setupEventListeners() {
    const prevButton = document.querySelector(".prev-fact");
    const nextButton = document.querySelector(".next-fact");
    const carousel = document.querySelector(".facts-carousel");

    if (prevButton) {
      prevButton.addEventListener("click", () => this.showPreviousFact());
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => this.showNextFact());
    }

    // Підтримка свайпінгу для мобільних пристроїв
    if (carousel) {
      this.setupSwipeSupport(carousel);
    }

    // Додати взаємодію для обробки кліків на точки пагінації
    const dots = document.querySelectorAll(".fact-dot");
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        this.currentFactIndex = index;
        this.updateActiveDot();
        this.showCurrentFact();
      });
    });
  }

  // Додаємо підтримку свайпів для мобільних пристроїв
  setupSwipeSupport(element) {
    let startX, moveX, diffX;
    let isDragging = false;

    // Поріг для визначення свайпу
    const SWIPE_THRESHOLD = 50;

    // Обробник початку дотику
    element.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      },
      { passive: true }
    );

    // Обробник руху пальця
    element.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;

        moveX = e.touches[0].clientX;
        diffX = moveX - startX;

        // Додаємо візуальний ефект під час свайпінгу
        element.classList.add("swiping");
      },
      { passive: true }
    );

    // Обробник завершення дотику
    element.addEventListener("touchend", (e) => {
      if (!isDragging) return;

      element.classList.remove("swiping");

      // Якщо свайп був достатньо довгим - змінюємо факт
      if (Math.abs(diffX) > SWIPE_THRESHOLD) {
        if (diffX > 0) {
          // Свайп вправо - попередній факт
          this.showPreviousFact();
        } else {
          // Свайп вліво - наступний факт
          this.showNextFact();
        }
      }

      isDragging = false;
    });

    // Обробник скасування дотику
    element.addEventListener("touchcancel", () => {
      element.classList.remove("swiping");
      isDragging = false;
    });

    // Також додаємо підтримку миші для десктопних браузерів
    element.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      isDragging = true;
    });

    element.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      moveX = e.clientX;
      diffX = moveX - startX;

      if (Math.abs(diffX) > 10) {
        element.classList.add("swiping");
      }
    });

    element.addEventListener("mouseup", () => {
      if (!isDragging) return;

      element.classList.remove("swiping");

      if (Math.abs(diffX) > SWIPE_THRESHOLD) {
        if (diffX > 0) {
          this.showPreviousFact();
        } else {
          this.showNextFact();
        }
      }

      isDragging = false;
    });

    element.addEventListener("mouseleave", () => {
      element.classList.remove("swiping");
      isDragging = false;
    });
  }

  // Показати попередній факт
  showPreviousFact() {
    this.currentFactIndex--;
    if (this.currentFactIndex < 0) {
      this.currentFactIndex = this.getFactsArray().length - 1;
    }

    const factContainer = document.getElementById("fact-container");
    if (factContainer) {
      // Додаємо клас для анімації
      factContainer.classList.remove("show-next-fact");
      factContainer.classList.add("show-prev-fact");

      // Оновлюємо факт
      this.updateCurrentFact();

      // Скидаємо класи анімації після завершення
      setTimeout(() => {
        factContainer.classList.remove("show-prev-fact");
      }, 400);
    }
  }

  // Показати наступний факт
  showNextFact() {
    this.currentFactIndex++;
    if (this.currentFactIndex >= this.getFactsArray().length) {
      this.currentFactIndex = 0;
    }

    const factContainer = document.getElementById("fact-container");
    if (factContainer) {
      // Додаємо клас для анімації
      factContainer.classList.remove("show-prev-fact");
      factContainer.classList.add("show-next-fact");

      // Оновлюємо факт
      this.updateCurrentFact();

      // Скидаємо класи анімації після завершення
      setTimeout(() => {
        factContainer.classList.remove("show-next-fact");
      }, 400);
    }
  }

  // Оновити поточний факт в HTML
  updateCurrentFact() {
    const factContainer = document.getElementById("fact-container");
    if (factContainer) {
      factContainer.innerHTML = this.renderCurrentFact();
    }
  }

  // Відрендерити поточний факт
  renderCurrentFact() {
    const facts = this.getFactsArray();

    if (facts.length === 0) {
      return "<p>Введіть ваші дані, щоб побачити персоналізовану статистику.</p>";
    }

    const fact = facts[this.currentFactIndex];
    return `
      <div class="fact-item">
        <div class="fact-icon">${fact.icon}</div>
        <div class="fact-content">
          <h5 class="fact-category">${fact.category}</h5>
          <p class="fact-text">${fact.text}</p>
        </div>
      </div>
      <div class="fact-pagination">
        ${facts
          .map(
            (_, index) =>
              `<span class="fact-dot ${
                index === this.currentFactIndex ? "active" : ""
              }"></span>`
          )
          .join("")}
      </div>
    `;
  }

  // Відрендерити графік активностей
  renderActivityChart() {
    if (!this.personalData || !this.personalData.activityData) {
      return "<p>Немає даних про активності</p>";
    }

    const { percentages } = this.personalData.activityData;

    // Створення даних для графіка
    const activityData = [
      {
        id: "sleep",
        name: "Сон",
        percentage: percentages.sleep,
        color: "#8C9EFF",
      },
      {
        id: "work",
        name: "Робота",
        percentage: percentages.work,
        color: "#FFB74D",
      },
      {
        id: "sport",
        name: "Спорт",
        percentage: percentages.sport,
        color: "#81C784",
      },
      {
        id: "social",
        name: "Соцмережі",
        percentage: percentages.social,
        color: "#B39DDB",
      },
      {
        id: "food",
        name: "Харчування",
        percentage: percentages.food,
        color: "#A5D6A7",
      },
      {
        id: "leisure",
        name: "Дозвілля",
        percentage: percentages.leisure,
        color: "#FF8A80",
      },
    ];

    return `
      <div class="activity-bars">
        ${activityData
          .map(
            (activity, index) => `
          <div class="activity-bar-wrapper" 
               title="${activity.name} - ${activity.percentage}% життя"
               data-index="${index}">
            <div class="activity-bar" 
                 style="height: 0; background-color: ${activity.color};" 
                 data-id="${activity.id}" 
                 data-target-height="${activity.percentage * 3}px">
            </div>
            <div class="activity-label">${activity.percentage}%</div>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="activity-legend">
        ${activityData
          .map(
            (activity) => `
          <div class="legend-item" data-activity="${activity.id}">
            <div class="legend-color ${activity.id}"></div>
            <span class="legend-text">${activity.name}</span>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  // Відрендерити факти про активності
  renderActivityFacts() {
    if (!this.personalData || !this.personalData.activityData) {
      return "<p>Введіть ваш вік, щоб побачити персоналізовану статистику.</p>";
    }

    const { facts } = this.personalData.activityData;
    const activityFacts = [];

    if (facts.sleep) activityFacts.push(facts.sleep);
    if (facts.work) activityFacts.push(facts.work);
    if (facts.sport) activityFacts.push(facts.sport);
    if (facts.leisure) activityFacts.push(facts.leisure);

    return `
      <div class="personalized-facts">
        <h5>Цікаві факти про активності:</h5>
        <ul>
          ${activityFacts.map((fact) => `<li>${fact.text}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  // Анімувати графік активностей
  animateActivityBars() {
    const bars = document.querySelectorAll(".activity-bar");

    bars.forEach((bar, index) => {
      const targetHeight = bar.getAttribute("data-target-height");

      // Затримка для послідовної анімації
      setTimeout(() => {
        bar.style.height = targetHeight;
      }, index * 150);
    });
  }

  // Додати інтерактивність до легенди
  setupActivityLegendInteraction() {
    const legendItems = document.querySelectorAll(".legend-item");
    const activityBars = document.querySelectorAll(".activity-bar-wrapper");

    legendItems.forEach((item) => {
      const activityType = item.getAttribute("data-activity");

      item.addEventListener("mouseenter", () => {
        // Підсвічуємо відповідний стовпець графіка
        activityBars.forEach((bar) => {
          const barId = bar
            .querySelector(".activity-bar")
            .getAttribute("data-id");

          if (barId === activityType) {
            bar.style.transform = "translateY(-5px)";
            bar.querySelector(".activity-bar").style.filter = "brightness(1.2)";
          } else {
            bar.style.opacity = "0.5";
          }
        });
      });

      item.addEventListener("mouseleave", () => {
        // Відновлюємо початковий стиль
        activityBars.forEach((bar) => {
          bar.style.transform = "none";
          bar.style.opacity = "1";
          bar.querySelector(".activity-bar").style.filter = "none";
        });
      });
    });
  }

  getFactsArray() {
    const facts = [];
    // Додаємо основні факти
    if (this.personalData) {
      if (this.personalData.timeFacts) {
        facts.push(...this.personalData.timeFacts);
      }
      if (this.personalData.healthFacts) {
        facts.push(...this.personalData.healthFacts);
      }
      if (this.personalData.cultureFacts) {
        facts.push(...this.personalData.cultureFacts);
      }
      if (this.personalData.activityFacts) {
        facts.push(...this.personalData.activityFacts);
      }
      if (this.personalData.socialFacts) {
        facts.push(...this.personalData.socialFacts);
      }
      if (this.personalData.foodFacts) {
        facts.push(...this.personalData.foodFacts);
      }
      // Додаємо нові факти про цифрову активність
      if (this.personalData.digitalFacts) {
        facts.push(...this.personalData.digitalFacts);
      }
      // Додаємо нові факти про подорожі
      if (this.personalData.travelFacts) {
        facts.push(...this.personalData.travelFacts);
      }
      if (this.personalData.ageFacts) {
        facts.push(...this.personalData.ageFacts);
      }
      if (this.personalData.countryFacts) {
        facts.push(...this.personalData.countryFacts);
      }
      if (this.personalData.genderFacts) {
        facts.push(...this.personalData.genderFacts);
      }
    }
    return facts;
  }

  // Оновити активну точку у пагінації
  updateActiveDot() {
    const dots = document.querySelectorAll(".fact-dot");
    dots.forEach((dot, index) => {
      if (index === this.currentFactIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  // Показати поточний факт
  showCurrentFact() {
    const containers = document.querySelectorAll(".fact-container");
    containers.forEach((container, index) => {
      if (index === this.currentFactIndex) {
        container.style.display = "flex";
        container.classList.add("active");
      } else {
        container.style.display = "none";
        container.classList.remove("active");
      }
    });
  }
}
