// views/modal.view.js
export class ModalView {
  constructor() {
    this.modal = document.getElementById("modal");
    this.setupEventListeners();
  }

  show(content) {
    this.modal.querySelector(".modal__body").innerHTML = content;
    this.modal.classList.add("modal--visible");
  }

  hide() {
    this.modal.classList.remove("modal--visible");
  }

  setupEventListeners() {
    this.modal.querySelector(".modal__close").addEventListener("click", () => {
      this.hide();
    });

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.modal.classList.contains("modal--visible")
      ) {
        this.hide();
      }
    });
  }
}
