// sketch.js - dual map setup with instance mode for overworld and dungeon
// Author: Your Name
// Date:

// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      let outerValue = noise(i / 40, j / 40);
      if (abs(outerValue - 0.5) < 0.03) {
        row.push("w"); // Water terrain
      } else {
        let innerValue = noise(i / 20, j / 20);
        if (innerValue > 0.5) {
          row.push(":"); // Sand or special terrain
        } else {
          row.push("."); // Grass or dirt
        }
      }
    }
    grid.push(row);
  }

  // Now, we'll add a 't' for trees randomly on grass tiles ('.')
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] === "." && random() < 0.1) { // 10% chance to place a tree
        grid[i][j] = "t"; // Tree tile
      }
    }
  }

  return grid;
}


function drawGrid(grid) {

  background(128);
  const g = 10;
  const t = millis() / 1000.0;

  noStroke();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      placeTile(i, j, (4 * pow(noise(t / 10, i, j / 4 + t), 2)) | 0, 14);

      if (gridCheck(grid, i, j, ":")) {
        placeTile(i, j, (4 * pow(random(), g)) | 0, 12);
      } else {
        drawContext(grid, i, j, "w", 9, 12, true);
      }

      if (gridCheck(grid, i, j, ".")) {
        placeTile(i, j, (4 * pow(random(), g)) | 0, 15, 0);
      } else {
        drawContext(grid, i, j, ".", 4, 15);
      }
      if (gridCheck(grid, i, j, "t")) { // Only check for "t" if the tile is actually grass
          placeTile(i, j, 16, 17); // Place tree tile at column 0, row 14 (tree location on sprite sheet)
        }

    }
  }
}


function generateDungeon(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      let outerValue = noise(i / 40, j / 40);
      if (abs(outerValue - 0.5) < 0.03) {
        row.push("w"); // Water terrain
      } else {
        let innerValue = noise(i / 20, j / 20);
        if (innerValue > 0.5) {
          row.push(":"); // Sand or special terrain
        } else {
          row.push("."); // Grass or dirt
        }
      }
    }
    grid.push(row);
  }

  // Now, we'll add a 't' for trees randomly on grass tiles ('.')
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] === "." && random() < 0.1) { // 10% chance to place a tree
        grid[i][j] = "t"; // Tree tile
      }
    }
  }

  return grid;
}


function drawDungeon(grid) {

  background(128);
  const g = 10;
  const t = millis() / 1000.0;

  noStroke();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      placeTile(i, j, (4 * pow(noise(t / 10, i, j / 4 + t), 2)) | 0, 14);

      if (gridCheck(grid, i, j, ":")) {
        placeTile(i, j, (4 * pow(random(), g)) | 0, 12);
      } else {
        drawContext(grid, i, j, "w", 9, 12, true);
      }

      if (gridCheck(grid, i, j, ".")) {
        placeTile(i, j, (4 * pow(random(), g)) | 0, 15, 0);
      } else {
        drawContext(grid, i, j, ".", 4, 15);
      }
      if (gridCheck(grid, i, j, "t")) { // Only check for "t" if the tile is actually grass
          placeTile(i, j, 16, 17); // Place tree tile at column 0, row 14 (tree location on sprite sheet)
        }

    }
  }
}

function drawContext(grid, i, j, target, dti, dtj, invert = false) {
  let code = gridCode(grid, i, j, target);
  if (invert) {
    code = ~code & 0xf;
  }
  let [ti,tj] = lookup[code];
  placeTile(i, j, dti + ti, dtj + tj);
}

function gridCode(grid, i, j, target) {
  return (
    (gridCheck(grid, i - 1, j, target) << 0) +
    (gridCheck(grid, i, j - 1, target) << 1) +
    (gridCheck(grid, i, j + 1, target) << 2) +
    (gridCheck(grid, i + 1, j, target) << 3)
  );
}

function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
    return grid[i][j] == target;
  } else {
    return false;
  }
}

const lookup = [
  [1, 1],
  [1, 0], // bottom
  [0, 1], // right
  [0, 0], // right+bottom
  [2, 1], // left
  [2, 0], // left+bottom
  [1, 1],
  [1, 0], // *
  [1, 2], // top
  [1, 1],
  [0, 2], // right+top
  [0, 1], // *
  [2, 2], // top+left
  [2, 1], // *
  [1, 2], // *
  [1, 1]
];
