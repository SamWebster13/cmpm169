"use strict";

/* global p5 */
/* exported preload, setup, draw, mouseClicked */

// Project base code provided by {amsmith,ikarth}@ucsc.edu


let tile_width_step_main; // A width step is half a tile's width
let tile_height_step_main; // A height step is half a tile's height

// Global variables. These will mostly be overwritten in setup().
let tile_rows, tile_columns;
let camera_offset;
let camera_velocity;

/////////////////////////////
// Transforms between coordinate systems
// These are actually slightly weirder than in full 3d...
/////////////////////////////
function worldToScreen([world_x, world_y], [camera_x, camera_y]) {
  let i = (world_x - world_y) * tile_width_step_main;
  let j = (world_x + world_y) * tile_height_step_main;
  return [i + camera_x, j + camera_y];
}

function worldToCamera([world_x, world_y], [camera_x, camera_y]) {
  let i = (world_x - world_y) * tile_width_step_main;
  let j = (world_x + world_y) * tile_height_step_main;
  return [i, j];
}

function tileRenderingOrder(offset) {
  return [offset[1] - offset[0], offset[0] + offset[1]];
}

function screenToWorld([screen_x, screen_y], [camera_x, camera_y]) {
  screen_x -= camera_x;
  screen_y -= camera_y;
  screen_x /= tile_width_step_main * 2;
  screen_y /= tile_height_step_main * 2;
  screen_y += 0.5;
  return [Math.floor(screen_y + screen_x), Math.floor(screen_y - screen_x)];
}

function cameraToWorldOffset([camera_x, camera_y]) {
  let world_x = camera_x / (tile_width_step_main * 2);
  let world_y = camera_y / (tile_height_step_main * 2);
  return { x: Math.round(world_x), y: Math.round(world_y) };
}

function worldOffsetToCamera([world_x, world_y]) {
  let camera_x = world_x * (tile_width_step_main * 2);
  let camera_y = world_y * (tile_height_step_main * 2);
  return new p5.Vector(camera_x, camera_y);
}

function preload() {
  if (window.p2_preload) {
    window.p2_preload();
  }
}

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent("canvas-container");

  camera_offset = new p5.Vector(width / 2, height / 2);
  camera_velocity = new p5.Vector(0, 0);

  if (window.p2_setup) {
    window.p2_setup();
  }

  let label = createP();
  label.html("World key: ");
  label.parent("container");

  let input = createInput("bla bla");
  input.parent(label);
  input.input(() => {
    rebuildWorld(input.value());
  });
  
  rebuildWorld(input.value());
}

function rebuildWorld(key) {
  if (window.p2_worldKeyChanged) {
    window.p2_worldKeyChanged(key);
  }
  tile_width_step_main = window.p2_tileWidth ? window.p2_tileWidth() : 32;
  tile_height_step_main = window.p2_tileHeight ? window.p2_tileHeight() : 14.5;
  tile_columns = Math.ceil(width / (tile_width_step_main * 2));
  tile_rows = Math.ceil(height / (tile_height_step_main * 2));
}

function mouseClicked() {
  let world_pos = screenToWorld(
    [0 - mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );

  if (window.p2_tileClicked) {
    window.p2_tileClicked(world_pos[0], world_pos[1]);
  }
}

function draw() {
  
  // Update camera position (centered on the player)
  updateCamera();
   
  // Convert mouse position to world coordinates based on the current camera offset
  let world_pos = screenToWorld(
    [0 - mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );

  // Calculate world offset from camera position
  let world_offset = cameraToWorldOffset([camera_offset.x, camera_offset.y]);

  background(100); // Clear the background

  if (window.p2_drawBefore) {
    window.p2_drawBefore();
  }

  // Rendering tiles: calculate the visible area based on the camera offset
  let overdraw = 0.1;
  let y0 = Math.floor((0 - overdraw) * tile_rows);
  let y1 = Math.floor((1 + overdraw) * tile_rows);
  let x0 = Math.floor((0 - overdraw) * tile_columns);
  let x1 = Math.floor((1 + overdraw) * tile_columns);

  // Loop through the tiles and render them
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      drawTile(tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [camera_offset.x, camera_offset.y]);
      drawTile(
        tileRenderingOrder([x + 0.5 + world_offset.x, y + 0.5 - world_offset.y]),
        [camera_offset.x, camera_offset.y]
      );
    }
  }

  // Optional: Display info about the tile under the mouse cursor
  describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

}

// Display a discription of the tile at world_x, world_y.
function describeMouseTile([world_x, world_y], [camera_x, camera_y]) {
  let [screen_x, screen_y] = worldToScreen(
    [world_x, world_y],
    [camera_x, camera_y]
  );
  drawTileDescription([world_x, world_y], [0 - screen_x, screen_y]);
}

function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
  translate(screen_x, screen_y);
  if (window.p2_drawSelectedTile) {
    window.p2_drawSelectedTile(world_x, world_y, screen_x, screen_y);
  }
  translate(0 - screen_x, -screen_y);
}

// Draw a tile, mostly by calling the user's drawing code.
function drawTile([world_x, world_y], [camera_x, camera_y]) {
  let [screen_x, screen_y] = worldToScreen(
    [world_x, world_y],
    [camera_x, camera_y]
  );
  translate(0 - screen_x, screen_y);
  if (window.p2_drawTile) {
    window.p2_drawTile(world_x, world_y,  - screen_x, screen_y);
  }
  translate(-(0 - screen_x), -screen_y);
}
