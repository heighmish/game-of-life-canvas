import "./style.css";

const canvas: HTMLCanvasElement = document.getElementById(
  "mainCanvas",
) as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (ctx === null) {
  throw new Error("Unable to access canvas context");
}

const canvasSize = 500;

const gameSize = 100;
const squareSize = canvasSize / gameSize;

const generateAliveCell = () => Math.floor(Math.random() * 10) < 2;

let gameState: boolean[][] = new Array(gameSize)
  .fill(false)
  .map((_) => Array.from({ length: gameSize }, () => generateAliveCell()));

console.log(gameState);

function draw(gameState: boolean[][]) {
  for (let row = 0; row < gameState.length; ++row) {
    for (let col = 0; col < gameState.length; ++col) {
      const fillStyle = gameState[row][col] === true ? "red" : "black";
      if (ctx === null) {
        throw new Error();
      }
      ctx.fillStyle = fillStyle;
      ctx.fillRect(row * squareSize, col * squareSize, squareSize, squareSize);
    }
  }
}

type Point = {
  x: number;
  y: number;
};

const Directions: Array<Point> = [
  { x: -1, y: -1 }, //NW
  { x: -1, y: 0 }, //NN
  { x: -1, y: 1 }, //NE
  { x: 0, y: -1 }, //W
  { x: 0, y: 1 }, //E
  { x: 1, y: -1 }, //SW
  { x: 1, y: 0 }, //S
  { x: 1, y: 1 }, //SE
];

function countAliveNeighbours(
  row: number,
  col: number,
  gameState: boolean[][],
) {
  let aliveNeighbours: number = 0;
  for (const dir of Directions) {
    const checkRow = row + dir.x;
    const checkCol = col + dir.y;
    if (
      checkRow >= 0 &&
      checkRow < gameState.length &&
      checkCol >= 0 &&
      checkCol < gameState.length
    ) {
      if (gameState[checkRow][checkCol] === true) {
        ++aliveNeighbours;
      }
    }
  }
  return aliveNeighbours;
}

function isCurrentCellLive(isAlive: boolean, neighbours: number) {
  if (!isAlive) {
    return neighbours === 3;
  }
  if (neighbours === 2 || neighbours === 3) {
    return true;
  }
  return false;
}

function getNextGameState(gameState: boolean[][]) {
  let newState = new Array(gameSize)
    .fill(false)
    .map((_) => new Array(gameSize).fill(false));
  for (let row = 0; row < gameState.length; ++row) {
    for (let col = 0; col < gameState.length; ++col) {
      const neighbours = countAliveNeighbours(row, col, gameState);
      const isCurrentAlive = gameState[row][col];
      newState[row][col] = isCurrentCellLive(isCurrentAlive, neighbours);
    }
  }
  return newState;
}

function gameLoop() {
  draw(gameState);
  gameState = getNextGameState(gameState);
  window.requestAnimationFrame(gameLoop);
}

gameLoop();
