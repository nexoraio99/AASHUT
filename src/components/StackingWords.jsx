// Marks a block of text for the scroll-scrubbed stacking-words effect.
// The animation itself lives in src/motion.js (anime.js splitText + onScroll).
//
// stagger  how far apart consecutive words start, as a fraction of one word's duration
export default function StackingWords({ as: Tag = 'p', stagger = 0.21, children, ...rest }) {
  return (
    <Tag data-stack={stagger} {...rest}>
      {children}
    </Tag>
  );
}
