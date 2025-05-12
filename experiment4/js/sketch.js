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

function p2_preload() {}

function p2_setup() {}

let worldSeed;
let captureLocations;
let ego;
let [tw, th] = [p2_tileWidth(), p2_tileHeight()];
let orbitRadius = 20; // radius of the orbit around the star
let orbitSpeed = 0.02; // controls how fast the spaceship orbits
let angle = 0; // initial angle for the spaceship
let pendingDashedLines = [];

function p2_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  randomSeed(worldSeed);

  captureLocations = {};
  ego = { i: 0, j: 0, altitude: 0 };
  captureLocations[[ego.i, ego.j]] = true; // start location should be clear

  // CAMERA: set initial camera offset when world loads
  camera_offset.x = -width / 2 + 1 * tw;
  camera_offset.y = height / 2 - 1 * th;
}

function updateCamera() {
  // Center the camera on the player by using the player's world position
  

  // Handle smooth panning using keyboard input (optional)
  if (keyIsDown(LEFT_ARROW)) {
    camera_velocity.x -= 1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    camera_velocity.x += 1;
  }
  if (keyIsDown(DOWN_ARROW)) {
    camera_velocity.y -= 1;
  }
  if (keyIsDown(UP_ARROW)) {
    camera_velocity.y += 1;
  }

  // Apply velocity for smooth camera movement
  camera_velocity.mult(0.95); // Reduce speed for smooth movement
  if (camera_velocity.mag() < 0.01) {
    camera_velocity.setMag(0); // Stop if velocity is very small
  }

  // Update camera_offset based on user input for panning (if needed)
  camera_offset.add(camera_velocity);
}
 
function isMouseNearLine(x1, y1, x2, y2, threshold) {
  const A = mouseX - x1;
  const B = mouseY - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq !== 0) param = dot / len_sq;

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = mouseX - xx;
  const dy = mouseY - yy;
  return Math.sqrt(dx * dx + dy * dy) < threshold;
}

function p2_tileWidth() {
  return 48;
}

function p2_tileHeight() {
  return 32;
}

function isOnBoard(i, j) {
  let di = i - ego.i;
  let dj = j - ego.j;
  let distance = Math.sqrt(di * di + dj * dj);
  return distance < 15; // show tiles within radius 15
}

function isStar(i, j) {
  return XXH.h32("star at " + [i, j], worldSeed) % 5 == 0;
}

function p2_drawTile(i, j) {
  if (!isOnBoard(i, j)) {
    return;
  }

  // Space background
  fill(0);
  noStroke();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  if (isStar(i, j)) {
    fill(255, 255, random(200, 255)); // Twinkle a little bit
    ellipse(0, 0, 6, 6);
  }

  if (ego.i == i && ego.j == j) {
    // Orbiting the star
    // Compute angle only once
    angle += orbitSpeed;
    let shipX = orbitRadius * Math.cos(angle);
    let shipY = orbitRadius * Math.sin(angle);

    // Draw orbit circle
    noFill();
    stroke(255);
    strokeWeight(2);
    ellipse(0, 0, orbitRadius * 2, orbitRadius * 2);
    noStroke();

    // Draw ship
    

    let legalMoveCount = 0;
    let extensionFactor = 2;

    // Delay drawing dashed lines until after background and stars
    let dashedLines = [];

    for (let ii = ego.i - 3; ii <= ego.i + 3; ii++) {
      for (let jj = ego.j - 3; jj <= ego.j + 3; jj++) {
        if (isLegalMove(ii, jj) && !(ii === ego.i && jj === ego.j)) {
          legalMoveCount++;

          let dx = (ii - ego.i);
          let dy = (jj - ego.j);
          let dirX = Math.sign(dx);
          let dirY = Math.sign(dy);

          let screenX = -(dirX - dirY) * (tw / 2);
          let screenY = (dirX + dirY) * (th / 2);

          // Extend to make line longer
          let extendedX = screenX * extensionFactor;
          let extendedY = screenY * extensionFactor;

        let angleToTarget = Math.atan2(extendedY, extendedX);
        // Snap the angle to the nearest multiple of 15 degrees
        let snappedAngle = Math.round(angleToTarget / (Math.PI / 18)) * (Math.PI / 18);
        // Use snappedAngle for further calculations
        let ringX = orbitRadius * Math.cos(snappedAngle);
        let ringY = orbitRadius * Math.sin(snappedAngle);



        dashedLines.push({ 
          x1: ringX, 
          y1: ringY, 
          x2: extendedX, 
          y2: extendedY,
        });
        }
      }
    }

    // Now draw dashed lines after everything else
    push();
    stroke(255);
    dashedLines.forEach(dash => {
      const hover = isMouseNearLine(dash.x1, dash.y1, dash.x2, dash.y2, 6); // 6px hover range
      if (hover) {
        line(dash.x1, dash.y1, dash.x2, dash.y2); // Solid line when hovered
      } else {
        drawDashedLine(dash.x1, dash.y1, dash.x2, dash.y2, 5); // Dashed line otherwise
      }
    });

    pop();

    drawShip(shipX, shipY);
  }
}



