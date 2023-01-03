const { Snake } = require("../snake");

describe("add snake food", () => {
  test("get a food position on map", () => {
    document.body.innerHTML =
      '<div class="game-board">' +
      '<div id="notification" class="hidden">' +
      "<h3>Game over</h3>" +
      "<span>Press <strong>Enter</strong> to restart</span>" +
      "</div>" +
      '<div id="board"></div>' +
      "</div>";
    const snake = new Snake();
    snake.init();
    const food = snake.food;
    expect(food).toBeDefined();
  });
});
