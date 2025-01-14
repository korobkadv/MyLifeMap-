// services/export.service.js
import { CONFIG } from "../config.js";

export class ExportService {
  static async exportAsImage(element) {
    try {
      const canvas = await html2canvas(element);
      const image = canvas.toDataURL(
        CONFIG.EXPORT.IMAGE_TYPE,
        CONFIG.EXPORT.QUALITY
      );

      const link = document.createElement("a");
      link.download = `${CONFIG.EXPORT.FILENAME}-${Date.now()}.png`;
      link.href = image;
      link.click();

      return true;
    } catch (error) {
      console.error("Export Error:", error);
      throw new Error("Не вдалося експортувати зображення");
    }
  }
}
