<template>
  <div class="mesh-bg" aria-hidden="true">
    <div class="orb orb-a" />
    <div class="orb orb-b" />
    <div class="orb orb-c" />
  </div>
</template>

<style scoped>
.mesh-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;

  -webkit-mask-image:
    linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%),
    linear-gradient(to bottom, black 0%, black 65%, transparent 100%);
  mask-image:
    linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%),
    linear-gradient(to bottom, black 0%, black 65%, transparent 100%);
  -webkit-mask-composite: destination-in;
  mask-composite: intersect;
}

.mesh-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0, 240, 196, 0.10) 1px, transparent 1px);
  background-size: 28px 28px;
  background-position: 14px 14px;
}

.orb {
  position: absolute;
  border-radius: 50%;
  aspect-ratio: 1;
  will-change: transform;
}

/* Orb A — large, top-right */
.orb-a {
  width: 58%;
  top: -42%;
  right: -6%;
  background: radial-gradient(circle at 40% 40%, rgba(0, 240, 196, 0.22) 0%, transparent 66%);
  filter: blur(52px);
  animation: drift-a 7s ease-in-out infinite alternate;
}

/* Orb B — medium, bottom-left */
.orb-b {
  width: 48%;
  bottom: -38%;
  left: -4%;
  background: radial-gradient(circle at 55% 55%, rgba(0, 240, 196, 0.15) 0%, transparent 66%);
  filter: blur(68px);
  animation: drift-b 9s ease-in-out infinite alternate;
}

/* Orb C — small, center accent */
.orb-c {
  width: 34%;
  top: 8%;
  left: 31%;
  background: radial-gradient(circle at 50% 45%, rgba(50, 234, 220, 0.20) 0%, transparent 64%);
  filter: blur(80px);
  animation: drift-c 5s ease-in-out infinite alternate;
}

@keyframes drift-a {
  0%   { transform: translate(0%, 0%) scale(1.00); }
  30%  { transform: translate(-12%, 18%) scale(1.06); }
  65%  { transform: translate(10%, -10%) scale(0.95); }
  100% { transform: translate(-18%, 12%) scale(1.05); }
}

@keyframes drift-b {
  0%   { transform: translate(0%, 0%) scale(1.00); }
  35%  { transform: translate(16%, -16%) scale(1.06); }
  70%  { transform: translate(-10%, 12%) scale(0.95); }
  100% { transform: translate(20%, -10%) scale(1.04); }
}

@keyframes drift-c {
  0%   { transform: translate(0%, 0%) scale(1.00); }
  50%  { transform: translate(-18%, 22%) scale(1.10); }
  100% { transform: translate(14%, -16%) scale(0.92); }
}

</style>
