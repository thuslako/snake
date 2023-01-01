import Snake from "./snake";

describe("add snake food", () => {
  test("get a food position on map", () => {
    const snake = new Snake();
    snake.init();
    snake.addFood(true);
    const food = snake.food;
    console.log(food);
    expect(food.length).toBe(1);
  });
});
