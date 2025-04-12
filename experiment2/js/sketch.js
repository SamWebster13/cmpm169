// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
/* exported setup, draw */

let layerOffsets = []; // Array to store offsets for each mountain layer
let numLayers = 4;



let seed = 239;
let sceneBuffer;
let sceneWidth;
let offsetX = 0;  // Initialize offsetX



function setup() {
  // Create the canvas with specific dimensions
  let container = document.getElementById('canvas-container');
  let canvas = createCanvas(container.offsetWidth, container.offsetHeight);
  canvas.parent('canvas-container');
  
  for (let i = 0; i < numLayers; i++) {
    layerOffsets[i] = 0; // Start with no offset
  }
  // Set up the "Reimagine" button functionality
  let reimagineButton = createButton("Reimagine");
  reimagineButton.mousePressed(() => {
    seed += int(random(100, 1000));
    renderScene();  // Re-render scene on reseed
  });

  reimagineButton.parent(document.querySelector('.minor-section'));

  // Fullscreen functionality
  document.getElementById("fullscreen").addEventListener("click", function() {
    document.documentElement.requestFullscreen();
  });

   // Watch for fullscreen changes
   document.addEventListener('fullscreenchange', () => {
    if (!fullscreen()) {
      // User exited fullscreen (likely pressed Escape)
      // Reset canvas size, reposition, or update UI
      console.log('Exited fullscreen');
      const container = document.getElementById('canvas-container');
      resizeCanvas(container.offsetWidth, container.offsetHeight);
    }
  });

  // Set up scene width and buffer for graphics
  sceneWidth = width * 7;  // Scene is 7x the canvas width
  sceneBuffer = createGraphics(sceneWidth, height);
  renderScene();  // Initial scene rendering
}



function renderScene() {
  sceneBuffer.background(255);
  sceneBuffer.randomSeed(seed);
  drawCloudRange(sceneBuffer);
  drawSun(sceneBuffer);
  drawMountainRange(sceneBuffer);
}

function draw() {
  background(255);

  offsetX += 1; // Increment the offset to scroll the scene left

  // Loop the scene when it reaches the end
  if (offsetX >= sceneWidth) {
    offsetX = 0;
  }

  // Draw the first image at the adjusted position
  image(sceneBuffer, -offsetX, 0);

  // Draw the second image, if the first one is off-screen, to create the loop
  if (offsetX < sceneWidth - width) {
    image(sceneBuffer, sceneWidth - offsetX, 0);
  }
}

function drawCloudRange(pg) {
  let baseColor = color('#EC6E62');
  let numLayers = 7;
  let startX = 0;
  let startY = height * 0.1;

  for (let layer = 0; layer < numLayers; layer++) {
    let lerpedColor = lerpColor(color(255, 182, 160), baseColor, layer / numLayers);
    pg.stroke(lerpedColor);
    pg.fill(lerpedColor);
    pg.beginShape();

    let firstY;

    for (let i = 0; i <= 100; i++) {
      let x = map(i, 0, 75, startX, pg.width);
      let y;

      if (i === 0) {
        y = startY + random(-65, -75);
        firstY = y;  // store it
      } else if (i === 100) {
        y = firstY;  // force wrap-around
      } else {
        y = startY + random(-65, -75);
      }

      pg.vertex(x, y);
    }

    pg.vertex(pg.width, startY);
    pg.vertex(0, startY);
    pg.endShape(CLOSE);

    startY += random(55, 60);
  }
}

function drawSun(pg) {
  let sunX = random(pg.width * 0.1, pg.width * 0.9);
  let sunY = random(height * 0.3, height * 0.7);
  let sunSize = random(110, 120);

  pg.noStroke();
  pg.fill(255, 200, 100);
  pg.ellipse(sunX, sunY, sunSize, sunSize);
}

function drawMountainRange(pg) {
  let baseY = height * 0.7;

  for (let i = 0; i < numLayers; i++) {
    let t = i / numLayers;
    let layerColor = lerpColor(color('#45597E'), color('#1C1C1C'), t);
    pg.fill(layerColor);
    pg.stroke(layerColor);

    let layerHeight = map(i, 0, numLayers, 50, 160);
    let yOffset = baseY + i * 50;
    let freq = map(i, 0, numLayers - 1, 0.01, 0.05);
    let stepCount = map(i, 0, numLayers - 1, 200, 60);
    let jitter = map(i, 0, numLayers - 1, 0, 6);
    let points = [];

    // Increase the disparity between the speeds
    let layerSpeed = map(i, 0, numLayers - 1, 0.15, 0.02); // Increased speed range

    // Move the x-offset for each layer based on its speed
    layerOffsets[i] -= layerSpeed; // Move left, change direction as necessary

    pg.beginShape();
    for (let j = 0; j <= stepCount; j++) {
      let x = map(j, 0, stepCount, 0, pg.width);
      // Apply parallax by adding the layer's offset
      x += layerOffsets[i];

      let y = yOffset - noise(x * freq + i * 100 + seed) * layerHeight;
      y += random(-jitter, jitter);
      pg.vertex(x, y);
      points.push({ x, y });
    }
    pg.vertex(pg.width, height);
    pg.vertex(0, height);
    pg.endShape(CLOSE);

    // MIST (same as before, no change needed)
    if (i < numLayers - 1) {
      let mistLevels = 10;
      for (let m = 0; m < mistLevels; m++) {
        let mistOpacity = map(m, 0, mistLevels - 1, 5, 10);
        let mistOffset = map(m, 0, mistLevels - 1, 10, 40);
        pg.noStroke();
        pg.fill(255, 255, 255, mistOpacity);

        pg.beginShape();
        pg.curveVertex(0, height);
        pg.curveVertex(0, height);
        for (let pt of points) {
          pg.curveVertex(pt.x, pt.y + mistOffset);
        }
        pg.curveVertex(pg.width, height);
        pg.curveVertex(pg.width, height);
        pg.endShape(CLOSE);
      }
    }
  }
}