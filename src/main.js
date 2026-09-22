import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './vendor/hero.scss';
import './vendor/drawer.css';
import './vendor/number-flow.css';
import './vendor/stacked.css';
import './vendor/aura.css';
import './vendor/progressive-blur.css';
import './vendor/button.css';
import './vendor/swup.css';
import './vendor/reveal.css';
import './vendor/accordion.css';
import './vendor/card-stack.css';
import './vendor/infinite-carousel.css';
import './vendor/parallax-carousel.css';
import './vendor/color-fill-button.css';
import './vendor/slide-text-button.css';
import './vendor/scramble-text.css';
import './vendor/liquid-popover.css';
import './styles/site.css';
import { button01 } from './vendor/slide-text-button.js';
import { textReveal05 } from './vendor/scramble-text.js';
import { menu01 } from './vendor/liquid-popover.js';
import { draggableCardStack } from './vendor/card-stack.js';
import { infiniteCardCarousel } from './vendor/infinite-carousel.js';
import { parallaxCarousel } from './vendor/parallax-carousel.js';
import { cinematicMediaHero } from './vendor/hero.js';
import { stackedScrollPanels } from './vendor/stacked.js';
import { initStatisticNumber } from './vendor/number-flow.js';
import { auraBorder } from './vendor/aura.js';
import { textReveal06 } from './vendor/reveal.js';
import { swup } from './vendor/swup.js';

// Site integration only. The supplied animation implementations live in vendor/.
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis({ autoRaf: false, lerp: 0.12, smoothWheel: !matchMedia('(prefers-reduced-motion: reduce)').matches });
const updateLenis = (time) => lenis.raf(time * 1000);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(updateLenis);
gsap.ticker.lagSmoothing(0);

const drawerRoot = document.querySelector('[data-drawer-navigation]');
const toggle = drawerRoot.querySelector('[data-toggle]');
const drawer = drawerRoot.querySelector('.drawer');
const cover = drawerRoot.querySelector('.cover');
let drawerOpen = false;
let drawerTimer;
let drawerFrame;
let priorFocus;
function setDrawer(open, restoreFocus = true) {
  if (open === drawerOpen) return;
  clearTimeout(drawerTimer);
  cancelAnimationFrame(drawerFrame);
  const page = document.querySelector('#swup');
  drawerOpen = open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  drawer.setAttribute('aria-hidden', String(!open));
  drawer.inert = !open;
  page.inert = open;
  if (open) {
    priorFocus = document.activeElement;
    drawerRoot.setAttribute('data-active', '');
    lenis.stop();
    drawerFrame = requestAnimationFrame(() => {
      if (!drawerOpen) return;
      drawerRoot.setAttribute('data-open', '');
      drawer.querySelector('a')?.focus({preventScroll:true});
    });
  } else {
    drawerRoot.removeAttribute('data-open');
    lenis.start();
    drawerTimer = setTimeout(() => drawerRoot.removeAttribute('data-active'), 510);
    if (restoreFocus && priorFocus?.isConnected) priorFocus.focus({preventScroll:true});
  }
}
toggle.addEventListener('click', () => setDrawer(!drawerOpen));
cover.addEventListener('click', () => setDrawer(false));
drawer.addEventListener('click', event => {
  // Let delegated navigation and the link default action run before making
  // the clicked link inert. Internal Swup visits also close in visit:start.
  if (event.target.closest('a')) setTimeout(() => setDrawer(false, false), 0);
});
document.addEventListener('keydown', event => {
  if (!drawerOpen) return;
  if (event.key === 'Escape') { event.preventDefault(); setDrawer(false); }
  if (event.key === 'Tab') {
    const items = [toggle, ...drawer.querySelectorAll('a[href]')];
    const current = items.indexOf(document.activeElement);
    const next = event.shiftKey ? (current - 1 + items.length) % items.length : (current + 1) % items.length;
    event.preventDefault(); items[next].focus();
  }
});

const auraRoot = document.querySelector('[data-aura-border]');
let aura;
try {
  auraBorder(auraRoot);
  aura = auraRoot.__auraBorder;
} catch (error) {
  auraRoot.dataset.state = 'unsupported';
  console.warn('Contact glow unavailable; navigation remains available.', error);
}
// The supplied renderer tracks its own descendant origin marker.
// Position that marker over the actual clicked contact control.
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link || new URL(link.href).pathname !== '/contact/') return;
  const rect = link.getBoundingClientRect();
  const marker = auraRoot.querySelector('[data-aura-origin]');
  marker.style.left = `${rect.left + rect.width / 2}px`;
  marker.style.top = `${rect.top + rect.height / 2}px`;
}, {capture:true});

