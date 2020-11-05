export class Enemy {
  constructor(container, intervalTime, enemyClass, explosionClass, lives = 1) {
    this.container = container;
    this.element = document.createElement("div");
    this.intervalTime = intervalTime;
    //klasa - zwykły/big
    this.enemyClass = enemyClass;
    this.explosionClass = explosionClass;
    this.interval = null;
    this.lives = lives;
  }

  init() {
    this.#setEnemy();
    this.#updatePosition();
  }
  //tworzenie nowego przeciwnika
  #setEnemy() {
    //element z konstruktora dostaje klasę
    this.element.classList.add(this.enemyClass);
    //jest dodany do pola gry
    this.container.appendChild(this.element);
    //top jest oczywiście na 0 bo startują z góry planszy
    this.element.style.top = "0px";
    //pozycja x jest ustawiana losowo, więc pojawią się na całej szerokości pola gry
    this.element.style.left = `${this.#randomPosition()}px`;
  }

  #randomPosition() {
    return Math.floor(
      //- offset tak, zeby nie pojawiały się poza polem gry/na skraju wystając poza pole
      Math.random() * (window.innerWidth - this.element.offsetWidth)
    );
  }
  //update pozycji wroga na planszy
  #updatePosition() {
    this.interval = setInterval(
      () => this.#setNewPosition(),
      this.intervalTime
    );
  }

  #setNewPosition() {
    this.element.style.top = `${this.element.offsetTop + 1}px`;
  }
  //metoda pojedynczego trafienia
  hit() {
    this.lives--;
    if (!this.lives) {
      this.explode();
    }
  }
  //metoda wybuchu wroga w momencie gdy ten straci wszystkie życia
  explode() {
    //zamiana klas z wroga na wybuch
    this.element.classList.remove(this.enemyClass);
    this.element.classList.add(this.explosionClass);
    //usuwanie odświeżania pozycji wroga
    clearInterval(this.interval);
    //wartość stała animacji wybuchu
    const animationTime = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--explosions-animation-time"
      ),
      10
    );
    //opóźnienie usunięcia elementu, które pozwala na pełne wyświetlenie animacji wybuchu
    setTimeout(() => this.element.remove(), animationTime);
  }
}
