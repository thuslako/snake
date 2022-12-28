export function setupGame() {
  const boxSize = 20;
  const row = 25;
  const col = 25;
  const snake = [
    [0, 0],
    [0, 1],
    [0, 2],
  ];

  const keys = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
  };

  const boxes = new Map();
  const moves = {
    LEFT: (head) => [head[0], head[1] - 1],
    RIGHT: (head) => [head[0], head[1] + 1],
    UP: (head) => [head[0] - 1, head[1]],
    DOWN: (head) => [head[0] + 1, head[1]],
  };
  const moveQueue = [];

  let board = document.getElementById("board");
  setInterval(() => update(), 100);

  const snakeSections = (snake) =>
    snake.map((section) => `${section[0]}${section[1]}`);

  const input = (e) => {
    switch (e.keyCode) {
      case keys.LEFT:
        moveQueue.push("LEFT");
        break;
      case keys.RIGHT:
        moveQueue.push("RIGHT");
        break;
      case keys.UP:
        moveQueue.push("UP");
        break;
      case keys.DOWN:
        moveQueue.push("DOWN");
      default:
        break;
    }
    // console.log(moveQueue);
  };

  window.addEventListener("keydown", input);

  const movement = () => {
    if (!moveQueue.length) return;
    snake.shift();
    let head = snake[snake.length - 1];
    const _move = moves[moveQueue.pop()];
    snake.push(_move(head));
  };

  const update = () => {
    movement();
    addSnake(snake);
  };

  //draws current snake based on snake values
  const addSnake = (snake) => {
    let _snake = snakeSections(snake);
    let box = null;
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        _snake.forEach((section) => {
          if (boxes.has(section)) {
            box = boxes.get(section);
            box.style.background = "#A3CB38";
          }
        });
        box = boxes.get(`${i}${j}`);
        box.style.background = "#222f3e";
      }
    }
  };
  const initCanvas = () => {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        let box = document.createElement("div");
        box.style.position = "absolute";
        box.style.width = `${boxSize}px`;
        box.style.height = `${boxSize}px`;
        box.style.border = "1px solid rgba(235, 255, 114,0.4)";
        box.style.background = "#222f3e";
        box.style.top = `${i * boxSize}px`;
        box.style.left = `${j * boxSize}px`;
        board.appendChild(box);
        boxes.set(`${i}${j}`, box);
      }
    }
    addSnake(snake);
  };
  initCanvas();
}
