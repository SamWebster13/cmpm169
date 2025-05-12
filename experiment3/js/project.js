// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
// project.js

/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

// project.js - supports both overworld and dungeon maps
let canvasContainer1, canvasContainer2;
let canvas1, canvas2;
let centerHorz1, centerVert1;
let centerHorz2, centerVert2;


let seed1 = 153;

let tilesetImage;
let currentGrid1 = [];
let currentGrid2 = [];

let numRows1, numCols1;
let numRows2, numCols2;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/723f2e81-515d-43ff-b44a-4e161e0451ed%2Ftileset.png?v=1611598428661"
  );
}

// -------------------- FUNCTIONS --------------------

function reseed1() {
  seed1 = (seed1 | 0) + 1;
  randomSeed(seed1);
  noiseSeed(seed1);
  regenerateGrid1();
}

function regenerateGrid1() {
  select("#asciiBox1").value(gridToString(generateGrid(numCols1, numRows1 + 5)));
  reparseGrid1();
}

function reparseGrid1() {
  currentGrid1 = stringToGrid(select("#asciiBox1").value());
}

// -------------------- SHARED --------------------

function gridToString(grid) {
  return grid.map(row => row.join("")).join("\n");
}

function stringToGrid(str) {
  return str.split("\n").map(line => line.split(""));
}

function setup() {
  // OVERWORLD
  numRows1 = select("#asciiBox1").attribute("rows") | 0;
  numCols1 = select("#asciiBox1").attribute("cols") | 0;

  createCanvas(10 * numCols1, 20 * numRows1).parent("canvas-container");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#newSeedBtn").mousePressed(reseed1);
  select("#asciiBox1").input(reparseGrid1);

  reseed1();

}


function draw() {
  // Overworld on main canvas
  let pg1 = createGraphics(10 * numCols1, 20 * numRows1);

  randomSeed(seed1);
  drawGrid(currentGrid1, pg1);
  image(pg1, 0, 0);
  
}

function draw2() {
  // Overworld on main canvas
  let pg2 = createGraphics(10 * numCols1, 20 * numRows1);

  randomSeed(seed1);
  drawGrid(currentGrid2, pg2);
  image(pg2, 0, 0);
  
}


function placeTile(i, j, ti, tj, pg = null) {
  const ctx = pg || this;
  ctx.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}


