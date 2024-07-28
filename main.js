import "./style.css";
import { initDialog, renderDialogContent } from "./modal";
import { createStitchButtons, selectedStitch, stitches } from "./stitches";
import {
  backgroundCanvas,
  backgroundCtx,
  drawBackground,
  initializeCanvases,
  offscreenCanvas,
  offscreenCtx,
  updateBackgroundCanvas,
} from "./optimize";

const canvas = document.getElementById("gridCanvas");
let row = document.querySelector(".addr");
let column = document.querySelector(".addc");
let rowd = document.querySelector(".remr");
let columnd = document.querySelector(".remc");
let rowInput = document.querySelector(".num_of_rows");
let columnInput = document.querySelector(".num_of_cols");
let save = document.querySelector(".save");
let grabCheckbox = document.querySelector(".move");

let clear = document.querySelector(".clear");

clear.addEventListener("click", () => {
  grid = Array(rows)
    .fill()
    .map(() => Array(columns).fill(""));
  drawGrid();
});

const ctx = canvas.getContext("2d");

const cellSize = 50;
const labelSize = 50;
let rows = 7;
let columns = 7;
let offsetX = 80;
let offsetY = 160;
let isDragging = false;
let lastX, lastY;

row.addEventListener("click", addRow);
column.addEventListener("click", addColumn);
rowd.addEventListener("click", removeRow);
columnd.addEventListener("click", removeColumn);
save.addEventListener("click", saveAsImage);

let grid = Array(rows)
  .fill()
  .map(() => Array(columns).fill(""));

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  backgroundCanvas.width = columns * cellSize;
  backgroundCanvas.height = rows * cellSize;
  drawBackground(rows, columns, cellSize);
  updateCanvas();
}

function updateCanvas() {
  requestAnimationFrame(drawGrid);
}

function drawGrid(targetCtx = ctx, forExport = false) {
  const currentCtx = forExport ? targetCtx : offscreenCtx;
  currentCtx.clearRect(0, 0, currentCtx.canvas.width, currentCtx.canvas.height);

  currentCtx.save();
  if (!forExport) {
    currentCtx.translate(offsetX, offsetY);
  }

  let startRow = Math.max(0, Math.floor(-offsetY / cellSize));
  let endRow = Math.min(
    rows,
    Math.ceil((-offsetY + currentCtx.canvas.height) / cellSize)
  );
  let startCol = Math.max(0, Math.floor(-offsetX / cellSize));
  let endCol = Math.min(
    columns,
    Math.ceil((-offsetX + currentCtx.canvas.width) / cellSize)
  );

  if (forExport) {
    startRow = 0;
    endRow = rows;
    startCol = 0;
    endCol = columns;
  }

  currentCtx.drawImage(
    backgroundCanvas,
    startCol * cellSize,
    startRow * cellSize,
    (endCol - startCol + 1) * cellSize,
    (endRow - startRow + 1) * cellSize,
    startCol * cellSize,
    startRow * cellSize,
    (endCol - startCol + 1) * cellSize,
    (endRow - startRow + 1) * cellSize
  );

  currentCtx.font = "32px Arial";
  currentCtx.fillStyle = "#000";
  // Draw grid lines and stitches
  for (let i = startRow; i < endRow; i++) {
    for (let j = startCol; j < endCol; j++) {
      currentCtx.save();
      currentCtx.font = "11px Arial";
      currentCtx.fillStyle = "#00000085";
      currentCtx.fillText(
        `${i + 1}-${j + 1}`,
        j * cellSize + cellSize / 4,
        i * cellSize + cellSize / 4
      );
      currentCtx.restore();

      if (grid[i][j]) {
        if (grid[i][j].isSymbolImage) {
          currentCtx.drawImage(
            grid[i][j].symbol,
            j * cellSize + cellSize / 2 - 10,
            i * cellSize + cellSize / 2 - 5,
            20,
            20
          );
        } else {
          currentCtx.fillText(
            grid[i][j].symbol,
            j * cellSize + cellSize / 2 - 15,
            i * cellSize + cellSize / 2 + 15
          );
        }
      }
    }
  }

  if (!forExport) {
    currentCtx.save();
    currentCtx.font = "32px ui-serif";
    currentCtx.fillText("ГЕНЕРАТОР СХЕМ", 50, -20);
    currentCtx.restore();
  }

  currentCtx.restore();

  if (!forExport) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(offscreenCanvas, 0, 0);
    updateGridInfo();
  }
}

rowInput.addEventListener("change", (e) => {
  changeSizeOfGrid(e, rows, addRow, removeRow);
});
columnInput.addEventListener("change", (e) => {
  changeSizeOfGrid(e, columns, addColumn, removeColumn);
});

function changeSizeOfGrid(e, currentSize, add, remove) {
  let diff = Number(e.target.value) - currentSize;
  let isPositive = diff > 0;

  for (let i = 0; i < Math.abs(diff); i++) {
    if (isPositive) {
      add(i === Math.abs(diff) - 1);
    } else {
      remove(i === Math.abs(diff) - 1);
    }
  }
}

function addRow(isRedrawing = true) {
  rows++;
  grid.push(Array(columns).fill(""));
  if (isRedrawing) {
    updateBackgroundCanvas(rows, columns, cellSize);
    updateCanvas();
  }
}

function addColumn(isRedrawing = true) {
  columns++;
  grid.forEach((row) => row.push(""));
  if (isRedrawing) {
    updateBackgroundCanvas(rows, columns, cellSize);
    updateCanvas();
  }
}

function removeRow(isRedrawing = true) {
  rows--;
  grid.pop();
  if (isRedrawing) {
    updateBackgroundCanvas(rows, columns, cellSize);
    drawGrid();
  }
}

function removeColumn(isRedrawing = true) {
  columns--;
  grid.forEach((row) => row.pop());
  if (isRedrawing) {
    updateBackgroundCanvas(rows, columns, cellSize);
    drawGrid();
  }
}

function updateGridInfo() {
  //const gridInfo = document.getElementById("gridInfo");
  rowInput.value = rows;
  columnInput.value = columns;
  //gridInfo.textContent = `Grid size: ${rows} rows x ${columns} columns`;
}

function saveAsImage() {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = columns * cellSize;
  exportCanvas.height = rows * cellSize;
  const exportCtx = exportCanvas.getContext("2d");

  drawGrid(exportCtx, true);

  const link = document.createElement("a");
  link.download = "knitting_pattern.png";
  link.href = exportCanvas.toDataURL();
  link.click();
}

canvas.addEventListener("pointerdown", (event) => {
  if (grabCheckbox.checked) {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
  }
});

canvas.addEventListener("pointermove", (event) => {
  if (isDragging) {
    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;
    offsetX += deltaX;
    offsetY += deltaY;
    lastX = event.clientX;
    lastY = event.clientY;
    updateCanvas();
  }
});

canvas.addEventListener("pointerup", () => {
  isDragging = false;
});

canvas.addEventListener("click", (event) => {
  if (selectedStitch && !isDragging && !grabCheckbox.checked) {
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left - offsetX;
    const y = event.clientY - rect.top - offsetY;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (col >= 0 && col < columns && row >= 0 && row < rows) {
      grid[row][col] = stitches[selectedStitch];
      drawGrid();
    }
  }
});

window.addEventListener("resize", resizeCanvas);

async function init() {
  await createStitchButtons();
  initDialog();
  renderDialogContent(stitches);

  initializeCanvases(rows, columns, cellSize, canvas);
  updateCanvas();
  resizeCanvas();
}

init();
