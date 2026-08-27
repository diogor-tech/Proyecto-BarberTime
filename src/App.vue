<script setup>
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import scissorsClickSound from './assets/Sonidos/scissorsClick.mp3'

const router = useRouter()

// Reproducir sonido al cambiar de página
router.afterEach(() => {
  const audio = new Audio(scissorsClickSound)
  audio.play()
})
</script>

<template>
  <RouterView />
</template>

<style>
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  min-height: 100%;
  overflow-x: hidden;
}

#app {
  width: 100%;
}
</style>