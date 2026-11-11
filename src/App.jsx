import HeroStage from './components/HeroStage';
import StackingWords from './components/StackingWords';
import { useMotion } from './motion';

const LINKS = {
  email: 'ashutdhapola123@gmail.com',
  phone: '+917498437616',
  phoneLabel: '+91 749 843 7616',
  soundcloud: 'https://soundcloud.com/ashu-dhapola',
  instagram: 'https://instagram.com/__aashut__dnb',
  facebook: 'https://facebook.com/ashutosh.dhapola.39'
};

// The four counts of the bar he chased as a dancer, mapped to how he got to DnB.
const COUNT = [
  { n: '1', title: 'The dancefloor', body: 'Freestyle, locking and popping. Always chasing the beat, trying to land the 1, 2, 3, 4 exactly.' },
  { n: '2', title: 'Dubstep', body: 'Skrillex in particular. Listening turned into wanting to know how those sounds were actually built.' },
  { n: '3', title: 'Behind the decks', body: 'Learning to DJ through house, tech house, techno, hard, funk and EDM.' },
  { n: '4', title: 'Drum & Bass', body: 'Jungle and DnB felt more alive, more raw, more real. He never looked back.' }
];

const SOUND = ['Drum & Bass', 'Jumpup', 'Dancefloor', 'Liquid', 'Jungle', 'Belgian'];

// Technical rider: what the venue / promoter provides.
const RIDER = [
  { qty: '1×', item: 'Mixer', spec: 'Pioneer DJM-900NXS / DJM-900NXS2 or later', note: 'Updated to the latest firmware' },
  { qty: '3×', item: 'Players', spec: 'Pioneer CDJ-900NXS or later', note: 'Latest firmware, connected via link cable' },
  { qty: '2×', item: 'Booth monitors', spec: 'Full-range', note: 'Rigged at ear level, left + right' },
  { qty: '1×', item: 'Power strip', spec: '4-outlet, 220V', note: 'With surge protection' },
  { qty: '1×', item: 'Solid table', spec: 'Stable, level surface', note: null },
  { qty: null, item: 'Stage covering', spec: 'Outdoor events', note: 'Mandatory', flag: true }
];

const GIGS = [
  { venue: 'Mir Commune', city: 'Goa' },
  { venue: 'Bailamos', city: 'Pune' },
  { venue: 'The Kuti Project', city: 'Pune' }
];

