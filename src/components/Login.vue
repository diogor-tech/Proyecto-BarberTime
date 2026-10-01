<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const emit = defineEmits(['close', 'login'])
const { setUser } = useAuth()
const defaultAvatar = 'https://drive.google.com/thumbnail?id=1Igq46CyxTBBX8AEimgfYxqmZrgcZLZqL&sz=w640'

const isLogin = ref(true)

const name = ref('')
const email = ref('')
const password = ref('')

// CONECTADO CON EL BACKEND EN PHP (INICIAR SESIÓN)
const login = async () => {
  if (!email.value || !password.value) {
    alert('Por favor ingresa email y contraseña')
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'Usuario o contraseña incorrectos')
      return
    }

    // Guardar Token JWT y Usuario
    localStorage.setItem('token', data.token)
    localStorage.setItem('currentUser', JSON.stringify(data.user))

    setUser(data.user)
    emit('login', data.user)
    emit('close')
  } catch (err) {
    alert('Error de conexión con el servidor')
  }
}

// CONECTADO CON EL BACKEND EN PHP (REGISTRO)
const register = async () => {
  if (!name.value || !email.value || !password.value) {
    alert('Por favor completa todos los campos')
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        avatar: defaultAvatar
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'Error al registrar el usuario')
      return
    }

    // Guardar Token JWT y Usuario
    localStorage.setItem('token', data.token)
    localStorage.setItem('currentUser', JSON.stringify(data.user))

    setUser(data.user)
    emit('login', data.user)
    emit('close')
  } catch (err) {
    alert('Error de conexión con el servidor')
  }
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