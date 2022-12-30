export function setupGame() {
  const boxSize = 20;
  const rows = 25;
  const cols = 25;
  let snake = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ];

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
  const notification = document.getElementById("notification");
  const boxes = new Map();
  const moves = {
    LEFT: (head) => [head[0], head[1] - 1],
    RIGHT: (head) => [head[0], head[1] + 1],
    UP: (head) => [head[0] - 1, head[1]],
    DOWN: (head) => [head[0] + 1, head[1]],
  };
  const moveQueue = [];
  let lastMove = "RIGHT";
  let gameLoop = null;
  let isRunning = false;

  let board = document.getElementById("board");
  const snakeSections = (snake) => snake.map(([i, j]) => `${i}_${j}`);

  const input = (e) => {
    e.preventDefault();
    switch (e.keyCode) {
      case keys.LEFT:
      case keys.A:
        if (lastMove !== "RIGHT") moveQueue.push("LEFT");
        break;
      case keys.RIGHT:
      case keys.D:
        if (lastMove !== "LEFT") moveQueue.push("RIGHT");
        break;
      case keys.UP:
      case keys.W:
        if (lastMove !== "DOWN") moveQueue.push("UP");
        break;
      case keys.DOWN:
      case keys.S:
        if (lastMove !== "UP") moveQueue.push("DOWN");
        break;
      case keys.ENTER:
        if (!isRunning) restartGame();
        break;
      default:
        moveQueue.push(lastMove);
        break;
    }
  };
  const movement = () => {
    let head = snake[snake.length - 1];
    const currentMove = moveQueue.shift();
    if (currentMove) lastMove = currentMove;

    const _move = moves[lastMove];
    const _head = _move(head);

    if (snakeBounds(_head)) stopGame();
    else snake.shift();
    snake.push(_head);
  };

  const update = () => {
    movement();
    addSnake(snake);
  };

  //draws current snake based on snake values
  const addSnake = (snake) => {
    let _snake = snakeSections(snake);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let position = `${i}_${j}`;
        let box = boxes.get(position);
        box.style.background =
          _snake.indexOf(position) >= 0 ? "#A3CB38" : "#222f3e";
      }
    }
  };

  const snakeBounds = (head) => {
    const [i, j] = head;
    if (i < 0 || j < 0) return true;
    if (i >= rows || j >= cols) return true;
    if (snakeSections(snake).indexOf(`${i}_${j}`) >= 0) return true;
    return false;
  };

  const restartGame = () => {
    snake = [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ];
    lastMove = "RIGHT";
    isRunning = true;
    notification.classList.add("hidden");
    gameLoop = setInterval(() => update(), 500);
  };

  const stopGame = () => {
    isRunning = false;
    notification.classList.remove("hidden");
    clearInterval(gameLoop);
  };
  const initGame = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let box = document.createElement("div");
        box.style.position = "absolute";
        box.style.width = `${boxSize}px`;
        box.style.height = `${boxSize}px`;
        box.style.border = "1px solid rgba(235, 255, 114,0.4)";
        box.style.borderRadius = "2px";
        box.style.background = "#222f3e";
        box.style.top = `${i * boxSize}px`;
        box.style.left = `${j * boxSize}px`;
        board.appendChild(box);
        boxes.set(`${i}_${j}`, box);
      }
    }
    addSnake(snake);
    gameLoop = setInterval(() => update(), 500);
    window.addEventListener("keydown", input);
  };
  initGame();
}
