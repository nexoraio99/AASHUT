import { Component, useLayoutEffect, useRef, useState } from 'react';
import { animate, createTimeline } from 'animejs';
import ElectricLogo from './ElectricLogo';
import CrystalizedBall from './CrystalizedBall';
import { prefersReducedMotion } from '../prefs';

// The logo is two traced images so each can be sized on its own:
//   public/planet.png    Saturn mark, 1180 x 598, planet circle exactly at its centre
//   public/wordmark.png  aa|shut, 900 x 280
// Box sizes and positions are worked out in CSS (.stage in index.css) from these numbers.
// The CrystalizedBall sits inside the planet's circle.
const LOGO_SCALE = 0.52; // wordmark size: same as before the split
const PLANET_SCALE = 0.62; // planet size relative to the wordmark's scale
const BALL_SIZE = 0.62;
// Each logo fills this share of its box; the rest is room for the strands and glow.
const FIT = 0.75;

const LOGO_PROPS = {
  color: '#fff3ea',
  glowColor: '#80795b',
  scale: FIT,
  strands: 2,
  bend: 0.12,
  crackle: 0.25,
  arcs: 0,
  flicker: 0.04,
  speed: 0.5,
  thickness: 1.3,
  glow: 0.12,
  intensity: 1.1,
  cursorIntensity: 0.35,
  cursorRadius: 140,
  interactive: true
};

// If WebGL is unavailable (old device, disabled GPU, lost context), the live renderers throw on mount.
// Catch that here so the rest of the page still renders: the logo falls back to its flat artwork,
// the plasma ball is simply left out. Nothing to tell the visitor; the page reads the same.
class WebGLFallback extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn('Hero WebGL unavailable, showing static artwork.', error);
  }

  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children;
  }
}

const StaticMark = ({ src }) => (
  <img src={src} alt="" style={{ width: `${FIT * 100}%`, height: 'auto', margin: 'auto', position: 'absolute', inset: 0 }} />
);

// Intro, in order:
//   1. the plasma ball strikes on like a tube: a few uneven flickers, then it holds and its core charges
//   2. a shockwave leaves the planet and an electric front races outward, igniting the rings, then the wordmark
//   3. the bloom settles and the page chrome (nav, footer line) fades in
export default function HeroStage() {
  const [ballOn, setBallOn] = useState(false);
  // Planet ignites from its centre; the wordmark from just above it, as if the charge drops down into it.
  const revealRef = useRef({ sweep: 0, ox: 0, oy: 0, pulse: 0 });
  const wordRevealRef = useRef({ sweep: 0, ox: 0, oy: -0.9, pulse: 0 });
  const ballRef = useRef(null);

  useLayoutEffect(() => {
    const rv = revealRef.current;
    const wv = wordRevealRef.current;
    const reduce = prefersReducedMotion();
    if (reduce) {
      rv.sweep = 1;
      wv.sweep = 1;
      setBallOn(true);
      return undefined;
    }

    rv.sweep = 0;
    wv.sweep = 0;
    const chrome = ['.nav', '.hero__foot > *'];
    const ball = ballRef.current;
    // Hidden before first paint; the timeline brings each in.
    ball.style.opacity = '0';
    chrome.forEach(sel => document.querySelectorAll(sel).forEach(el => (el.style.opacity = '0')));

    const tl = createTimeline({ autoplay: true })
      .call(() => setBallOn(true), 120)
      // Tube strike: uneven flickers, then on.
      .add(
        ball,
        {
          opacity: [
            { to: 0.55, duration: 70, ease: 'linear' },
            { to: 0.08, duration: 90, ease: 'linear' },
            { to: 0.8, duration: 60, ease: 'linear' },
            { to: 0.3, duration: 120, ease: 'linear' },
            { to: 1, duration: 260, ease: 'out(2)' }
          ],
          scale: { from: 0.9, to: 1, duration: 1600, ease: 'out(4)' },
          filter: { from: 'blur(10px) brightness(1.8)', to: 'blur(0px) brightness(1)', duration: 1400, ease: 'out(3)' }
        },
        160
      )
      // Shockwave from the planet as it catches.
      .call(() => {
        rv.pulse += 1;
      }, 700)
      // Electric front sweeps out across the rings, then carries down into the wordmark.
      .add(rv, { sweep: [0, 1], duration: 1800, ease: 'inOut(2.4)' }, 620)
      .add(wv, { sweep: [0, 1], duration: 1500, ease: 'inOut(2)' }, 1550)
      .add('.nav', { opacity: [0, 1], y: [-12, 0], duration: 900, ease: 'out(3)' }, 2300)
      .add('.hero__foot > *', { opacity: [0, 1], y: [14, 0], duration: 900, delay: (_, i) => i * 90, ease: 'out(3)' }, 2350);

    return () => {
      tl.revert();
      chrome.forEach(sel => document.querySelectorAll(sel).forEach(el => el.style.removeProperty('opacity')));
      rv.sweep = 1;
      wv.sweep = 1;
    };
  }, []);

  return (
    <div
      className="stage"
      style={{ '--logo-scale': LOGO_SCALE, '--planet-scale': PLANET_SCALE, '--ball-size': BALL_SIZE, '--fit': FIT }}
    >
      <div className="stage__ball">
        <div className="stage__ballInner" ref={ballRef}>
          {ballOn && (
            <WebGLFallback>
            <CrystalizedBall
              preset="plasma"
              color="#ff5e03"
              size={BALL_SIZE}
              crackle={0.3}
              flares={0.2}
              sparks={0.12}
              sway={0.15}
              twinkle={0.2}
              speed={0.45}
              dustSpeed={0.4}
              fill={0.5}
              interactive
              hoverStrength={0.35}
            />
            </WebGLFallback>
          )}
        </div>
      </div>
      {/* Calm neon: two tight strands, almost no bend or crackle, no stray arcs, slow and steady. */}
      <div className="stage__planet">
        <WebGLFallback fallback={<StaticMark src="/planet.png" />}>
          <ElectricLogo src="/planet.png" {...LOGO_PROPS} revealRef={revealRef} />
        </WebGLFallback>
      </div>
      <div className="stage__wordmark">
        <WebGLFallback fallback={<StaticMark src="/wordmark.png" />}>
          <ElectricLogo src="/wordmark.png" {...LOGO_PROPS} revealRef={wordRevealRef} />
        </WebGLFallback>
      </div>
    </div>
  );
}
