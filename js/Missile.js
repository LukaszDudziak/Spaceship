export class Missile {
  constructor(x, y, container) {
    this.x = x;
    this.y = y;
    this.container = container;
    this.element = document.createElement("div");
    this.interval = null;
  }

  init() {
    //nadanie odpowiedniej klasy
    this.element.classList.add("missile");
    //dodanie elementu do pola gry
    this.container.appendChild(this.element);
    //ustalenie pozycji względem statku
    this.element.style.left = `${this.x - this.element.offsetWidth / 2}px`;
    this.element.style.top = `${this.y - this.element.offsetHeight}px`;
    //ustawienie interwału dla pełnego przelotu pocisku do szczytu planszy
    this.interval = setInterval(
      () => (this.element.style.top = `${this.element.offsetTop - 1}px`),
      5
    );
  }

  remove() {
    //usunięcie interwału lecącego pocisku
    clearInterval(this.interval);
    this.element.remove();
  }
}
