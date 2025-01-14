// views/visualization.view.js
import { CONFIG } from "../config.js";

export class VisualizationView {
  constructor(container) {
    this.container = container;
  }

  render(totalUnits, unitsLived, mode) {
    this.clear();
    this.createUnits(totalUnits, unitsLived, mode);
    this.adjustToViewport(); // Додаємо виклик методу після створення units
  }

  clear() {
    this.container.innerHTML = "";
  }

  createUnits(totalUnits, unitsLived, mode) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < totalUnits; i++) {
      const unit = document.createElement("div");
      unit.className = "visualization__unit";

      if (i < unitsLived) {
        unit.classList.add("visualization__unit--lived");
      }

      const tooltip = this.createTooltip(i, mode);
      unit.setAttribute("data-tooltip", tooltip);

      // Додаємо базові стилі для unit
      unit.style.width = "10px";
      unit.style.height = "10px";
      unit.style.margin = "1px";
      unit.style.backgroundColor = i < unitsLived ? "#17B978" : "#ffffff";
      unit.style.borderRadius = "2px";

      fragment.appendChild(unit);
    }

    this.container.appendChild(fragment);
  }

  adjustToViewport() {
    const containerWidth = this.container.clientWidth;
    const unitWidth = 12; // 10px для блоку + 2px для gap
    const columns = Math.floor(containerWidth / unitWidth);

    // Встановлюємо CSS Grid з автоматичним заповненням колонок
    this.container.style.display = "grid";
    this.container.style.gridTemplateColumns = `repeat(auto-fill, minmax(10px, 10px))`;
    this.container.style.gap = "2px";
    this.container.style.justifyContent = "center";

    // Встановлюємо розмір для кожного блоку
    const units = this.container.querySelectorAll(".visualization__unit");
    units.forEach((unit) => {
      unit.style.width = "10px";
      unit.style.height = "10px";
    });
  }

  createTooltip(index, mode) {
    const number = index + 1;
    const tooltipText = CONFIG.TOOLTIPS[mode.toUpperCase()];
    return `${number}-й ${tooltipText}`;
  }
}