let cleanupPage = () => {};
let generation = 0;
async function initSwappedContent() {
  const run = ++generation;
  await document.fonts.ready;
  if (run !== generation) return;
  const scope = document.querySelector('#swup');
  const cleanups = [];
  // Keep the gradient phrase intact so the paid sweep paints across real text.
  // The hero's character splitting remains in place for the rest of the title.
  const phrase = scope.querySelector('[data-hero-gradient]');
  const title = phrase?.parentElement;
  const titleLabel = title?.innerText.replace(/\s+/g, ' ').trim();
  phrase?.remove();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroNav = scope.querySelector('[data-hero-section-01] .content > p');
  if (heroNav) heroNav.setAttribute('data-hero-nav', '');
  if (reducedMotion) scope.querySelectorAll('[data-hero-section-01] video').forEach(video => { video.pause(); video.removeAttribute('autoplay'); });
  const hero = reducedMotion ? null : cinematicMediaHero(scope, { lenis });
  if (phrase) {
    title.append(phrase);
    title.setAttribute('aria-label', titleLabel);
  }
  if (hero) cleanups.push(hero);
  const loader = scope.querySelector('.hero-section-01 .loader');
  if (phrase && loader && !reducedMotion) {
    phrase.style.visibility = 'hidden';
    const reveal = () => {
      if (loader.style.display !== 'none') return;
      observer.disconnect();
      phrase.setAttribute('data-reveal-06', '');
      phrase.style.setProperty('--reveal-resting-color', '#fff');
      phrase.style.setProperty('--reveal-delay', '0s');
      phrase.style.removeProperty('visibility');
      phrase.classList.add('is-revealed');
    };
    const observer = new MutationObserver(reveal);
    observer.observe(loader, { attributes: true, attributeFilter: ['style'] });
    reveal();
    cleanups.push(() => observer.disconnect());
  }

  if (!reducedMotion) cleanups.push(stackedScrollPanels(scope));
  scope.querySelectorAll('[data-number-flow-stat]').forEach(root => {
    initStatisticNumber(root);
    root.closest('.metric').classList.add('number-ready');
    cleanups.push(() => root.__numberFlowStatisticCleanup?.());
  });
  cleanups.push(textReveal06(scope));
  button01(scope);
  if (!reducedMotion) {
    const contexts = [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        contexts.push(gsap.context(() => textReveal05({querySelectorAll: () => [entry.target]}), entry.target));
      });
    }, {threshold: 0.2});
    scope.querySelectorAll('[data-reveal-05]').forEach(el => observer.observe(el));
    cleanups.push(() => { observer.disconnect(); contexts.forEach(context => context.revert()); });
  }
  menu01(scope);
  scope.querySelectorAll('[data-menu-01]').forEach(root => cleanups.push(() => root.menu01Cleanup?.()));
  const controller = new AbortController();
  cleanups.push(() => controller.abort());
  draggableCardStack(scope);
  if (!reducedMotion) { infiniteCardCarousel(scope); parallaxCarousel(scope); }
  scope.querySelectorAll('[data-card-stack]').forEach(root => cleanups.push(() => root.draggableCardStackCleanup?.()));
  scope.querySelectorAll('[data-parallax-carousel]').forEach(root => cleanups.push(() => root.parallaxCarouselCleanup?.()));
  scope.querySelectorAll('[data-stack-step]').forEach(button => button.addEventListener('click', () => {
    button.closest('.stack-showcase').querySelector('[data-stack-deck]').dispatchEvent(new KeyboardEvent('keydown', {key: Number(button.dataset.stackStep) > 0 ? 'ArrowRight' : 'ArrowLeft', bubbles:true}));
  }, {signal:controller.signal}));
  scope.querySelectorAll('[data-card-carousel]').forEach(root => {
    const button=root.closest('.carousel-section').querySelector('[data-carousel-pause]');
    let paused=reducedMotion;
    const apply=() => {
      root.classList.toggle('is-paused',paused);
      button.setAttribute('aria-pressed',String(paused));
      button.textContent=paused?'Play motion':'Pause motion';
      if(paused) root.infiniteCardCarouselCleanup?.();
      else infiniteCardCarousel(root.parentElement);
    };
    apply();
    button.addEventListener('click',()=>{paused=!paused;apply();},{signal:controller.signal});
    root.addEventListener('focusin',()=>{if(!paused){paused=true;apply();}},{signal:controller.signal});
    root.addEventListener('click',event=>{if(root.querySelector('.is-dragging'))event.preventDefault();},{signal:controller.signal,capture:true});
    cleanups.push(()=>root.infiniteCardCarouselCleanup?.());
  });
  const heroVideo=scope.querySelector('[data-hero-section-01] video');
  const videoButton=scope.querySelector('[data-video-toggle]');
  if(heroVideo && videoButton){
    let userPaused=reducedMotion;
    const update=()=>{videoButton.textContent=userPaused?'Play video':'Pause video';videoButton.setAttribute('aria-pressed',String(userPaused));};
    heroVideo.addEventListener('play',()=>{if(userPaused)heroVideo.pause();},{signal:controller.signal});
    videoButton.addEventListener('click',()=>{userPaused=!userPaused;if(userPaused)heroVideo.pause();else heroVideo.play().catch(()=>{});update();},{signal:controller.signal});
    update();
  }

  scope.querySelectorAll('[data-page-video]').forEach(video => {
    const button=video.closest('.media-hero').querySelector('[data-page-video-toggle]');
    if(reducedMotion)video.pause();
    const update=()=>{button.textContent=video.paused?'Play video':'Pause video';button.setAttribute('aria-pressed',String(video.paused));};
    button.addEventListener('click',()=>{if(video.paused)video.play().catch(()=>{});else video.pause();},{signal:controller.signal});
    video.addEventListener('play',update,{signal:controller.signal});video.addEventListener('pause',update,{signal:controller.signal});update();
    cleanups.push(()=>video.pause());
  });
  scope.querySelectorAll('[data-filter-scope]').forEach(group => {
    let category = 'All';
    const search = group.querySelector('[data-search-input]');
    const items = [...group.querySelectorAll('[data-category]')];
    const update = () => {
      const query = (search?.value || '').trim().toLowerCase();
      let visible = 0;
      items.forEach(item => {
        item.hidden = !(category === 'All' || item.dataset.category === category) || !(item.dataset.search || item.textContent).toLowerCase().includes(query);
        if (!item.hidden) visible++;
      });
      group.querySelector('[data-empty]').hidden = visible > 0;
      const counter = group.querySelector('[data-result-count]');
      if (counter) counter.textContent = `${visible} ${visible === 1 ? 'product' : 'products'}`;
    };
    group.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      category = button.dataset.filter;
      group.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      update(); lenis.resize(); ScrollTrigger.refresh();
    }, {signal: controller.signal}));
    search?.addEventListener('input', update, {signal: controller.signal});
    update();
  });
  document.querySelectorAll('.desktop-nav a').forEach(a => {
    if(location.pathname.startsWith(new URL(a.href).pathname)) a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  });
  cleanupPage = () => cleanups.reverse().forEach(cleanup => cleanup?.());
  scope.querySelectorAll('img').forEach(img => {
    if (!img.complete) img.addEventListener('load', () => ScrollTrigger.refresh(), {once:true});
  });
  lenis.resize();
  ScrollTrigger.refresh();
}