function drawDashedLine(x1, y1, x2, y2, dashLength = 5) {
  // Calculate the total distance between the start and end points
  let distance = dist(x1, y1, x2, y2);
  distance = distance * 2
  // Calculate how many dashes fit into the distance
  let dashCount = distance / dashLength;
  
  ellipse(x2, y2, orbitRadius * 2, orbitRadius * 2);
  
  // Loop to draw the dashes
  for (let i = 0; i < dashCount; i += 2) {
    // Find the start and end positions of each dash
    let startX = lerp(x1, x2, i / dashCount);
    let startY = lerp(y1, y2, i / dashCount);
    let endX = lerp(x1, x2, (i + 1) / dashCount);
    let endY = lerp(y1, y2, (i + 1) / dashCount);
    
    // Log the start and end positions for each dash
    
    // Draw the line segment (the dash)
    line(startX, startY, endX, endY);
  }
}

function drawShip(x, y) {
  push(); // Save current transform

  translate(x, y); // Move to ship location
  rotate(angle-90 + HALF_PI); // Rotate by current orbit angle (plus adjustment to face 'forward')

  fill("#44ccff");
  stroke(255);
  strokeWeight(2);
  
  let shipWidth = tw / 4; 
  let shipHeight = th / 2;

  beginShape();
  vertex(-shipWidth / 2, -shipHeight / 2);
  vertex(shipWidth / 2, -shipHeight / 2);
  vertex(0, shipHeight / 2);
  endShape(CLOSE);

  noStroke();
  pop(); // Restore previous transform
}

function isLegalMove(i, j) {
  if (!isOnBoard(i, j)) {
    return false;
  }
  
  let di = i - ego.i;
  let dj = j - ego.j;
  
  // MOVEMENT: check if the clicked tile is within 2 tiles away
  if (Math.abs(di) <= 2 && Math.abs(dj) <= 2) {
    return isStar(i, j); // must jump onto a star
  }
  
  return false;
}

function p2_tileClicked(i, j) {
  if (isLegalMove(i, j)) {
    // CAMERA: set the camera's velocity based on how far you jumped
    let scale = 0.05 * (ego.i - i); // velocity based on distance moved
    camera_velocity.x = tw * scale;
    camera_velocity.y = th * scale;

    // MOVEMENT: update player position
    applyMove(i, j);
  }
}

function applyMove(i, j) {
  // MOVEMENT: when moving 2 tiles, mark middle tile as captured
  if (ego.i - 2 == i) {
    if (ego.j - 2 == j) {
      captureLocations[[ego.i - 1, ego.j - 1]] = true;
    } else {
      captureLocations[[ego.i - 1, ego.j + 1]] = true;
    }
  }

  // MOVEMENT: move the ego (player) to new tile
  ego.i = i;
  ego.j = j;
}

function p2_drawSelectedTile(i, j) {
  if (isLegalMove(i, j)) {
    stroke(144, 238, 144); // Light green color
    strokeWeight(3); // Thicker solid line

    // Calculate the player's current position and the hover position
    let x1 = ego.j * tw;  // Current column of the player
    let y1 = ego.i * th;  // Current row of the player
    let x2 = j * tw;      // Hovered column
    let y2 = i * th;      // Hovered row

    // Extend to make the line longer if needed (similar to what we did for the dashed lines)
    let extensionFactor = 2;
    let dx = x2 - x1;
    let dy = y2 - y1;

    let screenX = dx;
    let screenY = dy;

    // Extend the line
    let extendedX = screenX * extensionFactor;
    let extendedY = screenY * extensionFactor;

    // Snap the angle to the nearest multiple of 15 degrees
    let angleToTarget = Math.atan2(extendedY, extendedX);
    let snappedAngle = Math.round(angleToTarget / (Math.PI / 18)) * (Math.PI / 18);

    // Calculate the final line position
    let finalX2 = x1 + extendedX;
    let finalY2 = y1 + extendedY;

    // Draw the line between the two points
    line(x1, y1, finalX2, finalY2);
  } else {
    
    drawingContext.setLineDash([]); // Reset after use
  }
}