// A photograph in a fixed frame; the oversized image inside drifts with scroll.
function Photo({ src, alt, speed = 8, className = '', position }) {
  return (
    <div className={`photo ${className}`.trim()}>
      <img
        className="photo__img"
        src={src}
        alt={alt}
        loading="lazy"
        data-parallax={speed}
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}

function Marquee({ words, speed }) {
  const line = words.join(' · ') + ' · ';
  return (
    <div className="marquee__row" aria-hidden="true">
      <div className="marquee__track" data-parallax-x={speed}>
        <span>{line}</span>
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  );
}

// Booth plan, drawn like a stage plot: crowd at the top, DJ at the bottom,
// players 1 and 2, mixer, player 3, and a monitor on each side aimed at the DJ.
function BoothPlan() {
  const cdjs = [
    { x: 48, label: 'CDJ 1' },
    { x: 120, label: 'CDJ 2' },
    { x: 248, label: 'CDJ 3' }
  ];
  return (
    <svg className="plan__svg" viewBox="0 0 360 214" role="img" aria-label="Booth plan: CDJ 1, CDJ 2, mixer, CDJ 3 on one table, with left and right monitors aimed at the DJ">
      <text className="plan__note" x="180" y="12" textAnchor="middle">CROWD</text>
      <line className="plan__faint" x1="38" y1="24" x2="322" y2="24" strokeDasharray="2 4" />

      {/* monitors */}
      <rect className="plan__line" x="6" y="48" width="22" height="30" />
      <circle className="plan__line" cx="17" cy="63" r="6" />
      <text className="plan__note" x="17" y="92" textAnchor="middle">L</text>
      <rect className="plan__line" x="332" y="48" width="22" height="30" />
      <circle className="plan__line" cx="343" cy="63" r="6" />
      <text className="plan__note" x="343" y="92" textAnchor="middle">R</text>
      <line className="plan__faint" x1="28" y1="70" x2="168" y2="186" strokeDasharray="2 4" />
      <line className="plan__faint" x1="332" y1="70" x2="192" y2="186" strokeDasharray="2 4" />

      {/* table */}
      <rect className="plan__line" x="38" y="40" width="284" height="110" />

      {cdjs.map(c => (
        <g key={c.label}>
          <rect className="plan__line" x={c.x} y="50" width="64" height="90" />
          <rect className="plan__faint" x={c.x + 16} y="58" width="32" height="8" />
          <circle className="plan__line" cx={c.x + 32} cy="96" r="20" />
          <circle className="plan__faint" cx={c.x + 32} cy="96" r="6" />
          <text className="plan__label" x={c.x + 32} y="132" textAnchor="middle">{c.label}</text>
        </g>
      ))}

      {/* mixer */}
      <rect className="plan__accent" x="192" y="50" width="48" height="90" />
      {[202, 212, 222, 232].map(x => (
        <line key={x} className="plan__faint" x1={x - 2} y1="62" x2={x - 2} y2="104" />
      ))}
      <line className="plan__faint" x1="204" y1="114" x2="228" y2="114" />
      <text className="plan__label plan__label--accent" x="216" y="132" textAnchor="middle">DJM</text>

      {/* DJ position */}
      <circle className="plan__accent" cx="180" cy="190" r="7" />
      <text className="plan__note" x="180" y="210" textAnchor="middle">DJ</text>
    </svg>
  );
}

export default function App() {
  useMotion();

  return (
    <>
      <header className="nav">
        <a className="nav__mark" href="#top" aria-label="Aa|shut, back to top">
          <img src="/logo.svg" alt="" width="40" height="30" />
          <span>Aa|shut</span>
        </a>
        <nav aria-label="Sections">
          <a href="#story">Story</a>
          <a href="#sound">Sound</a>
          <a href="#gigs">Gigs</a>
          <a href="#rider">Rider</a>
        </nav>
        <a className="btn btn--primary btn--sm" href="#contact">Book</a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title" className="sr-only">Aa|shut, DJ and producer</h1>
          <div className="hero__stage">
            <HeroStage />
          </div>
          <div className="hero__foot">
            <p className="hero__role">
              DJ &amp; producer
              <span>India</span>
            </p>
            <p className="hero__genres">Drum &amp; Bass · Jungle · Liquid · Jumpup</p>
            <a className="hero__scroll" href="#story">
              Scroll
              <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden="true">
                <path d="M6 1v13M1 9l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          </div>
        </section>

        <section className="story section" id="story" aria-labelledby="story-title">
          <div className="story__grid">
            <figure className="story__media">
              <Photo
                src="/aashut.jpg"
                alt="Aa|shut in a black hooded jacket, arms crossed, against a steel shutter"
                position="20% 60%"
              />
              <figcaption data-reveal>
                <span>Aa|shut</span>
                <span className="muted">Ashutosh Dhapola</span>
              </figcaption>
            </figure>

            <div className="story__text">
              <p className="eyebrow" data-reveal>Story</p>
              <h2 id="story-title" className="display" data-split>
                It started on the dancefloor, <em>not behind the decks.</em>
              </h2>
              <StackingWords className="lede">
                Aa|shut is a DJ and producer from India. As a kid he was obsessed with freestyle, locking and popping, and
                that obsession with rhythm never left.
              </StackingWords>
              <StackingWords stagger={0.12}>
                Growing up on dubstep made him endlessly curious about how artists crafted those sounds. Curiosity turned
                into passion, and passion turned into purpose. He explored house, tech house, techno, hard, funk and EDM
                along the way, but nothing hit like Drum &amp; Bass. Not just a genre he loved: a calling he couldn&rsquo;t
                ignore.
              </StackingWords>
            </div>
          </div>

          <div className="steps">
            <p className="steps__label" data-reveal>
              <span>The count</span>
              <span className="muted">How he got here</span>
            </p>
            <ol data-stack-items aria-label="How he got here">
              {COUNT.map(step => (
                <li key={step.n}>
                  <span className="steps__n">{step.n}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="marquee">
          <Marquee words={['Drum & Bass', 'Jungle', 'Liquid', 'Jumpup']} speed="-6" />
          <Marquee words={['Dancefloor', 'Belgian', 'Open format', 'Bass']} speed="6" />
        </div>

        <section className="sound section" id="sound" aria-labelledby="sound-title">
          <div className="sound__grid">
            <figure className="sound__media">
              <Photo
                src="/aashut-live.jpg"
                alt="Aa|shut playing a set at the decks under purple club lights"
                speed={10}
                position="50% 50%"
              />
              <figcaption data-reveal>
                <span>Live</span>
                <span className="muted">Open format, read from the room</span>
              </figcaption>
            </figure>

            <div className="sound__body">
              <p className="eyebrow" data-reveal>Signature sound</p>
              <h2 id="sound-title" className="display" data-split>
                Open format, built for the dancefloor.
              </h2>
              <ol className="genres" aria-label="Genres">
                {SOUND.map((genre, i) => (
                  <li key={genre}>
                    <span className="genres__idx">{String(i + 1).padStart(2, '0')}</span>
                    <span className="genres__name">
                      <span>{genre}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <figure className="band" aria-label="Client feedback">
          <Photo src="/aashut-walk.jpg" alt="" speed={12} className="band__photo" position="50% 56%" />
          <div className="band__inner">
            <blockquote>
              <StackingWords>
                &ldquo;Aa|shut is known to deliver a power packed performance through his storytelling skills while catering
                to everyone&rsquo;s musical needs.&rdquo;
              </StackingWords>
            </blockquote>
            <figcaption data-reveal>
              Client feedback <span className="muted">· Impromptu open format sets, tailored to the room.</span>
            </figcaption>
          </div>
        </figure>

        <section className="gigs section" id="gigs" aria-labelledby="gigs-title">
          <div className="gigs__grid">
            <div>
              <p className="eyebrow" data-reveal>Played at</p>
              <h2 id="gigs-title" className="display" data-split>Gigs</h2>
              <ul className="rows" data-stack-items>
                {GIGS.map(g => (
                  <li key={g.venue}>
                    <span>{g.venue}</span>
                    <span className="muted">{g.city ?? '—'}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow" data-reveal>Collaboration</p>
              <h2 className="display" data-split>Packages</h2>
              <ul className="rows" data-stack-items>
                <li>
                  <span>Podcast guest mix</span>
                  <span className="muted">One run</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rider section" id="rider" aria-labelledby="rider-title">
          <div className="section__head">
            <p className="eyebrow" data-reveal>Technical rider</p>
            <h2 id="rider-title" className="display" data-split>
              What the booth needs.
            </h2>
            <p className="rider__sub muted" data-reveal>Equipment provided by the venue / promoter.</p>
          </div>

          <div className="rider__grid">
            <div className="spec">
              <div className="spec__head" aria-hidden="true" data-reveal>
                <span>Qty</span>
                <span>Equipment</span>
                <span>Requirement</span>
              </div>
              <ul data-stack-items>
                {RIDER.map(r => (
                  <li key={r.item}>
                    <span className="spec__qty">{r.qty ?? '—'}</span>
                    <span className="spec__item">
                      {r.item}
                      <span>{r.spec}</span>
                    </span>
                    <span className={`spec__req${r.flag ? ' spec__req--flag' : ''}${r.note ? '' : ' spec__req--empty'}`}>{r.note ?? '—'}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="rider__side">
              <figure className="plan" data-reveal>
                <BoothPlan />
                <figcaption>Booth plan · players connected via link cable</figcaption>
              </figure>

              <dl className="facts" data-reveal="1">
                <div>
                  <dt>Set-up time</dt>
                  <dd className="facts__big">10 min</dd>
                </div>
                <div>
                  <dt>Soundcheck</dt>
                  <dd>Arranged by the sound technician / engineer before the event starts.</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="contact section" id="contact" aria-labelledby="contact-title">
          <div className="contact__panel">
            <Photo src="/aashut-live.jpg" alt="" speed={10} className="contact__photo" position="50% 40%" />
            <div className="contact__body">
              <p className="eyebrow" data-reveal>Bookings &amp; enquiries</p>
              <h2 id="contact-title" className="display display--xl" data-split>Get in touch.</h2>
              <p className="lede" data-reveal>Reach out for bookings or any other query.</p>
              <div className="contact__actions" data-reveal="1">
                <a className="btn btn--primary" href={`mailto:${LINKS.email}?subject=Booking%20enquiry`}>
                  Email<span className="btn__detail">{LINKS.email}</span>
                </a>
                <a className="btn" href={`tel:${LINKS.phone}`}>
                  Call<span className="btn__detail">{LINKS.phoneLabel}</span>
                </a>
              </div>
              <ul className="socials" aria-label="Elsewhere" data-reveal="2">
                <li><a href={LINKS.soundcloud} target="_blank" rel="noreferrer">SoundCloud<span>ashu-dhapola</span></a></li>
                <li><a href={LINKS.instagram} target="_blank" rel="noreferrer">Instagram<span>__aashut__dnb</span></a></li>
                <li><a href={LINKS.facebook} target="_blank" rel="noreferrer">Facebook<span>ashutosh.dhapola.39</span></a></li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Aa|shut</span>
        <span className="muted">Drum &amp; Bass from India</span>
      </footer>
    </>
  );
}
