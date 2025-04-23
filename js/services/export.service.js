// services/export.service.js
import { CONFIG } from "../config.js";

export class ExportService {
  static async exportAsImage(element) {
    try {
      // Створюємо окремий контейнер для експорту
      const exportContainer = document.createElement("div");
      exportContainer.style.position = "fixed";
      exportContainer.style.top = "0";
      exportContainer.style.left = "0";
      exportContainer.style.right = "0";
      exportContainer.style.bottom = "0";
      exportContainer.style.zIndex = "-9999"; // За межами видимості
      exportContainer.style.backgroundColor = getComputedStyle(
        document.body
      ).backgroundColor;
      exportContainer.style.overflow = "hidden";
      exportContainer.style.padding = "20px";

      // Клонуємо вміст для експорту
      const clonedContent = element.cloneNode(true);

      // Приховуємо кнопки, форми та інші непотрібні елементи
      const controlsToHide = clonedContent.querySelectorAll(".controls");
      controlsToHide.forEach((control) => (control.style.display = "none"));

      // Переконуємось що всі елементи видимі
      clonedContent.style.display = "block";
      clonedContent.style.opacity = "1";
      clonedContent.style.visibility = "visible";
      clonedContent.style.transform = "none";
      clonedContent.style.width = "100%";
      clonedContent.style.height = "auto";

      // Всі дочірні елементи теж робимо видимими
      const allElements = clonedContent.querySelectorAll("*");
      allElements.forEach((el) => {
        el.style.opacity = "1";
        el.style.visibility = "visible";
      });

      // Секції робимо видимими
      const sections = clonedContent.querySelectorAll(
        ".historical-events-section, .visualization-section"
      );
      sections.forEach((section) => {
        section.style.display = "block";
        section.style.opacity = "1";
        section.style.visibility = "visible";
      });

      // Додаємо водяний знак
      const watermark = document.createElement("div");
      watermark.style.padding = "15px";
      watermark.style.backgroundColor = "#f1f1f1";
      watermark.style.color = "#555";
      watermark.style.textAlign = "center";
      watermark.style.fontSize = "14px";
      watermark.style.borderRadius = "5px";
      watermark.style.margin = "20px 0";
      watermark.innerText = `mylifemap.app · Візуалізація життя у квадратах · ${window.location.href}`;

      clonedContent.appendChild(watermark);

      // Додаємо контейнер до DOM
      exportContainer.appendChild(clonedContent);
      document.body.appendChild(exportContainer);

      // Даємо час для рендерингу
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Створюємо зображення
      const canvas = await html2canvas(clonedContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        logging: false,
      });

      // Прибираємо контейнер
      document.body.removeChild(exportContainer);

      // Отримуємо URL зображення
      const image = canvas.toDataURL(
        CONFIG.EXPORT.IMAGE_TYPE,
        CONFIG.EXPORT.QUALITY
      );

      // Створюємо посилання для скачування
      const link = document.createElement("a");
      link.download = `${CONFIG.EXPORT.FILENAME}-${Date.now()}.png`;
      link.href = image;
      link.click();

      return true;
    } catch (error) {
      console.error("Export Error:", error);
      throw new Error(`Не вдалося експортувати зображення: ${error.message}`);
    }
  }
}
