const LABEL = "CLICK TO REMOVE HARRIET";

let portrait;
let removedImg;
let layer;
let label;
let current;
let ghostImg;
let haunting = false;
let ghostX = 0;
let ghostY = 0;
let ghostFace = 1;

function preload() {
  portrait = loadImage(PORTRAIT_DATA);
  removedImg = loadImage(REMOVED_DATA);
  ghostImg = loadImage(encodeURI("assets/harriet by herself.png"));
}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  portrait.filter(GRAY);
  removedImg.filter(GRAY);
  ghostImg.filter(GRAY);
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

  const vo = document.getElementById("vo");
  let actx = null;
  let decoded = null;
  let curSrc = null;
  let stopTimer = null;
  fetch(encodeURI("assets/devils tower poem.m4a"))
    .then((r) => r.arrayBuffer())
    .then((ab) => {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      return actx.decodeAudioData(ab);
    })
    .then((b) => {
      decoded = b;
    })
    .catch(() => {});

  function playWord(s, e) {
    if (decoded && actx) {
      if (curSrc) {
        try {
          curSrc.stop();
        } catch (err) {}
      }
      if (actx.state === "suspended") actx.resume();
      const src = actx.createBufferSource();
      src.buffer = decoded;
      src.connect(actx.destination);
      src.start(0, max(0, s - 0.02), e - s + 0.06);
      curSrc = src;
    } else {
      vo.pause();
      vo.currentTime = max(0, s - 0.02);
      vo.play();
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => vo.pause(), (e - s + 0.06) * 1000);
    }
  }

  document.querySelectorAll("#poem .w").forEach((el) => {
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const s = parseFloat(el.dataset.s);
      const e = parseFloat(el.dataset.e);
      if (!isNaN(s) && !isNaN(e)) playWord(s, e);
    });
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
  return { x: (width - (tw + 32)) / 2, y: height - 134, w: tw + 32, h: 48 };
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

  if (haunting) drawGhost();
}

function drawGhost() {
  const off = min(width, height) * 0.22;
  const tx = mouseX + (mouseX < width / 2 ? off : -off);
  const ty = mouseY + off * 0.5;
  const ease = 0.045;
  const dx = tx - ghostX;
  ghostX += dx * ease;
  ghostY += (ty - ghostY) * ease;
  if (abs(dx) > 1.5) ghostFace = dx > 0 ? 1 : -1;

  const gw = min(width, height) * 0.16;
  const gh = gw * (ghostImg.height / ghostImg.width);
  const flick = 150 + sin(frameCount * 0.18) * 35 + sin(frameCount * 0.47) * 20;

  push();
  translate(ghostX, ghostY);
  rotate(sin(frameCount * 0.02) * 0.06);
  scale(ghostFace, 1);
  tint(255, flick);
  imageMode(CENTER);
  image(ghostImg, 0, 0, gw, gh);
  pop();
  imageMode(CORNER);
}

function mousePressed(event) {
  if (
    event &&
    event.target &&
    event.target.closest &&
    (event.target.closest(".scroll-arrow") || event.target.closest("#video-modal"))
  )
    return;
  const r = imageRect();
  if (mouseX < r.x || mouseX > r.x + r.w || mouseY < r.y || mouseY > r.y + r.h) return;
  current = current === portrait ? removedImg : portrait;
  haunting = current === removedImg;
  if (haunting) {
    const r = imageRect();
    ghostX = r.x + r.w / 2;
    ghostY = r.y + r.h / 2;
  }
  drawCurrent();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layer = createGraphics(windowWidth, windowHeight);
  drawCurrent();
  label = makeLabel();
}
