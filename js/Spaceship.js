import { Missile } from "./Missile.js";

export class Spaceship {
  missiles = [];
  #modifier = 10;
  //powstałe żeby rozwiązać problem, w którym po wciśnięciu kontrolera statek wykonuje ruch o jeden modyfikator, a następnie dopiero po pauzie rusza dalej
  #leftArrow = false;
  #rightArrow = false;
  constructor(element, container) {
    //i odbieram w konstruktorze element HTML
    this.element = element;
    this.container = container;
  }

  //metoda inicjalizująca działanie
  init() {
    this.setPosition();
    this.#eventListeners();
    this.#gameLoop();
  }

  //metoda ustawiająca statek w odpowiedniej pozycji
  setPosition() {
    this.element.style.bottom = "0px";
    this.element.style.left = `${
      window.innerWidth / 2 - this.#getPosition()
    }px`;
  }

  #getPosition() {
    return this.element.offsetLeft + this.element.offsetWidth / 2;
  }
  //ruch statkiem, w którym jedyne co to wywołuję logikę ruchu zawartą w #lrarrow
  #eventListeners() {
    window.addEventListener("keydown", ({ code }) => {
      switch (code) {
        case "ArrowLeft":
          this.#leftArrow = true;
          break;
        case "ArrowRight":
          this.#rightArrow = true;
          break;
      }
    });
    //zatrzymuję ruch po podniesieniu
    window.addEventListener("keyup", ({ code }) => {
      switch (code) {
        //strzał jest w keyUp, dzięki czemu nie można zblokować przeglądarki poprzez przytrzymanie spacji (co wywołałoby wystrzelenie dużej ilości pocisków)
        case "Space":
          this.#shot();
          break;
        case "ArrowLeft":
          this.#leftArrow = false;
          break;
        case "ArrowRight":
          this.#rightArrow = false;
          break;
      }
    });
  }
  //animacja gry jest ciągle odświeżana, przez co ruch jest w pełni płynny
  #gameLoop = () => {
    this.#whatKey();
    requestAnimationFrame(this.#gameLoop);
  };
  //sprawdzanie który kontroler wcisnięty
  #whatKey() {
    //wartość 12 jest stąd, że jeśli ustawie sobie 0, to wtedy okno gry będzie mogło mi się rozjechać (pojawią się bary do przewijania), wynika to z szerokości ostylowanego elementu pocisku, który ma 12px
    if (this.#leftArrow && this.#getPosition() > 12) {
      this.element.style.left = `${
        parseInt(this.element.style.left, 10) - this.#modifier
      }px`;
    }

    if (this.#rightArrow && this.#getPosition() + 12 < window.innerWidth) {
      this.element.style.left = `${
        parseInt(this.element.style.left, 10) + this.#modifier
      }px`;
    }
  }
  //metoda strzału
  #shot() {
    const missile = new Missile(
      this.#getPosition(),
      this.element.offsetTop,
      this.container
    );
    missile.init();
    this.missiles.push(missile);
  }
}
