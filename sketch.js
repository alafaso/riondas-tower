const LABEL = "CLICK TO REMOVE HARRIET";

let portrait;
let removedImg;
let layer;
let label;
let current;

function preload() {
  portrait = loadImage(PORTRAIT_DATA);
  removedImg = loadImage(REMOVED_DATA);
}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  portrait.filter(GRAY);
  removedImg.filter(GRAY);
  current = portrait;
  layer = createGraphics(windowWidth, windowHeight);
  drawCurrent();
  textFont("Helvetica");
  textSize(22);
  label = makeLabel();

  const v = document.getElementById("footage");
  try {
    v.play();
  } catch (e) {}
  window.addEventListener("click", () => {
    if (v.paused) {
      try {
        v.play();
      } catch (e) {}
    }
  });
}

function imageRect() {
  const s = min(width / current.width, height / current.height) * 0.94;
  const w = current.width * s;
  const h = current.height * s;
  return { x: (width - w) / 2, y: (height - h) / 2, w: w, h: h };
}

function drawCurrent() {
  layer.clear();
  const r = imageRect();
  layer.image(current, r.x, r.y, r.w, r.h);
}

function makeLabel() {
  const tw = textWidth(LABEL);
  return { x: (width - (tw + 32)) / 2, y: height - 84, w: tw + 32, h: 48 };
}

function draw() {
  clear();
  image(layer, 0, 0);

  noStroke();
  fill(255);
  rect(label.x, label.y, label.w, label.h);
  fill(0);
  textAlign(CENTER, CENTER);
  text(LABEL, width / 2, label.y + label.h / 2);
}

function mousePressed() {
  const r = imageRect();
  if (mouseX < r.x || mouseX > r.x + r.w || mouseY < r.y || mouseY > r.y + r.h) return;
  current = current === portrait ? removedImg : portrait;
  drawCurrent();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layer = createGraphics(windowWidth, windowHeight);
  drawCurrent();
  label = makeLabel();
}
