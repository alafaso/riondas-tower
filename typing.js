const TEXT = [
  "It\u2019s kind of funny.",
  "It\u2019s funny to visit Rionda\u2019s tower in 2026. It\u2019s funny because of how vastly different the experience is now than it used to be. The tower was built as a functioning water tower, then became an (involuntary) party venue for teenagers in the 1970s, and then simply a myth of ghostly design. If you visit the tower, the man who built it\u2019s dead wife will show up! If you drive around in a circle 3 to 6 times, she will kill you! She who simply married the architect who owned the surrounding farms. She was innocent once, only a fellow immigrant who loved her husband, and simply died of natural causes. She, who now haunts the narrative of a nothing experience. Nothing resides at Rionda\u2019s tower nowadays. Only the promise of what once was. And the memory of Harriet.",
  "I\u2019m a little bit sorry, Harriet."
].join("\n\n");

let started = false;

function type() {
  const el = document.getElementById("typed");
  const textNode = document.createTextNode("");
  const caret = document.createElement("span");
  caret.className = "caret";
  el.appendChild(textNode);
  el.appendChild(caret);
  let i = 0;
  function step() {
    if (i >= TEXT.length) {
      caret.remove();
      return;
    }
    const ch = TEXT[i++];
    textNode.nodeValue += ch;
    let delay = 26;
    if (ch === "." || ch === "!" || ch === "?") delay = 340;
    else if (ch === ",") delay = 120;
    else if (ch === "\n") delay = 450;
    setTimeout(step, delay);
  }
  step();
}

function maybeStart() {
  if (started) return;
  const r = document.getElementById("page2").getBoundingClientRect();
  if (r.top < window.innerHeight * 0.6 && r.bottom > 0) {
    started = true;
    type();
  }
}

const page2Observer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      maybeStart();
      page2Observer.disconnect();
    }
  }
}, { threshold: 0.4 });

page2Observer.observe(document.getElementById("page2"));
window.addEventListener("scroll", maybeStart, { passive: true });
maybeStart();
