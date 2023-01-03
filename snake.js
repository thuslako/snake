"use strict";
export class Snake {
  constructor() {
    this.speed = 500;
    this.boxes = new Map();
    this.boxSize = 20;
    this.rows = 25;
    this.cols = 25;
    this.ng = null;
    this.moves = {
      LEFT: (head) => [head[0], head[1] - 1],
      RIGHT: (head) => [head[0], head[1] + 1],
      UP: (head) => [head[0] - 1, head[1]],
      DOWN: (head) => [head[0] + 1, head[1]],
    };
    this.emptyBoxes = [];
    this.snake = [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ];
    this.food = null;
    this.moveQueue = [];
    this.lastMove = "RIGHT";
    this.board = null;
    this.notification = null;
    this.isDead = false;
  }

  init() {
    this.board = document.getElementById("board");
    this.notification = document.getElementById("notification");
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let box = document.createElement("div");
        box.style.position = "absolute";
        box.style.width = `${this.boxSize}px`;
        box.style.height = `${this.boxSize}px`;
        box.style.border = "1px solid rgba(235, 255, 114,0.4)";
        box.style.borderRadius = "2px";
        box.style.background = "#222f3e";
        box.style.top = `${i * this.boxSize}px`;
        box.style.left = `${j * this.boxSize}px`;
        this.board.appendChild(box);
        const position = `${i}_${j}`;
        this.boxes.set(position, box);
        this.emptyBoxes.push(position);
      }
    }
    this.addSnake();
    this.addFood(true);
    this.ng = setInterval(() => this.update(), this.speed);
    window.addEventListener("keydown", (e) => this.controls(e));
  }

  qa() {
    // TODO function to ensure game logic and functionality
    // - check that snake position isn't in empty boxes
    // - ensure food does spawn on snake body
    // - on fail stop and restart
  }

  controls(e) {
    e.preventDefault();
    const keys = {
      LEFT: 37,
      RIGHT: 39,
      UP: 38,
      DOWN: 40,
      A: 65,
      D: 68,
      W: 87,
      S: 83,
      ENTER: 13,
    };

    switch (e.keyCode) {
      case keys.LEFT:
      case keys.A:
        if (this.lastMove !== "RIGHT") this.moveQueue.push("LEFT");
        break;
      case keys.RIGHT:
      case keys.D:
        if (this.lastMove !== "LEFT") this.moveQueue.push("RIGHT");
        break;
      case keys.UP:
      case keys.W:
        if (this.lastMove !== "DOWN") this.moveQueue.push("UP");
        break;
      case keys.DOWN:
      case keys.S:
        if (this.lastMove !== "UP") this.moveQueue.push("DOWN");
        break;
      case keys.ENTER:
        if (this.isDead) this.start();
        break;
      default:
        this.moveQueue.push(this.lastMove);
        break;
    }
  }
  snakeSections(snake) {
    return snake.map(([i, j]) => `${i}_${j}`);
  }

  addSnake() {
    let _snake = this.snakeSections(this.snake);
    this.emptyBoxes = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let position = `${i}_${j}`;
        let box = this.boxes.get(position);
        if (_snake.indexOf(position) >= 0) {
          box.style.background = "#A3CB38";
        } else {
          box.style.background = "#222f3e";
          this.emptyBoxes.push(position);
        }
      }
    }
  }
  addFood(status = false) {
    if (!status) return;
    const position = Math.floor(Math.random() * this.emptyBoxes.length);
    this.food = this.emptyBoxes[position];
    if (this.emptyBoxes.length) {
      let box = this.boxes.get(this.food);
      box.style.background =
        this.snakeSections(this.snake).indexOf(this.food) < 0
          ? "tomato"
          : "#222f3e";
    }
  }

  isEaten() {
    let _snake = this.snakeSections(this.snake);
    return _snake.indexOf(this.food) >= 0 ? true : false;
  }

  grow() {
    // TODO
    // - add new block to the tail once called
  }

  update() {
    this.move();
    this.addSnake();
    this.addFood();
  }

  move() {
    if (this.isDead) return;

    let head = this.snake[this.snake.length - 1];

    const currentMove = this.moveQueue.shift();
    if (currentMove) this.lastMove = currentMove;

    const _move = this.moves[this.lastMove];
    const _head = _move(head);

    if (this.snakeBounds(_head)) this.stop();
    if (this.isEaten()) {
      this.addFood(true);
      // TODO add to tail
    } else {
      this.snake.shift();
      this.addFood();
    }
    this.snake.push(_head);
  }

  snakeBounds(head) {
    const [i, j] = head;
    if (i < 0 || j < 0) return true;
    if (i >= this.rows || j >= this.cols) return true;
    if (this.snakeSections(this.snake).indexOf(`${i}_${j}`) >= 0) return true;
    return false;
  }
  start() {
    this.notification.classList.add("hidden");
    this.snake = [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ];
    this.addSnake();
    this.addFood();
    this.ng = setInterval(() => this.update(), this.speed);
    this.isDead = false;
  }
  stop() {
    this.notification.classList.remove("hidden");
    this.isDead = true;
    this.moveQueue = [];
    this.lastMove = "RIGHT";
    clearInterval(this.ng);
  }
}
