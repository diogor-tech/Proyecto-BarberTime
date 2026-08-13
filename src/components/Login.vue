<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'login'])

const isLogin = ref(true)

const name = ref('')
const email = ref('')
const password = ref('')

const login = () => {

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

  emit('login', user)
  emit('close')
}

const register = () => {

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
    avatar:
      'https://i.pravatar.cc/150?img=' +
      Math.floor(Math.random() * 70)
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

.overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.7);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:999;
  backdrop-filter:blur(10px);
}

.modal{
  width:420px;
  background:#111;
  border-radius:30px;
  padding:40px;
  position:relative;
  border:1px solid rgba(255,255,255,0.08);
}

.close-btn{
  position:absolute;
  top:20px;
  right:20px;
  background:none;
  border:none;
  color:white;
  font-size:20px;
  cursor:pointer;
}

h2{
  font-size:2rem;
  margin-bottom:10px;
}

.subtitle{
  color:#9ca3af;
  margin-bottom:30px;
}

.form{
  display:flex;
  flex-direction:column;
  gap:18px;
}

input{
  background:#1f2937;
  border:none;
  padding:16px;
  border-radius:14px;
  color:white;
  outline:none;
}

.submit-btn{
  border:none;
  padding:16px;
  border-radius:14px;
  background:linear-gradient(135deg,#BF924B,#ffb743);
  color:black;
  font-weight:700;
  cursor:pointer;
}

.switch{
  display:block;
  margin-top:25px;
  color:#BF924B;
  cursor:pointer;
  text-align:center;
}

</style>