<script setup>
import { RouterView } from 'vue-router'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Login from './components/Login.vue'
import scissorsClickSound from './assets/Sonidos/scissorsClick.mp3'

const router = useRouter()
const route = useRoute()
const showLogin = ref(false)

watch(
  () => route.query.login,
  (loginRequired) => {
    showLogin.value = loginRequired === 'required'
  },
  { immediate: true }
)

const closeLogin = () => {
  showLogin.value = false
  router.replace({ path: '/', query: {} })
}

// Reproducir sonido al cambiar de página
router.afterEach(() => {
  const audio = new Audio(scissorsClickSound)
  audio.play()
})
</script>

<template>
  <RouterView />
  <Login v-if="showLogin" @close="closeLogin" />
</template>

<style>
.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
}

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