<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Login from '@/components/Login.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { setUser, logout } = useAuth()

const sidebarMinimized = ref(false)

const handleToggleSidebar = (isMinimized) => {
  sidebarMinimized.value = isMinimized
}

const showLogin = ref(false)

const user = ref({
  name: '',
  email: '',
  avatar: '',
  telefono: '',
  ciudad: '',
  fechaNacimiento: '',
  barberoFavorito: ''
})

onMounted(() => {
  const currentUser = localStorage.getItem("currentUser")

  if (currentUser) {
    user.value = { ...user.value, ...JSON.parse(currentUser) }
  }
})

// CONECTADO CON EL BACKEND EN PHP (GUARDAR PERFIL)
const guardarPerfil = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    alert('Debes iniciar sesión para guardar tus datos')
    showLogin.value = true
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/usuario/perfil', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(user.value)
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'Error al actualizar el perfil')
      return
    }

    alert('✅ Perfil actualizado correctamente')
    localStorage.setItem('currentUser', JSON.stringify(data.user))
    setUser(data.user)
  } catch (err) {
    alert('Error de conexión con el servidor')
  }
}

// CAMBIAR FOTO EN BASE64
const cambiarFoto = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    user.value.avatar = e.target.result
  }
  reader.readAsDataURL(file)
}

// CERRAR SESIÓN
const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('currentUser')
  logout()
  alert('Sesión cerrada')
  router.push('/')
}
</script>

<template>
  <div class="page-shell">
    <Sidebar
      @openLogin="showLogin = true"
      @toggleSidebar="handleToggleSidebar"
    />

    <main :class="['main-content', { 'sidebar-minimized': sidebarMinimized }]">
      <div class="profile-container">
        <div class="profile-card">
          <div class="avatar-container">
            <img
              :src="user.avatar || 'https://i.pravatar.cc/300'"
              class="avatar"
              alt="Foto de perfil"
            />

            <label class="change-photo">
              📷 
              <input
                type="file"
                accept="image/*"
                hidden
                @change="cambiarFoto"
              />
            </label>
          </div>

          <h1>Mi Perfil</h1>

          <label>Nombre</label>
          <input
            v-model="user.name"
            type="text"
          />

          <label>Email</label>
          <input
            v-model="user.email"
            type="email"
            disabled
          />
          
          <label>Teléfono</label>
          <input
            v-model="user.telefono"
            type="tel"
          />

          <label>Ciudad</label>
          <input
            v-model="user.ciudad"
            type="text"
          />

          <label>Fecha de nacimiento</label>
          <input
            v-model="user.fechaNacimiento"
            type="date"
          />

          <label>Barbero favorito</label>
          <input
            v-model="user.barberoFavorito"
            type="text"
          />

          <div class="stats">
            <div class="stat-card">
              <h3>Miembro desde</h3>
              <p>2026</p>
            </div>

            <div class="stat-card">
              <h3>Reservas</h3>
              <p>12</p>
            </div>

            <div class="stat-card">
              <h3>Cuenta</h3>
              <p>Gratis</p>
            </div>
          </div>

          <button
            class="save-btn"
            @click="guardarPerfil"
          >
            Guardar cambios
          </button>

          <button
            class="logout-btn"
            @click="cerrarSesion"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </main>

    <Login
      v-if="showLogin"
      @close="showLogin = false"
    />
  </div>
</template>

<style scoped>
.main-content {
  margin-left: 280px;
  padding: 40px;
  min-height: 100vh;
  background: #0b0f17;
  color: white;
  transition: .3s;
}

.main-content.sidebar-minimized {
  margin-left: 80px;
}

.profile-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-card {
  width: 100%;
  max-width: 600px;
  background: #111827;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #BF924B;
}

.change-photo {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #BF924B;
  color: black;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;
}

h1 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 2rem;
}

label {
  color: #9ca3af;
  margin-top: 15px;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

input {
  background: #1f2937;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px;
  border-radius: 12px;
  color: white;
  outline: none;
}

input:disabled {
  opacity: 0.6;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 25px 0;
}

.stat-card {
  background: #1f2937;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
}

.stat-card h3 {
  font-size: 0.8rem;
  color: #9ca3af;
}

.stat-card p {
  font-size: 1.2rem;
  color: #BF924B;
  font-weight: bold;
  margin-top: 5px;
}

.save-btn {
  background: linear-gradient(135deg, #BF924B, #ffb743);
  color: black;
  font-weight: bold;
  padding: 16px;
  border: none;
  border-radius: 12px;
  margin-top: 10px;
  cursor: pointer;
}

.logout-btn {
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 14px;
  border-radius: 12px;
  margin-top: 12px;
  cursor: pointer;
  font-weight: bold;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}
</style>