// views/visualization.view.js
import { CONFIG } from "../config.js";

export class VisualizationView {
  constructor(container) {
    this.container = container;
    this.blocks = [];
  }

  render(data) {
    // console.log("[VisualizationView] Rendering with data:", data); // Видалено лог
    const {
      totalUnits,
      unitsLived,
      activityDistribution,
      displayMode,
      userAge,
    } = data;

    // Очищаємо контейнер перед відображенням
    this.container.innerHTML = "";

    // Додаємо заголовок із режимом відображення
    const title = document.createElement("h2");
    title.className = "visualization-title";
    const unitName = this.getUnitNameByMode(displayMode);
    title.textContent = `Візуалізація вашого життя (${unitName})`;
    this.container.appendChild(title);

    // Створюємо контейнер для блоків
    const gridContainer = document.createElement("div");
    gridContainer.className = "life-grid";
    this.container.appendChild(gridContainer);

    // --- Використовуємо requestAnimationFrame для розрахунку після рендерингу ---
    requestAnimationFrame(() => {
      // Отримуємо актуальний розмір блоку з CSS
      let blockWidthPx = 10; // Значення за замовчуванням
      const tempBlock = document.createElement("div");
      tempBlock.className = "life-block";
      tempBlock.style.visibility = "hidden";
      tempBlock.style.position = "absolute";
      document.body.appendChild(tempBlock);
      try {
        const computedStyle = window.getComputedStyle(tempBlock);
        blockWidthPx = parseFloat(computedStyle.width) || blockWidthPx;
      } catch (e) {
        console.error("Не вдалося отримати розмір блоку з CSS:", e);
      }
      document.body.removeChild(tempBlock);

      // Отримуємо актуальний проміжок (gap) з CSS
      let gapPx = 2; // Значення за замовчуванням
      try {
        const gridComputedStyle = window.getComputedStyle(gridContainer);
        gapPx = parseFloat(gridComputedStyle.columnGap) || gapPx;
      } catch (e) {
        console.error("Не вдалося отримати проміжок сітки з CSS:", e);
      }

      // Розрахунок кількості стовпців по ширині контейнера
      let columnsThatFit = 60; // Значення за замовчуванням
      try {
        // Переконуємося, що this.container видимий перед розрахунком
        if (this.container.clientWidth > 0) {
          const availableWidth =
            this.container.clientWidth -
            (parseFloat(window.getComputedStyle(this.container).paddingLeft) ||
              0) -
            (parseFloat(window.getComputedStyle(this.container).paddingRight) ||
              0);
          columnsThatFit = Math.max(
            1,
            Math.floor((availableWidth + gapPx) / (blockWidthPx + gapPx))
          );
          const maxPossibleCols = Math.ceil(Math.sqrt(totalUnits)) * 2;
          columnsThatFit = Math.min(columnsThatFit, maxPossibleCols);
        } else {
          console.warn(
            "Контейнер #visualization ще не видимий для розрахунку ширини."
          );
          // Можна залишити columnsThatFit = 60 або спробувати інше значення за замовчуванням
        }
      } catch (e) {
        console.error("Не вдалося розрахувати кількість стовпців:", e);
      }

      // Встановлюємо grid-template-columns з реальним розміром блоку та розрахованою кількістю стовпців
      // Перевіряємо, чи gridContainer ще існує (на випадок швидких повторних рендерів)
      if (gridContainer && gridContainer.parentNode) {
        gridContainer.style.gridTemplateColumns = `repeat(${columnsThatFit}, ${blockWidthPx}px)`;
      }
    });
    // --- Кінець блоку requestAnimationFrame ---

    // Розподіл кольорів відповідно до активностей
    const activityColors = {
      sleep: "var(--sleep-color)",
      work: "var(--work-color)",
      sport: "var(--sport-color)",
      social: "var(--social-color)",
      food: "var(--food-color)",
      screenTime: "var(--screen-color)",
      reading: "var(--reading-color)",
      gaming: "var(--gaming-color)",
      transport: "var(--transport-color)",
      leisure: "var(--leisure-color)",
    };

    // Створюємо блоки життя
    for (let i = 0; i < totalUnits; i++) {
      const lifeBlock = document.createElement("div");
      lifeBlock.className = "life-block";

      // Маркуємо прожиті блоки
      if (i < unitsLived) {
        lifeBlock.classList.add("lived");

        // Визначаємо тип активності для блоку
        const activityType = this.getActivityTypeForBlock(
          i,
          unitsLived,
          activityDistribution
        );
        if (activityType) {
          lifeBlock.classList.add(activityType);
          lifeBlock.dataset.activity = activityType;
        }
      }

      gridContainer.appendChild(lifeBlock);
    }

    // Додаємо легенду активностей
    this.renderActivityLegend(activityColors);
  }

  // Метод для визначення типу активності для блоку
  getActivityTypeForBlock(blockIndex, totalLivedBlocks, activityDistribution) {
    // Конвертуємо години активності у відсотки від загального часу
    const activityPercentages = {};
    let totalHours = 0;

    // Рахуємо загальну кількість годин на добу
    for (const activity in activityDistribution) {
      totalHours += activityDistribution[activity];
    }

    // Розраховуємо відсотки для кожної активності
    for (const activity in activityDistribution) {
      activityPercentages[activity] =
        activityDistribution[activity] / totalHours;
    }

    // Визначаємо до якого діапазону відноситься поточний блок (у відсотках від прожитих блоків)
    const blockPercentage = blockIndex / totalLivedBlocks;

    // Розподіляємо блоки за активностями відповідно до їх відсотків
    let accumulatedPercentage = 0;
    for (const activity in activityPercentages) {
      accumulatedPercentage += activityPercentages[activity];
      if (blockPercentage <= accumulatedPercentage) {
        return activity;
      }
    }

    // За замовчуванням повертаємо "leisure"
    return "leisure";
  }

  // Метод для відображення легенди активностей
  renderActivityLegend(activityColors) {
    const legend = document.createElement("div");
    legend.className = "activity-legend";

    const activities = {
      sleep: "Сон",
      work: "Робота",
      sport: "Спорт",
      social: "Соціалізація",
      food: "Харчування",
      screenTime: "Екранний час",
      reading: "Читання",
      gaming: "Ігри",
      transport: "Транспорт",
      leisure: "Дозвілля",
    };

    for (const [activity, label] of Object.entries(activities)) {
      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";

      const colorBox = document.createElement("span");
      colorBox.className = "legend-color";
      colorBox.style.backgroundColor = activityColors[activity];

      const legendText = document.createElement("span");
      legendText.className = "legend-text";
      legendText.textContent = label;

      legendItem.appendChild(colorBox);
      legendItem.appendChild(legendText);
      legend.appendChild(legendItem);
    }

    this.container.appendChild(legend);
  }

  // Визначення назви одиниці часу в залежності від режиму відображення
  getUnitNameByMode(mode) {
    switch (mode) {
      case "weeks":
        return "тижні";
      case "months":
        return "місяці";
      case "years":
        return "роки";
      default:
        return "роки";
    }
  }

  // Простий скид стану
  reset() {
    this.container.innerHTML = "";
    this.blocks = [];

    // Видаляємо також легенду, якщо вона є
    const legend = document.querySelector(".activity-legend");
    if (legend) {
      legend.remove();
    }
  }
}
