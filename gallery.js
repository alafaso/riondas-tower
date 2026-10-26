const galleryVideos = Array.from(document.querySelectorAll("#gallery video"));

const overlay = document.createElement("div");
overlay.id = "video-modal";
document.body.appendChild(overlay);

function closeModal() {
  overlay.classList.remove("open");
  overlay.innerHTML = "";
}

function openModal(src, title) {
  overlay.innerHTML = "";
  const cap = document.createElement("div");
  cap.className = "modal-caption";
  cap.textContent = title;
  const vid = document.createElement("video");
  vid.src = src;
  vid.controls = true;
  vid.autoplay = true;
  vid.playsInline = true;
  const close = document.createElement("button");
  close.id = "modal-close";
  close.setAttribute("aria-label", "Close");
  close.textContent = "\u00d7";
  overlay.appendChild(cap);
  overlay.appendChild(vid);
  overlay.appendChild(close);
  overlay.classList.add("open");
  vid.play();
}

galleryVideos.forEach((v) => {
  v.addEventListener("click", () => {
    openModal(v.src, v.closest("figure").querySelector("figcaption").textContent);
  });
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay || e.target.id === "modal-close") closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
