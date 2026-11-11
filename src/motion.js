import { useLayoutEffect } from 'react';
import { animate, createScope, onScroll, splitText, stagger, utils } from 'animejs';
import { prefersReducedMotion } from './prefs';

// All scroll motion on the page, driven by anime.js.
//
// Markup hooks:
//   [data-reveal]          fades up once when it enters (value = order within a group, for a small delay)
//   [data-split]           heading: each line slides up out of a mask, once, on enter
//   [data-stack="0.21"]    paragraph: words rise and settle one after another, scrubbed by scroll (value = stagger)
//   [data-stack-items]     list: its children stack in one after another, scrubbed by scroll
//   [data-parallax="8"]    moves -8% → 8% of its own height while its parent crosses the viewport
//   [data-parallax-x="-6"] same, horizontally
//   .hero__stage           the logo drifts down, shrinks and fades as the first screen scrolls away
//
// The OS "Reduce motion" setting is honoured only if RESPECT_REDUCED_MOTION is on (src/prefs.js).

const ONCE = { sync: 'play', repeat: false };

export function useMotion() {
  useLayoutEffect(() => {
    // Line splitting needs final font metrics, so set up once fonts are ready. Until then,
    // .motion-wait hides the animated elements (index.css) so nothing flashes in its final state.
    const root = document.documentElement;
    const reduce = prefersReducedMotion();
    let scope = null;
    let dead = false;
    if (!reduce) root.classList.add('motion-wait');
    const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise(r => setTimeout(r, 1500))]);
    fontsReady.then(() => {
      if (dead) return;
      scope = build();
      root.classList.remove('motion-wait');
    });
    return () => {
      dead = true;
      root.classList.remove('motion-wait');
      scope?.revert();
    };
  }, []);
}

function build() {
return createScope({
    mediaQueries: { hover: '(hover: hover)' }
  }).add(self => {
    if (prefersReducedMotion()) return undefined;

    // Headings: masked line reveal.
    utils.$('[data-split]').forEach(el => {
      splitText(el, { lines: { wrap: 'clip' } }).addEffect(({ lines }) =>
        animate(lines, {
          y: ['105%', '0%'],
          duration: 1100,
          delay: stagger(90),
          ease: 'out(4)',
          autoplay: onScroll({ target: el, enter: '92% top', ...ONCE })
        })
      );
    });

    // Paragraphs: stacking words, scrubbed.
    utils.$('[data-stack]').forEach(el => {
      const step = parseFloat(el.dataset.stack) || 0.21;
      const { words } = splitText(el, { words: { class: 'stack-word' } });
      animate(words, {
        opacity: [0, 1],
        y: ['0.8em', '0em'],
        rotate: [6, 0],
        duration: 1000,
        delay: stagger(1000 * step),
        ease: 'out(3)',
        autoplay: onScroll({ target: el, enter: '92% top', leave: '45% bottom', sync: 0.2 })
      });
    });

    // Lists: items stack in one after another, scrubbed.
    utils.$('[data-stack-items]').forEach(list => {
      animate(list.children, {
        opacity: [0, 1],
        y: [80, 0],
        duration: 1000,
        delay: stagger(240),
        ease: 'out(3)',
        autoplay: onScroll({ target: list, enter: 'bottom top', leave: '80% bottom', sync: 0.2 })
      });
    });

    // Genre names rise out of their rows, each scrubbed as its own row crosses the lower viewport.
    utils.$('.genres li').forEach(row => {
      animate(row.querySelector('.genres__name > span'), {
        y: ['110%', '0%'],
        ease: 'out(2)',
        autoplay: onScroll({ target: row, enter: 'bottom top', leave: '70% bottom', sync: 0.2 })
      });
    });

    // Simple fade-ups.
    utils.$('[data-reveal]').forEach(el => {
      animate(el, {
        opacity: [0, 1],
        y: [24, 0],
        duration: 900,
        delay: (parseFloat(el.dataset.reveal) || 0) * 90,
        ease: 'out(3)',
        autoplay: onScroll({ target: el, enter: '92% top', ...ONCE })
      });
    });

    // Parallax layers, measured against their (static) parent.
    utils.$('[data-parallax], [data-parallax-x]').forEach(el => {
      const y = parseFloat(el.dataset.parallax || '0');
      const x = parseFloat(el.dataset.parallaxX || '0');
      animate(el, {
        ...(y ? { y: [`${-y}%`, `${y}%`] } : {}),
        ...(x ? { x: [`${-x}%`, `${x}%`] } : {}),
        ease: 'linear',
        autoplay: onScroll({ target: el.parentElement, enter: 'bottom top', leave: 'top bottom', sync: true })
      });
    });

    // Hero scroll-away.
    const hero = document.querySelector('.hero');
    if (hero) {
      animate('.hero__stage', {
        y: ['0%', '30%'],
        scale: [1, 0.9],
        opacity: [1, 0],
        ease: 'linear',
        autoplay: onScroll({ target: hero, enter: 'top top', leave: 'top bottom', sync: 0.3 })
      });
    }

    return undefined;
  });
}
