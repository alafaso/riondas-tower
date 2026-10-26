const galleryVideos = Array.from(document.querySelectorAll("#gallery video"));

galleryVideos.forEach((v) => {
  v.addEventListener("click", () => {
    if (v.paused) {
      galleryVideos.forEach((o) => {
        if (o !== v) {
          o.pause();
          o.currentTime = 0;
        }
      });
      v.play();
    } else {
      v.pause();
    }
  });
  v.addEventListener("ended", () => {
    v.currentTime = 0;
  });
});
