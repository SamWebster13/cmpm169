
function getInspirations() {
  return [
    {
      name: "The Traveler", 
      assetUrl: "https://cdn.glitch.global/77aebd3d-6e53-42e1-9b6e-da627af93182/Traveler_s_rest_desktop.webp?v=1746480381179",
      credit: "The Traveler Reformed, Destiny 2"
    },
    {
      name: "The Atlas Computer", 
      assetUrl: "https://cdn.glitch.global/77aebd3d-6e53-42e1-9b6e-da627af93182/NMS_NEXT_HERO.webp?v=1746480375353",
      credit: "TThe Atlas Computer, No Man's Sky"
    },
    {
      name: "Space Rig - DRG", 
      assetUrl: "https://cdn.glitch.global/77aebd3d-6e53-42e1-9b6e-da627af93182/SpaceRigExterior.webp?v=1746480368583",
      credit: "Deep Rock Galactic Space Rig, Deep Rock Galactic"
    },
    {
      name: "The Enterprise D", 
      assetUrl: "https://cdn.glitch.global/77aebd3d-6e53-42e1-9b6e-da627af93182/USS_Enterprise-D_is_reactivated.webp?v=1746480387149",
      credit: "The USS Enterprise NCC-1701-D, Galaxy-class starship, Star Trek"
    }
  ];
}

function sampleColor(img) {
  let x = floor(random(img.width));
  let y = floor(random(img.height));
  let col = img.get(x, y);  // returns [r, g, b, a]
  return [col[0], col[1], col[2]];
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 8, inspiration.image.height / 8);

  let design = {
    bg: 128,
    fg: []
  };

  const triangleWeight = int(select('#triangleWeightSlider').value());
  const ellipseWeight = int(select('#ellipseWeightSlider').value());
  const rectWeight = int(select('#rectWeightSlider').value());

  const shapePool = [];
  for (let i = 0; i < triangleWeight; i++) shapePool.push('triangle');
  for (let i = 0; i < ellipseWeight; i++) shapePool.push('ellipse');
  for (let i = 0; i < rectWeight; i++) shapePool.push('rect');
  if (shapePool.length === 0) shapePool.push('rect'); // fallback

  
  const shapeCount = int(select('#shapeCountSlider').value());
  const minCount   = int(select('#shapeCountSlider').elt.min);
  const maxCount   = int(select('#shapeCountSlider').elt.max);

  // fewer shapes = bigger (2.0 → 0.25)
  const sizeFactor = map(shapeCount, minCount,maxCount , 2.0, 0.25);

   for (let i = 0; i < shapeCount; i++) {
    let w = random(width / 2 * sizeFactor);
    let h = random(height / 2 * sizeFactor);

    design.fg.push({
      shapeType: random(shapePool),
      x: random(width),
      y: random(height),
      w: w,
      h: h,
      rotation: random(TWO_PI),
      fill: sampleColor(inspiration.image)
    });
  }

  return design;
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();

  for (let shape of design.fg) {
    push();
    translate(shape.x + shape.w / 2, shape.y + shape.h / 2);
    rotate(shape.rotation);
    fill(shape.fill[0], shape.fill[1], shape.fill[2], 128);
    if (shape.shapeType === 'rect') {
      rect(-shape.w / 2, -shape.h / 2, shape.w, shape.h);
    } else if (shape.shapeType === 'ellipse') {
      ellipse(0, 0, shape.w, shape.h);
    } else if (shape.shapeType === 'triangle') {
      triangle(
        -shape.w / 2, shape.h / 2,
        0, -shape.h / 2,
        shape.w / 2, shape.h / 2
      );
    } else if (shape.shapeType === 'line') {
      stroke(shape.fill[0], shape.fill[1], shape.fill[2], 180);
      strokeWeight(2);
      line(-shape.w / 2, -shape.h / 2, shape.w / 2, shape.h / 2);
      noStroke(); // reset for the next shape
    } else if (shape.shapeType === 'arc') {
      arc(0, 0, shape.w, shape.h, 0, PI + QUARTER_PI, PIE);
    } else if (shape.shapeType === 'quad') {
      quad(
        -shape.w / 2, -shape.h / 2,
        shape.w / 2, -shape.h / 3,
        shape.w / 3, shape.h / 2,
        -shape.w / 3, shape.h / 3
      );
    } else if (shape.shapeType === 'star') {
      drawStar(0, 0, shape.w / 4, shape.w / 2, 5);
    }
    pop();
  }
}


function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for (let shape of design.fg) {
    shape.x = mut(shape.x, 0, width, rate);
    shape.y = mut(shape.y, 0, height, rate);
    shape.w = mut(shape.w, 0, width / 2, rate);
    shape.h = mut(shape.h, 0, height / 2, rate);
    shape.rotation = mut(shape.rotation, 0, TWO_PI, rate);
    if (random() < rate) {
      shape.fill = sampleColor(inspiration.image);
    }
  }
}


function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
