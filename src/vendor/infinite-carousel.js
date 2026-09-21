import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);


function infiniteCardCarousel(scope = document) {
  const roots = scope.querySelectorAll("[data-card-carousel]");


  roots.forEach((root) => {
    root.infiniteCardCarouselCleanup?.();


    const track = root.querySelector("[data-carousel-track]");
    const cards = track
      ? [...track.querySelectorAll("[data-carousel-card]")]
      : [];


    if (!track || cards.length < 4 || cards.length % 2 !== 0) return;


    const motion = {
      speedDivisor: 20.5,
      pressScale: 0.955,
      responseDuration: 0.48,
      dragClassDelay: 190,
    };
    const direction = root.dataset.direction === "right" ? -1 : 1;


    let distance = 0;
    let loopWidth = Math.max(track.clientWidth / 2, 1);
    let inputObserver;
    let dragClassTimer;
    let tickerActive = false;
    let dragged = false;


    const wrapX = (value) =>
      gsap.utils.wrap(-loopWidth, 0, Number.parseFloat(value));
    const moveX = gsap.quickTo(track, "x", {
      duration: motion.responseDuration,
      ease: "power3.out",
      modifiers: {
        x: gsap.utils.unitize(wrapX),
      },
    });
    const pressTween = gsap.to(cards, {
      scale: motion.pressScale,
      duration: motion.responseDuration,
      ease: "power1.inOut",
      paused: true,
    });


    const measure = () => {
      loopWidth = Math.max(track.clientWidth / 2, 1);
      moveX(distance);
    };


    const clearDragState = () => {
      track.classList.remove("is-pressed");
      pressTween.reverse();


      window.clearTimeout(dragClassTimer);
      if (!dragged) return;


      dragClassTimer = window.setTimeout(() => {
        track.classList.remove("is-dragging");
      }, motion.dragClassDelay);
    };


    const startInput = () => {
      if (inputObserver) return;


      inputObserver = Observer.create({
        target: track,
        type: "pointer,touch",
        onPress: () => {
          dragged = false;
          window.clearTimeout(dragClassTimer);
          track.classList.add("is-pressed");
          pressTween.play();
        },
        onDrag: (observer) => {
          distance += observer.deltaX;
          moveX(distance);


          if (!dragged) {
            dragged = true;
            track.classList.add("is-dragging");
          }
        },
        onRelease: clearDragState,
        onStop: clearDragState,
      });
    };


    const stopInput = () => {
      inputObserver?.kill();
      inputObserver = undefined;
      dragged = false;
      window.clearTimeout(dragClassTimer);
      track.classList.remove("is-pressed", "is-dragging");
      pressTween.reverse();
    };


    const tick = (_time, deltaTime) => {
      distance -= (deltaTime / motion.speedDivisor) * direction;
      moveX(distance);
    };


    const startTicker = () => {
      if (tickerActive) return;
      gsap.ticker.add(tick);
      tickerActive = true;
    };


    const stopTicker = () => {
      if (!tickerActive) return;
      gsap.ticker.remove(tick);
      tickerActive = false;
    };


    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startInput();
          startTicker();
        } else {
          stopInput();
          stopTicker();
        }
      });
    });
    const sizeObserver = new ResizeObserver(measure);


    measure();
    visibilityObserver.observe(track);
    sizeObserver.observe(track);


    root.infiniteCardCarouselCleanup = () => {
      stopInput();
      stopTicker();
      visibilityObserver.disconnect();
      sizeObserver.disconnect();
      pressTween.kill();
      gsap.killTweensOf(track);
      gsap.killTweensOf(cards);
      gsap.set(track, { clearProps: "transform" });
      gsap.set(cards, { clearProps: "transform" });
      delete root.infiniteCardCarouselCleanup;
    };
  });
}
export { infiniteCardCarousel };
