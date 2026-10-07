<script setup>
import { ref, watch, onMounted } from 'vue'
import FakeCaptcha from '../components/FakeCaptcha.vue'
import { useAuth } from '@/composables/useAuth'

const captchaVerificado = ref(false)

const emit = defineEmits(['close', 'login'])

const { setUser } = useAuth()
onMounted(() => {
  const users = JSON.parse(localStorage.getItem('users')) || []

  const adminExists = users.some(
    user => user.role === 'admin'
  )

  if (!adminExists) {
    const admin = {
      id: 'admin-001',
      name: 'Administrador',
      email: 'admin@barbertime.com',
      password: 'admin123',
      avatar: defaultAvatar,
      role: 'admin'
    }

    users.push(admin)

    localStorage.setItem(
      'users',
      JSON.stringify(users)
    )
  }
})

const defaultAvatar =
  'https://drive.google.com/thumbnail?id=1Igq46CyxTBBX8AEimgfYxqmZrgcZLZqL&sz=w640'

const isLogin = ref(true)

const name = ref('')
const email = ref('')
const password = ref('')

watch(isLogin, () => {
  captchaVerificado.value = false
})

const login = () => {
  if (!captchaVerificado.value) {
    alert('Por favor, verifica que no eres un robot.')
    return
  }

  const users =
    JSON.parse(localStorage.getItem('users')) || []

  const user = users.find(
    u =>
      u.email === email.value &&
      u.password === password.value
  )

  if (!user) {
    alert('Usuario incorrecto')
    return
  }

  localStorage.setItem(
    'currentUser',
    JSON.stringify(user)
  )

  setUser(user)

  emit('login', user)
  emit('close')
}

const register = () => {
  if (!captchaVerificado.value) {
    alert('Por favor, verifica que no eres un robot.')
    return
  }

  const users =
    JSON.parse(localStorage.getItem('users')) || []

  const exists = users.find(
    u => u.email === email.value
  )

  if (exists) {
    alert('Ese email ya existe')
    return
  }

  const newUser = {
  id: Date.now(),
  name: name.value,
  email: email.value,
  password: password.value,
  avatar: defaultAvatar,
  role: 'cliente'
}
  users.push(newUser)

  localStorage.setItem(
    'users',
    JSON.stringify(users)
  )

  localStorage.setItem(
    'currentUser',
    JSON.stringify(newUser)
  )

  setUser(newUser)

  emit('login', newUser)
  emit('close')
}
</script>

<template>
  <div class="overlay">
    <div class="modal">

      <button
        class="close-btn"
        @click="$emit('close')"
      >
        ✕
      </button>

      <h2>
        {{
          isLogin
            ? 'Iniciar Sesión'
            : 'Crear Cuenta'
        }}
      </h2>

      <p class="subtitle">
        Accede a tus favoritos y reservas
      </p>

      <div class="form">

        <input
          v-if="!isLogin"
          v-model="name"
          type="text"
          placeholder="Nombre"
        />

        <input
          v-model="email"
          type="email"
          placeholder="Email"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
        />

        <!-- CAPTCHA para Login y Registro -->
        <FakeCaptcha
          @verified="captchaVerificado = $event"
        />

        <button
          class="submit-btn"
          @click="isLogin ? login() : register()"
        >
          {{
            isLogin
              ? 'Entrar'
              : 'Crear Cuenta'
          }}
        </button>

      </div>

      <small
        class="switch"
        @click="isLogin = !isLogin"
      >
        {{
          isLogin
            ? '¿No tienes cuenta? Regístrate'
            : '¿Ya tienes cuenta? Inicia sesión'
        }}
      </small>

    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.7);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 999;

  backdrop-filter: blur(10px);
}

.modal {
  width: 420px;
  max-width: 90%;

  background: #111;

  border-radius: 30px;

  padding: 40px;

  position: relative;

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-sizing: border-box;
}

.close-btn {
  position: absolute;

  top: 20px;
  right: 20px;

  background: none;
  border: none;

  color: white;

  font-size: 20px;

  cursor: pointer;
}

h2 {
  font-size: 2rem;

  margin-bottom: 10px;

  color: white;
}

.subtitle {
  color: #9ca3af;

  margin-bottom: 30px;
}

.form {
  display: flex;

  flex-direction: column;

  gap: 18px;
}

input {
  background: #1f2937;

  border: none;

  padding: 16px;

  border-radius: 14px;

  color: white;

  outline: none;

  font-size: 15px;

  box-sizing: border-box;
}

input::placeholder {
  color: #9ca3af;
}

input:focus {
  outline: 1px solid #BF924B;
}

.submit-btn {
  border: none;

  padding: 16px;

  border-radius: 14px;

  background: linear-gradient(
    135deg,
    #BF924B,
    #ffb743
  );

  color: black;

  font-weight: 700;

  cursor: pointer;

  font-size: 15px;

  transition: 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 20px
    rgba(191, 146, 75, 0.3);
}

.switch {
  display: block;

  margin-top: 25px;

  color: #BF924B;

  cursor: pointer;

  text-align: center;

  transition: 0.2s ease;
}

.switch:hover {
  color: #ffb743;
}
</style>