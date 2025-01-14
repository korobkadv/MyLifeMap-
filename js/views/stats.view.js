// views/stats.view.js
import { CONFIG } from "../config.js";

export class StatsView {
  constructor(container) {
    this.container = container;
  }

  render(statistics) {
    this.container.innerHTML = this.createStatsHTML(statistics);
  }

  createStatsHTML(statistics) {
    return `
            <div class="stats-card">
                <h3 class="stats-card__title">Загальна статистика</h3>
                <div class="stats-card__content">
                    <p>Прожито: ${statistics.unitsLived} ${this.getUnitName(
      statistics.mode
    )}</p>
                    <p>Загалом: ${statistics.totalUnits} ${this.getUnitName(
      statistics.mode
    )}</p>
                    <p>Відсоток: ${statistics.percentage}%</p>
                    <p>Залишилось: ${statistics.remaining} ${this.getUnitName(
      statistics.mode
    )}</p>
                </div>
            </div>
        `;
  }

  getUnitName(mode) {
    const units = {
      [CONFIG.DISPLAY_MODES.WEEKS]: "тижнів",
      [CONFIG.DISPLAY_MODES.MONTHS]: "місяців",
      [CONFIG.DISPLAY_MODES.YEARS]: "років",
    };
    return units[mode] || "";
  }
}
