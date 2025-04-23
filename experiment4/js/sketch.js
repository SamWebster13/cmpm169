"use strict";

/* global
  XXH
  applyMatrix
  background
  beginShape
  ellipse
  endShape
  fill
  height
  line
  millis
  noFill
  noStroke
  noiseSeed
  pop
  push
  randomSeed
  rect
  stroke
  strokeWeight
  text
  textSize
  translate
  vertex
  width
  CLOSE

  camera_offset
  camera_velocity
*/

let worldSeed;
let captureLocations;
let ego;
let tw, th;

const sketch1 = (p) => {

  p.preload = () => {
    // Place any preload logic here, if needed
  };

  p.p2_setup = () => {
    worldSeed = XXH.h32("initial", 0);
    randomSeed(worldSeed);
    captureLocations = {};
    ego = { i: 0, j: 0, altitude: 0 };
    captureLocations[[ego.i, ego.j]] = true; // start location should be clear
    camera_offset.x = -p.width / 2 + 4 * tw;
    camera_offset.y = p.height / 2 - 2 * th;
  };

  p.setup = () => {
    p.createCanvas(600, 400);
    p.p2_setup();
  };

  

  p.p2_tileWidth = () => {
    return 48;
  };

  p.p2_tileHeight = () => {
    return 32;
  };

  p.isOnBoard = (i, j) => {
    if (i == 0 && j == 0) {
      return true; // one tile is always visible
    }
    if (j >= 0 && j < 8 && i <= 0) {
      return 5 - i + j / 8 < p.millis() / 500; // tile appear over time with delay
    }
  };

  p.isInPlay = (i, j) => {
    return (i + j) % 2 == 0; // checkers is only played on half the board
  };

  [tw, th] = [p.p2_tileWidth(), p.p2_tileHeight()];

  p.isOccupiedByOpponent = (i, j) => {
    if (p.isInPlay(i, j) && XXH.h32("opponent at " + [i, j], worldSeed) % 3 == 0) {
      if (!captureLocations[[i, j]]) {
        return true;
      }
    } else {
      return false;
    }
  };

  p.p2_tileClicked = (i, j) => {
    if (isLegalMove(i, j)) {
      let scale = 0.06 * (ego.i - i); // 0.05 would track player progress, 0.06 lets them fall behind a bit to convey futility
      camera_velocity.x = tw * scale;
      camera_velocity.y = th * scale;
      applyMove(i, j);
    }
  };

  p.p2_drawBefore = () => {
    p.background(240);

    p.push();
    p.translate(-camera_offset.x - tw, camera_offset.y + th * 1.5);
    p.textSize(36);
    p.noStroke();
    p.fill(0, 255 * (1 - 1000 / p.millis()));
    applyMatrix(1, th / tw, 0, 1, 0, 0);
    p.text("You'll Never be king.", 0, 0);
    p.pop();
  };

  p.p2_drawTile = (i, j) => {
    if (!p.isOnBoard(i, j)) {
      return;
    }

    if (p.isInPlay(i, j)) {
      p.fill(100, 80, 50);
    } else {
      p.fill(255);
    }

    p.noStroke();
    p.beginShape();
    p.vertex(-tw, 0);
    p.vertex(0, th);
    p.vertex(tw, 0);
    p.vertex(0, -th);
    p.endShape(p.CLOSE);

    if (p.isOccupiedByOpponent(i, j)) {
      drawMan(0, 50, 0);
    }

    if (ego.i == i && ego.j == j) {
      p.drawMan("#882222", "#aa4444", ego.altitude);
    }
  };

  p.drawMan = (sideFill, topFill, altitude) => {
    let r = 0.8;
    let manW = tw * r;
    let manH = th * r;
    let offset = 6;

    // draw shadow on the ground
    p.fill(0, 0, 0, 64);
    p.ellipse(0, 0, manW, manH);

    // draw man shifted up by altitude
    p.fill(sideFill);
    p.rect(-manW / 2, -offset - altitude, manW, offset);
    p.ellipse(0, -altitude, manW, manH);
    p.fill(topFill);
    p.ellipse(0, -offset - altitude, manW, manH);
  };

  p.isLegalMove = (i, j) => {
    if (!p.isOnBoard(i, j) || !isInPlay(i, j) || p.isOccupiedByOpponent(i, j)) {
      return false;
    }

    if (ego.i - 1 == i && ego.j + 1 == j) {
      return true;
    }

    if (ego.i - 1 == i && ego.j - 1 == j) {
      return true;
    }

    if (ego.i - 2 == i && ego.j + 2 == j) {
      return p.isOccupiedByOpponent(ego.i - 1, ego.j + 1);
    }

    if (ego.i - 2 == i && ego.j - 2 == j) {
      return p.isOccupiedByOpponent(ego.i - 1, ego.j - 1);
    }

    return false;
  };

  p.applyMove = (i, j) => {
    // We're assuming that this was a legal move.
    if (ego.i - 2 == i) {
      if (ego.j - 2 == j) {
        captureLocations[[ego.i - 1, ego.j - 1]] = true;
      } else {
        captureLocations[[ego.i - 1, ego.j + 1]] = true;
      }
    }
    ego.i = i;
    ego.j = j;
  };

  p.p2_drawSelectedTile = (i, j) => {
    if (isLegalMove(i, j)) {
      ego.altitude = 10;
    } else {
      ego.altitude = 0;
    }
  };

  p.p2_drawAfter = () => {};

  // Regular draw loop
  p.draw = () => {
    p.p2_drawBefore();
    p.p2_drawTile(0, 0); // Example call, adjust as needed
    p.p2_drawAfter();
  };
};

let p5_instance = new p5(sketch1);  // initialize p5 sketch

