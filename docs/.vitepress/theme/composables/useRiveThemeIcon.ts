import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas'
import { onMounted, onBeforeUnmount, watch, type Ref } from 'vue'

export const RIVE_SRC =
  'https://assets.lbctrl.com/uploads/e5001374-11f9-4007-af55-b12a3163137a/ai_thinking_icon.riv'

export const ANIMATIONS = {
  light: { start: 'Start_Light_1', loop: 'Loop_Light' },
  dark:  { start: 'Start_Dark_2',  loop: 'Loop_Dark'  },
} as const

export function useRiveThemeIcon(
  canvas: Ref<HTMLCanvasElement | null>,
  isDark: Ref<boolean>,
) {
  let rive: Rive | null = null

  onMounted(() => {
    if (!canvas.value) return
    const group = isDark.value ? ANIMATIONS.dark : ANIMATIONS.light
    rive = new Rive({
      src: RIVE_SRC,
      canvas: canvas.value,
      autoplay: true,
      animations: [group.start, group.loop],
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    })
  })

  watch(isDark, (dark) => {
    if (!rive) return
    const next = dark ? ANIMATIONS.dark : ANIMATIONS.light
    rive.stop()
    rive.play([next.start, next.loop])
  })

  onBeforeUnmount(() => {
    rive?.cleanup()
    rive = null
  })
}
