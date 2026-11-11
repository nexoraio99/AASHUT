// Whether to honour the visitor's OS "Reduce motion" setting.
//
// false: every animation plays for everyone (the site's motion is part of the design).
// true:  visitors with Reduce motion turned on get a still page with all content visible.
export const RESPECT_REDUCED_MOTION = false;

export const prefersReducedMotion = () =>
  RESPECT_REDUCED_MOTION && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
