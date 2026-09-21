// NPM only. CDN users: ignore this block.
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(CustomEase, Draggable);


function draggableCardStack(scope = document) {
  const roots = scope.querySelectorAll("[data-card-stack]");


  roots.forEach((root) => {
    root.draggableCardStackCleanup?.();


    const deck = root.querySelector("[data-stack-deck]");
    const dragProxy = root.querySelector("[data-stack-drag-proxy]");
    const cards = deck ? [...deck.querySelectorAll("[data-stack-card]")] : [];
    const captions = [...root.querySelectorAll("[data-stack-caption]")];


    if (
      !deck ||
      !dragProxy ||
      captions.length !== cards.length ||
      cards.length < 3
    ) {
      return;
    }


    const motion = {
      stepDuration: 0.64,
      releaseDuration: 1.1,
      minimumReleaseDuration: 0.6,
      cancelDuration: 0.24,
      handoffDuration: 0.3,
      releaseEase: "power3.out",
      commitDistance: 0.18,
      commitVelocity: 480,
      velocityWindow: 100,
      routeOffset: 0.765,
      rearOffset: 0.16,
      nearOffset: 0.065,
      perspective: 2.75,
      depth: 0.465,
      outgoingTilt: 44,
      incomingTilt: 19,
      stackRotation: 3.5,
      dragRotation: 5,
      outgoingScale: 0.952,
      deepOpacity: 0.59,
    };
    const stepEase = CustomEase.create("", "0.39,0,0.21,1");
    const controller = new AbortController();
    const setters = cards.map((card) => gsap.quickSetter(card, "css"));
    const stackOrder = cards.map((card, index) => index);
    const releases = new Map();
    const poses = [];
    const poseProperties = ["x", "y", "z", "rotation", "rotationY", "scale", "autoAlpha"];
    const state = {
      phase: "idle",
      progress: 0,
      startProgress: 0,
      targetProgress: 0,
      dragX: 0,
      dragY: 0,
      blend: 1,
      lift: 1,
    };


    let width = deck.clientWidth || 1;
    let activeIndex = 0;
    let direction = 1;
    let routeTarget = 0;
    let pressX = 0;
    let pressY = 0;
    let dragOrigin;
    let samples = [];
    let transition;
    let currentRelease;
    let releaseOrder = 0;
    let poseOffsets;
    let draggable;


    const clamp = (value, minimum, maximum) =>
      Math.min(Math.max(value, minimum), maximum);
    const lerp = (start, end, progress) => start + (end - start) * progress;
    const modulo = (value, count) => ((value % count) + count) % count;
    const wrappedDistance = (index, progress, target, step) => {
      let distance = modulo(index - target, cards.length);
      if (distance > cards.length / 2) distance -= cards.length;
      if (distance === cards.length / 2) distance *= -step;
      // Choose the wrap at the destination, so a visible settling card never
      // crosses the circular seam halfway through a gesture.
      return distance + target - progress;
    };


    const cardPose = (index, {
      progress = state.progress,
      target = routeTarget,
      step = direction,
      outgoing = index === activeIndex,
    } = {}) => {
      const relative = wrappedDistance(index, progress, target, step);
      const distance = Math.abs(relative);
      const midpoint = outgoing ? motion.routeOffset : motion.nearOffset;
      const turn = 1 - Math.abs((distance % 1) * 2 - 1);
      const fadeEnd = Math.min(2.16, cards.length / 2);
      const fadeStart = Math.min(2, fadeEnd - 0.16);
      let offset;
      let opacity = 1;


      if (distance <= 0.5) {
        offset = lerp(0, midpoint, distance * 2);
      } else if (distance <= 1) {
        offset = lerp(midpoint, motion.rearOffset, (distance - 0.5) * 2);
      } else {
        offset = motion.rearOffset +
          (distance - 1) * (motion.rearOffset - motion.nearOffset) * 2;
      }


      if (distance > fadeStart) {
        opacity = lerp(
          motion.deepOpacity,
          0,
          clamp((distance - fadeStart) / (fadeEnd - fadeStart), 0, 1),
        );
      } else if (distance > 1) {
        opacity = lerp(1, motion.deepOpacity, (distance - 1) / (fadeStart - 1));
      }


      return {
        x: Math.sign(relative) * offset * width,
        y: 0,
        z: -distance * width * motion.depth,
        rotation: relative * motion.stackRotation,
        rotationY: -turn * step *
          (outgoing ? motion.outgoingTilt : motion.incomingTilt),
        scale: outgoing && distance < 1
          ? lerp(1, motion.outgoingScale, turn)
          : 1,
        autoAlpha: opacity,
      };
    };


    const dragPose = () => ({
      x: dragOrigin.x + state.dragX,
      y: dragOrigin.y + state.dragY,
      z: lerp(dragOrigin.z, 0, state.lift),
      rotation: lerp(dragOrigin.rotation, 0, state.lift) +
        clamp(state.dragX / width, -1, 1) * motion.dragRotation,
      rotationY: lerp(dragOrigin.rotationY, 0, state.lift),
      scale: lerp(dragOrigin.scale, 1, state.lift),
      autoAlpha: lerp(dragOrigin.autoAlpha, 1, state.lift),
    });


    const releasePose = (release) => {
      const side = cardPose(release.index, {
        progress: release.midpoint,
        target: release.target,
        step: release.step,
        outgoing: true,
      });
      const returning = release.progress >= 0.5;
      const from = returning ? side : release.start;
      const to = returning ? cardPose(release.index, { outgoing: false }) : side;
      const progress = returning ? (release.progress - 0.5) * 2 : release.progress * 2;


      return Object.fromEntries(poseProperties.map((property) => [
        property,
        lerp(from[property], to[property], progress),
      ]));
    };


    const basePose = (index) => {
      if (state.phase === "dragging" && index === activeIndex) return dragPose();
      const release = releases.get(index);
      return release ? releasePose(release) : cardPose(index);
    };


    // Carry every rendered transform into the next gesture, including cards
    // still returning behind the stack. Never finish a tween to start a grab.
    const preservePoses = () => {
      transition?.kill();
      transition = undefined;
      poseOffsets = cards.map((card, index) => {
        const base = basePose(index);
        return Object.fromEntries(poseProperties.map((property) => [
          property,
          poses[index][property] - base[property],
        ]));
      });
      state.blend = 0;
    };


    const render = () => {
      cards.forEach((card, index) => {
        const pose = basePose(index);
        const held = state.phase === "dragging" && index === activeIndex;


        if (poseOffsets && !held) {
          for (const property of poseProperties) {
            pose[property] += poseOffsets[index][property] * (1 - state.blend);
          }
        }


        pose.autoAlpha = clamp(pose.autoAlpha, 0, 1);
        poses[index] = pose;
      });


      // Departing cards stay in front until they reach the side of the stack.
      // Depth alone can swap layers while a flat, freshly dragged card overlaps.
      stackOrder.sort((left, right) => {
        const leftRelease = releases.get(left);
        const rightRelease = releases.get(right);
        const leftLeaving = leftRelease && leftRelease.progress < 0.5;
        const rightLeaving = rightRelease && rightRelease.progress < 0.5;


        if (leftLeaving && rightLeaving) return rightRelease.order - leftRelease.order;
        if (leftLeaving || rightLeaving) return leftLeaving ? 1 : -1;


        const depth = poses[left].z - poses[right].z;
        if (depth !== 0) return depth;
        return Number(right === activeIndex) - Number(left === activeIndex) || left - right;
      });


      stackOrder.forEach((index, layer) => {
        setters[index]({ ...poses[index], zIndex: layer + 1 });
      });
    };


    const updateCaptions = (currentIndex) => {
      captions.forEach((caption, index) => {
        const relative = modulo(index - currentIndex, cards.length);
        caption.dataset.captionState = relative === 0
          ? "active"
          : relative === 1
            ? "next"
            : relative === cards.length - 1
              ? "previous"
              : "hidden";
        caption.setAttribute("aria-hidden", String(relative !== 0));
      });
    };


    const updateActiveCard = (currentIndex) => {
      deck.setAttribute("aria-label", `Card ${currentIndex + 1} of ${cards.length}`);


      cards.forEach((card, index) => {
        const isActive = index === currentIndex;
        card.dataset.active = String(isActive);
        card.setAttribute("aria-hidden", String(!isActive));
      });
    };


    const returnToIdle = () => {
      state.phase = "idle";
      state.progress = modulo(state.targetProgress, cards.length);
      state.startProgress = state.progress;
      state.targetProgress = state.progress;
      routeTarget = state.progress;
      activeIndex = state.progress;
      state.dragX = 0;
      state.dragY = 0;
      state.blend = 1;
      state.lift = 1;
      dragOrigin = undefined;
      poseOffsets = undefined;
      transition = undefined;
      root.dataset.dragging = "false";
      gsap.set(dragProxy, { x: 0, y: 0 });
      draggable.update();
      updateActiveCard(activeIndex);
      render();
    };


    const settleHandoff = () => {
      transition = gsap.to(state, {
        blend: 1,
        lift: 1,
        duration: motion.handoffDuration,
        ease: motion.releaseEase,
        onUpdate: render,
        onComplete: () => {
          poseOffsets = undefined;
          transition = undefined;
        },
      });
    };


    const beginGesture = () => {
      // The scene can change hands while each departing card finishes its arc.
      currentRelease = undefined;
      state.startProgress = state.targetProgress;
      state.progress = state.startProgress;
      activeIndex = modulo(state.startProgress, cards.length);
      routeTarget = state.startProgress + direction;
      dragOrigin = { ...poses[activeIndex] };
      releases.get(activeIndex)?.tween.kill();
      releases.delete(activeIndex);
      state.dragX = 0;
      state.dragY = 0;
      state.lift = 0;
      state.phase = "dragging";
      preservePoses();
    };


    const cancelDrag = () => {
      state.phase = "cancelling";
      routeTarget = state.startProgress;
      preservePoses();


      // Keep the card grabbable while it settles back into place.
      transition = gsap.to(state, {
        progress: state.startProgress,
        blend: 1,
        duration: motion.cancelDuration,
        ease: motion.releaseEase,
        overwrite: true,
        onUpdate: render,
        onComplete: returnToIdle,
      });
    };


    const releaseCard = (step, fromDrag = false, velocity = 0) => {
      const target = state.startProgress + step;
      const release = {
        index: activeIndex,
        order: releaseOrder++,
        step,
        target,
        fromProgress: state.progress,
        midpoint: state.startProgress + step * 0.5,
        progress: 0,
        start: { ...poses[activeIndex] },
      };
      direction = step;
      routeTarget = target;
      state.targetProgress = target;
      state.phase = "releasing";
      releases.set(activeIndex, release);
      currentRelease = release;
      preservePoses();
      updateCaptions(modulo(target, cards.length));
      updateActiveCard(modulo(target, cards.length));


      release.tween = gsap.to(release, {
        progress: 1,
        duration: fromDrag
          ? clamp(
            motion.releaseDuration * Math.abs(target - release.fromProgress) -
            Math.abs(velocity) * 0.00005,
            motion.minimumReleaseDuration,
            motion.releaseDuration,
          )
          : motion.stepDuration,
        ease: fromDrag ? motion.releaseEase : stepEase,
        onUpdate: () => {
          if (currentRelease === release) {
            const outward = Math.min(release.progress * 2, 1);
            const returning = Math.max((release.progress - 0.5) * 2, 0);
            state.progress = release.progress < 0.5
              ? lerp(release.fromProgress, release.midpoint, outward)
              : lerp(release.midpoint, target, returning);
            // Finish the drag-to-orbit correction before changing layers.
            state.blend = outward;
          }
          render();
        },
        onComplete: () => {
          releases.delete(release.index);
          if (currentRelease === release) {
            currentRelease = undefined;
            returnToIdle();
          }
        },
      });
    };


    const recordSample = (x) => {
      const time = performance.now();
      samples.push({ x, time });
      while (samples.length > 1 && time - samples[0].time > motion.velocityWindow) {
        samples.shift();
      }
    };


    const finishDrag = (event) => {
      if (state.phase !== "dragging") return;
      root.dataset.dragging = "false";
      recordSample(state.dragX);


      const first = samples[0];
      const last = samples[samples.length - 1];
      const velocity = (last.x - first.x) / Math.max(last.time - first.time, 1) * 1000;
      const flick = Math.abs(velocity) >= motion.commitVelocity;
      const cancelled = event?.type === "pointercancel" || event?.type === "touchcancel";


      if (cancelled || (!flick && Math.abs(state.dragX) < width * motion.commitDistance)) {
        // A press without movement must also settle an interrupted handoff.
        cancelDrag();
        return;
      }


      const intent = flick ? velocity : state.dragX;
      releaseCard(intent < 0 ? 1 : -1, true, velocity);
    };


    const move = (step) => {
      if (state.phase === "dragging") return;
      beginGesture();
      releaseCard(step);
    };


    [draggable] = Draggable.create(dragProxy, {
      trigger: deck,
      type: "x,y",
      cursor: "grab",
      activeCursor: "grabbing",
      minimumMovement: 1,
      dragResistance: 0,
      allowNativeTouchScrolling: false,
      onPress() {
        beginGesture();
        pressX = this.x;
        pressY = this.y;
        samples = [];
        recordSample(0);
        root.dataset.dragging = "true";
        settleHandoff();
        render();
      },
      onDrag() {
        state.dragX = this.x - pressX;
        state.dragY = this.y - pressY;
        const nextDirection = state.dragX === 0 ? direction : state.dragX < 0 ? 1 : -1;
        const changedDirection = nextDirection !== direction;
        direction = nextDirection;
        routeTarget = state.startProgress + direction;
        state.progress = state.startProgress + direction * Math.min(
          Math.abs(state.dragX) / (width * motion.routeOffset) * 0.5,
          0.48,
        );
        if (changedDirection) {
          preservePoses();
          settleHandoff();
        }
        recordSample(state.dragX);
        render();
      },
      onRelease: finishDrag,
    });


    root.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      event.stopPropagation();
      move(event.key === "ArrowRight" ? 1 : -1);
    }, { signal: controller.signal });


    const resizeObserver = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width || 1;
      gsap.set(cards, { transformPerspective: width * motion.perspective });
      render();
    });
    resizeObserver.observe(deck);


    gsap.set(cards, { transformPerspective: width * motion.perspective });
    updateCaptions(0);
    updateActiveCard(0);
    render();


    root.draggableCardStackCleanup = () => {
      transition?.kill();
      releases.forEach((release) => release.tween.kill());
      releases.clear();
      controller.abort();
      resizeObserver.disconnect();
      draggable.kill();
      root.dataset.dragging = "false";
      updateCaptions(0);
      gsap.set(cards, { clearProps: "transform,opacity,visibility,zIndex" });
      gsap.set(dragProxy, { clearProps: "transform" });
      delete root.draggableCardStackCleanup;
    };
  });
}
export { draggableCardStack };
