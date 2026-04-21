<script setup lang="ts">
defineProps<{
  src: string
  poster?: string
  caption?: string
  autoplay?: boolean
}>()
</script>

<template>
  <figure class="lb-video">
    <div class="lb-video__wrapper">
      <video
        :src="src"
        :poster="poster"
        :autoplay="autoplay"
        controls
        playsinline
        class="lb-video__player"
      />
    </div>
    <figcaption v-if="caption" class="lb-video__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.lb-video {
  margin: var(--lb-space-lg) 0;
}

.lb-video__wrapper {
  border-radius: var(--lb-radius-lg);
  overflow: hidden;
  background: #000;
  box-shadow: var(--lb-card-shadow);
  aspect-ratio: 16/9;
}

.lb-video__player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.lb-video__caption {
  text-align: center;
  font-size: 0.875rem;
  color: var(--lb-text-mute);
  margin-top: var(--lb-space-sm);
}
</style>
