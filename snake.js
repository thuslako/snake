"use strict";
export default class Snake {
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
        this.boxes.set(`${i}_${j}`, box);
      }
    }
    this.addSnake();
    this.addFood(true);
    this.ng = setInterval(() => this.update(), this.speed);
    window.addEventListener("keydown", (e) => this.controls(e));
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
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let position = `${i}_${j}`;
        let box = this.boxes.get(position);
        box.style.background =
          _snake.indexOf(position) >= 0 ? "#A3CB38" : "#222f3e";
      }
    }
  }
  addFood(status = false) {
    if (!status) return;
    const row = Math.floor(Math.random() * this.rows);
    const col = Math.floor(Math.random() * this.cols);
    this.food = `${row}_${col}`;
    let box = this.boxes.get(this.food);
    box.style.background =
      this.snakeSections(this.snake).indexOf(this.food) < 0
        ? "tomato"
        : "#222f3e";
  }

  eaten(position) {
    let _snake = this.snakeSections(this.snake);
    return _snake.indexOf(position) >= 0 ? true : false;
  }

  grow() {
    // TODO
    // - add new block to the tail once called
  }

  update() {
    this.move();
    // this.addFood();
    this.addSnake();
  }

  move() {
    if (this.isDead) return;

    let head = this.snake[this.snake.length - 1];

    const currentMove = this.moveQueue.shift();
    if (currentMove) this.lastMove = currentMove;

    const _move = this.moves[this.lastMove];
    const _head = _move(head);

    if (this.snakeBounds(_head)) this.stop();
    // if (isEaten(head)) addFood(true);
    else this.snake.shift();
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
