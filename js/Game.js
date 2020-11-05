import { Spaceship } from "./Spaceship.js";
import { Enemy } from "./Enemy.js";

class Game {
  #htmlElements = {
    spaceship: document.querySelector("[data-spaceship]"),
    container: document.querySelector("[data-container]"),
    score: document.querySelector("[data-score]"),
    lives: document.querySelector("[data-lives]"),
    modal: document.querySelector("[data-modal]"),
    scoreInfo: document.querySelector("[data-score-info]"),
    button: document.querySelector("[data-button]"),
  };
  //przekazuje element html
  #ship = new Spaceship(
    this.#htmlElements.spaceship,
    this.#htmlElements.container
  );
  //tablica przechowująca wszystkich wrogów
  #enemies = [];
  #lives = null;
  #score = null;
  //interwał poruszania się wrogów
  #enemiesInterval = null;
  //interwał dla sprawdzania pozycji pocisków
  #checkPositionInterval = null;
  //interwał spawnu przeciwników
  #createEnemyInterval = null;

  init() {
    this.#ship.init();
    this.#newGame();
    this.#htmlElements.button.addEventListener("click", () => this.#newGame());
  }

  #newGame() {
    //usunięcie wyświetlania modala przy użyciu buttona
    this.#htmlElements.modal.classList.add("hide");
    //prędkość wrogów
    this.#enemiesInterval = 30;
    this.#lives = 3;
    this.#score = 0;
    //przy starcie od nowa (przy pomocy new game z modala) należy nadpisać wartości
    this.#updateLivesText();
    this.#updateScoreText();
    this.#ship.element.style.left = "0px";
    this.#ship.setPosition();
    //tworzenie wrogów w interwale
    this.#createEnemyInterval = setInterval(
      () => this.#randomNewEnemy(),
      10000
    );
    //uruchomienie interwału dla sprawdzania pozycji pocisków w obrębie nowej gry
    this.#checkPositionInterval = setInterval(() => this.#checkPosition(), 1);
  }

  #endGame() {
    this.#htmlElements.modal.classList.remove("hide");
    this.#htmlElements.scoreInfo.textContent = `You loose! Your score is: ${
      this.#score
    }`;
    this.#enemies.forEach((enemy) => enemy.explode());
    this.#enemies.length = 0;
    clearInterval(this.#createEnemyInterval);
    clearInterval(this.#checkPositionInterval);
  }
  //randomowy wybór klasy tworzonego enemy
  #randomNewEnemy() {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    randomNumber % 5
      ? this.#createNewEnemy(
          this.#htmlElements.container,
          this.#enemiesInterval,
          "enemy",
          "explosion"
        )
      : this.#createNewEnemy(
          this.#htmlElements.container,
          this.#enemiesInterval * 2,
          "enemy--big",
          "explosion--big",
          3
        );
  }
  //tworzenie nowych wrogów
  #createNewEnemy(...params) {
    const enemy = new Enemy(...params);
    enemy.init();
    this.#enemies.push(enemy);
  }

  //sprawdzanie pozycji
  #checkPosition() {
    //wroga
    this.#enemies.forEach((enemy, enemyIndex, enemyArray) => {
      //ustalenie pozycji wroga
      const enemyPosition = {
        top: enemy.element.offsetTop,
        bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
        right: enemy.element.offsetLeft + enemy.element.offsetWidth,
        left: enemy.element.offsetLeft,
      };
      //usunięcie wroga który wylatuje z planszy gry
      if (enemyPosition.top > window.innerHeight) {
        //usunięcie elementu z html
        enemy.explode();
        //usuwanie wroga z tablicy wrogów
        enemyArray.splice(enemyIndex, 1);
        //dekrementacja liczby żyć w momencie, gdy wróg przekroczy dół planszy
        this.#updateLives();
      }
      //pocisku
      this.#ship.missiles.forEach((missile, missileIndex, missileArray) => {
        //ustalenie pozycji wystrzelonego pocisku
        const misslePosition = {
          top: missile.element.offsetTop,
          bottom: missile.element.offsetTop + missile.element.offsetHeight,
          right: missile.element.offsetLeft + missile.element.offsetWidth,
          left: missile.element.offsetLeft,
        };
        //sprawdzenie kolizji pocisku z wrogiem, na podstawie ich pozycji
        if (
          misslePosition.bottom >= enemyPosition.top &&
          misslePosition.top <= enemyPosition.bottom &&
          misslePosition.right >= enemyPosition.left &&
          misslePosition.left <= enemyPosition.right
        ) {
          //wywołanie enemy hit w momencie trafienia
          enemy.hit();
          //usunięcie enemy z arr kiedy kończą się życia
          if (!enemy.lives) {
            enemyArray.splice(enemyIndex, 1);
          }
          //usunięcie pocisku przy każdym trafieniu
          missile.remove();
          missileArray.splice(missileIndex, 1);
          //dodanie punków za trafienie
          this.#updateScore();
        }
        if (misslePosition.bottom < 0) {
          //usunięcie pocisku który wylatuje z planszy gry
          //usunięcie elementu z html
          missile.remove();
          //usuwanie pocisku z tablicy śledzonych pocisków
          missileArray.splice(missileIndex, 1);
        }
      });
    });
  }

  #updateScore() {
    this.#score++;
    //zwiększanie prędkości wrogów co 5 zdobytych punktów
    if (!(this.#score % 5)) {
      this.#enemiesInterval--;
    }
    //update wyświetlanej wartości scores
    this.#updateScoreText();
  }

  #updateLives() {
    //dekrementuje żyćko
    this.#lives--;
    //update wyświetlanej wartości żyć
    this.#updateLivesText();
    //dodanie migawki przy utracie życia
    this.#htmlElements.container.classList.add("hit");
    //która znika po 100ms
    setTimeout(() => this.#htmlElements.container.classList.remove("hit"), 100);
    //zakończenie gry przy 0 liczbie żyć
    if (!this.#lives) {
      this.#endGame();
    }
  }

  #updateScoreText() {
    this.#htmlElements.score.textContent = `Score: ${this.#score}`;
  }

  #updateLivesText() {
    this.#htmlElements.lives.textContent = `Lives: ${this.#lives}`;
  }
}
//po otwarciu okna załadowana zostanie nowa gra
window.onload = function () {
  const game = new Game();
  game.init();
};
