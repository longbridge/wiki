<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { BRAND_TEAL_DARK, BRAND_TEAL_LIGHT } from '../colors'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let rafId = 0
let ro: ResizeObserver | null = null

interface Blip {
  x: number
  y: number
  r: number
  maxR: number
  alpha: number
  baseAlpha: number
  speed: number
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let W = 0
  let H = 0
  const GRID_SPACING = 52

  const isDark = () => document.documentElement.classList.contains('dark')

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    W = rect.width
    H = rect.height
    canvas.width = W * devicePixelRatio
    canvas.height = H * devicePixelRatio
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
  }
  resize()
  ro = new ResizeObserver(resize)
  ro.observe(canvas)

  const blips: Blip[] = []
  let nextBlipAt = performance.now() + 600

  const t0 = performance.now()

  const frame = (now: number) => {
    if (W === 0 || H === 0) {
      rafId = requestAnimationFrame(frame)
      return
    }
    ctx.clearRect(0, 0, W, H)

    const dark = isDark()
    const teal = dark ? BRAND_TEAL_DARK : BRAND_TEAL_LIGHT

    const cols = Math.ceil(W / GRID_SPACING) + 1
    const rows = Math.ceil(H / GRID_SPACING) + 1
    const offsetX = (W % GRID_SPACING) / 2
    const offsetY = (H % GRID_SPACING) / 2

    // ── Scan line position ──────────────────────────────────────────────────
    const elapsed = now - t0
    const SCAN_PERIOD = 7200
    const scanProgress = (elapsed % SCAN_PERIOD) / SCAN_PERIOD
    const scanY = scanProgress * H

    // ── Dot grid ─── (with scan boost) ─────────────────────────────────────
    const baseAlpha = dark ? 0.11 : 0.13

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = offsetX + c * GRID_SPACING
        const y = offsetY + r * GRID_SPACING

        let dotAlpha = baseAlpha
        let dotR = 1

        if (!prefersReduced) {
          const dist = Math.abs(y - scanY)
          if (dist < 44) {
            const boost = 1 - dist / 44
            dotAlpha = baseAlpha + boost * 0.38
            dotR = 1 + boost * 0.6
          }
        }

        ctx.beginPath()
        ctx.arc(x, y, dotR, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${teal}, ${dotAlpha.toFixed(3)})`
        ctx.fill()
      }
    }

    if (!prefersReduced) {
      // ── Scan line gradient ──────────────────────────────────────────────
      const scanHeight = 72
      const scanGrad = ctx.createLinearGradient(0, scanY - scanHeight, 0, scanY + scanHeight)
      const sa = dark ? 0.045 : 0.055
      scanGrad.addColorStop(0, `rgba(${teal}, 0)`)
      scanGrad.addColorStop(0.35, `rgba(${teal}, ${sa})`)
      scanGrad.addColorStop(0.5, `rgba(${teal}, ${(sa * 1.6).toFixed(3)})`)
      scanGrad.addColorStop(0.65, `rgba(${teal}, ${sa})`)
      scanGrad.addColorStop(1, `rgba(${teal}, 0)`)
      ctx.fillStyle = scanGrad
      ctx.fillRect(0, scanY - scanHeight, W, scanHeight * 2)

      // ── Spawn blips ─────────────────────────────────────────────────────
      if (now >= nextBlipAt && blips.length < 7) {
        const c = Math.floor(Math.random() * (cols - 1))
        const r = Math.floor(Math.random() * (rows - 1))
        const bAlpha = dark ? 0.48 : 0.42
        blips.push({
          x: offsetX + c * GRID_SPACING,
          y: offsetY + r * GRID_SPACING,
          r: 0,
          maxR: 16 + Math.random() * 14,
          alpha: bAlpha,
          baseAlpha: bAlpha,
          speed: 0.16 + Math.random() * 0.14,
        })
        nextBlipAt = now + 380 + Math.random() * 620
      }

      // ── Draw & update blips ─────────────────────────────────────────────
      for (let i = blips.length - 1; i >= 0; i--) {
        const b = blips[i]
        b.r += b.speed
        b.alpha = b.baseAlpha * (1 - b.r / b.maxR)

        if (b.r >= b.maxR) {
          blips.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${teal}, ${b.alpha.toFixed(3)})`
        ctx.lineWidth = 0.9
        ctx.stroke()

        // center dot stays bright
        ctx.beginPath()
        ctx.arc(b.x, b.y, 1.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${teal}, ${Math.min(1, b.alpha * 1.8).toFixed(3)})`
        ctx.fill()
      }
    }

    rafId = requestAnimationFrame(frame)
  }

  rafId = requestAnimationFrame(frame)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (ro) ro.disconnect()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    aria-hidden="true"
    class="hero-grid-bg"
  />
</template>

<style scoped>
.hero-grid-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
