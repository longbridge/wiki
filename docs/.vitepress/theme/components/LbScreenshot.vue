<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  spots?: Array<{ x: number; y: number; label: string }>
  caption?: string
}>()
</script>

<template>
  <figure class="lb-screenshot">
    <div class="lb-screenshot__frame">
      <img :src="src" :alt="alt ?? '截图'" class="lb-screenshot__img" loading="lazy" />
      <template v-if="spots">
        <div
          v-for="(spot, i) in spots"
          :key="i"
          class="lb-screenshot__spot"
          :style="{ left: `${spot.x}%`, top: `${spot.y}%` }"
        >
          <span class="lb-screenshot__dot">{{ i + 1 }}</span>
          <span class="lb-screenshot__tooltip">{{ spot.label }}</span>
        </div>
      </template>
    </div>
    <figcaption v-if="caption" class="lb-screenshot__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.lb-screenshot {
  margin: var(--lb-space-lg) 0;
}

.lb-screenshot__frame {
  position: relative;
  border-radius: var(--lb-radius-lg);
  overflow: hidden;
  box-shadow: var(--lb-card-shadow);
  display: inline-block;
  width: 100%;
}

.lb-screenshot__img {
  display: block;
  width: 100%;
  height: auto;
}

.lb-screenshot__spot {
  position: absolute;
  transform: translate(-50%, -50%);
}

.lb-screenshot__dot {
  width: 24px;
  height: 24px;
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
}

.lb-screenshot__tooltip {
  display: none;
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,.85);
  color: white;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: var(--lb-radius-sm);
  white-space: nowrap;
  z-index: 10;
}

.lb-screenshot__spot:hover .lb-screenshot__tooltip {
  display: block;
}

.lb-screenshot__caption {
  text-align: center;
  font-size: 0.875rem;
  color: var(--lb-text-mute);
  margin-top: var(--lb-space-sm);
}
</style>
