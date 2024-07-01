export let offscreenCanvas, offscreenCtx;
export let backgroundCanvas, backgroundCtx;

export function initializeCanvases(rows, columns, cellSize, canvas) {
  offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  offscreenCtx = offscreenCanvas.getContext("2d");

  backgroundCanvas = document.createElement("canvas");
  backgroundCanvas.width = columns * cellSize;
  backgroundCanvas.height = rows * cellSize;
  backgroundCtx = backgroundCanvas.getContext("2d");

  updateBackgroundCanvas(rows, columns, cellSize);
}

export function updateBackgroundCanvas(rows, columns, cellSize) {
  backgroundCanvas = document.createElement("canvas");
  backgroundCanvas.width = columns * cellSize;
  backgroundCanvas.height = rows * cellSize;
  backgroundCtx = backgroundCanvas.getContext("2d");
  drawBackground(rows, columns, cellSize);
}

export function drawBackground(rows, columns, cellSize) {
  backgroundCtx.fillStyle = "#f0eee6";
  backgroundCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

  backgroundCtx.strokeStyle = "#000";
  backgroundCtx.beginPath();
  for (let i = 0; i <= rows; i++) {
    backgroundCtx.moveTo(0, i * cellSize);
    backgroundCtx.lineTo(columns * cellSize, i * cellSize);
  }
  for (let j = 0; j <= columns; j++) {
    backgroundCtx.moveTo(j * cellSize, 0);
    backgroundCtx.lineTo(j * cellSize, rows * cellSize);
  }
  backgroundCtx.stroke();
}