let glowTimer;
let glowFadeTimer;
function clearContactGlow() {
  clearTimeout(glowTimer); clearTimeout(glowFadeTimer);
  aura?.setActive(false);
  auraRoot.classList.remove('is-visible');
}
function showContactGlow() {
  if (location.pathname !== '/contact/' || !aura) return;
  clearContactGlow();
  auraRoot.classList.add('is-visible');
  aura.setActive(true);
  glowTimer = setTimeout(() => {
    aura.setActive(false);
    glowFadeTimer = setTimeout(() => auraRoot.classList.remove('is-visible'), 200);
  }, 2500);
}
swup.hooks.on('visit:start', () => {
  if (import.meta.env.DEV) document.querySelectorAll('style[data-vite-dev-id]').forEach(style => style.setAttribute('data-swup-theme', ''));
  setDrawer(false, false);
  clearContactGlow();
});
swup.hooks.before('content:replace', () => { ++generation; cleanupPage(); });
swup.hooks.on('content:replace', () => initSwappedContent());
swup.hooks.on('page:view', () => { lenis.resize(); ScrollTrigger.refresh(); });
swup.hooks.on('visit:end', () => {
  showContactGlow();
  const page = document.querySelector('#swup');
  page.setAttribute('tabindex', '-1');
  page.focus({preventScroll:true});
});
// Bridge the shared Lenis instance to Swup's native scroll positions.
swup.hooks.on('content:scroll', () => { lenis.scrollTo(window.scrollY, {immediate:true}); });
window.addEventListener('pagehide', () => {
  ++generation; cleanupPage(); clearContactGlow(); aura?.destroy();
  clearTimeout(drawerTimer);
  cancelAnimationFrame(drawerFrame);
  gsap.ticker.remove(updateLenis); lenis.off('scroll', ScrollTrigger.update); lenis.destroy();
}, {once:true});
initSwappedContent();
showContactGlow();
