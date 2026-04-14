<template>
  <div class="doc-bg" aria-hidden="true">
    <div class="orb orb-a" />
    <div class="orb orb-b" />
  </div>
</template>

<style scoped>
/* Fixed to viewport — stays in place while user scrolls the doc */
.doc-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}

/* Top-right orb: ambient corner glow */
.orb-a {
  width: 48vw;
  aspect-ratio: 1;
  top: -18vh;
  right: -8vw;
  background: radial-gradient(circle at 38% 38%, rgba(0, 184, 184, 0.07) 0%, transparent 64%);
  filter: blur(72px);
  animation: doc-drift-a 38s ease-in-out infinite alternate;
}

/* Bottom-left orb: soft counter-balance */
.orb-b {
  width: 36vw;
  aspect-ratio: 1;
  bottom: -14vh;
  left: -6vw;
  background: radial-gradient(circle at 58% 58%, rgba(0, 184, 184, 0.05) 0%, transparent 64%);
  filter: blur(88px);
  animation: doc-drift-b 48s ease-in-out infinite alternate;
}

/* Slow, minimal movement — reading context should feel calm */
@keyframes doc-drift-a {
  0%   { transform: translate(0%, 0%) scale(1.00); }
  35%  { transform: translate(-3%, 5%) scale(1.03); }
  70%  { transform: translate(3%, -3%) scale(0.98); }
  100% { transform: translate(-5%, 2%) scale(1.02); }
}

@keyframes doc-drift-b {
  0%   { transform: translate(0%, 0%) scale(1.00); }
  40%  { transform: translate(4%, -5%) scale(1.03); }
  100% { transform: translate(-3%, 4%) scale(0.97); }
}

/* ── Dark mode ── */
html.dark .orb-a {
  background: radial-gradient(circle at 38% 38%, rgba(0, 240, 196, 0.06) 0%, transparent 64%);
}

html.dark .orb-b {
  background: radial-gradient(circle at 58% 58%, rgba(0, 240, 196, 0.04) 0%, transparent 64%);
}
</style>
