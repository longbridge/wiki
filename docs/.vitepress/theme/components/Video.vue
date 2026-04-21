<script setup lang="ts">
defineProps<{
  src: string
  poster?: string
  caption?: string
  autoplay?: boolean
}>()
</script>

<template>
  <figure class="video">
    <div class="video__wrapper">
      <video
        :src="src"
        :poster="poster"
        :autoplay="autoplay"
        controls
        playsinline
        class="video__player"
      />
    </div>
    <figcaption v-if="caption" class="video__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.video {
  margin: var(--space-lg) 0;
}

.video__wrapper {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #000;
  box-shadow: var(--card-shadow);
  aspect-ratio: 16/9;
}

.video__player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.video__caption {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-mute);
  margin-top: var(--space-sm);
}
</style>
