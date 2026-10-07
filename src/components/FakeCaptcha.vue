<template>
  <div class="captcha-container">
    <div
      class="captcha-box"
      @click="verificarCaptcha"
    >
      <div class="captcha-left">
        <div
          class="checkbox"
          :class="{ checked: verificado }"
        >
          <span v-if="verificado">✓</span>
        </div>

        <span class="captcha-text">
          No soy un robot
        </span>
      </div>

      <div class="captcha-logo">
        <div class="robot-icon">🤖</div>
        <small>CAPTCHA</small>
        <span>Privacidad - Términos</span>
      </div>
    </div>

    <p
      v-if="verificado"
      class="captcha-success"
    >
      ✓ Verificación completada
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['verified'])

const verificado = ref(false)

function verificarCaptcha() {
  if (verificado.value) return

  setTimeout(() => {
    verificado.value = true
    emit('verified', true)
  }, 700)
}
</script>

<style scoped>
.captcha-container {
  width: 100%;
  margin: 5px 0;
}

.captcha-box {
  width: 100%;
  max-width: 304px;
  min-height: 74px;
  padding: 12px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #fff;
  border: 1px solid #d6d6d6;
  border-radius: 4px;

  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);

  cursor: pointer;
  user-select: none;

  transition: 0.2s ease;
}

.captcha-box:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.captcha-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.checkbox {
  width: 28px;
  height: 28px;

  border: 2px solid #555;
  border-radius: 3px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fff;

  transition: 0.2s ease;
}

.checkbox.checked {
  background: #BF924B;
  border-color: #BF924B;
  color: white;
}

.checkbox span {
  font-size: 20px;
  font-weight: bold;
}

.captcha-text {
  color: #222;
  font-size: 15px;
  font-weight: 500;
}

.captcha-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: #777;
  font-size: 9px;
  text-align: center;
}

.robot-icon {
  font-size: 27px;
  line-height: 27px;
  margin-bottom: 2px;
}

.captcha-logo small {
  font-size: 10px;
  font-weight: bold;
  color: #555;
}

.captcha-logo span {
  font-size: 7px;
  color: #888;
  margin-top: 2px;
}

.captcha-success {
  margin: 8px 0 0;
  color: #4caf50;
  font-size: 13px;
  font-weight: 600;
}
</style>