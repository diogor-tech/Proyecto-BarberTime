<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Login from '@/components/Login.vue'

const router = useRouter()

const sidebarMinimized = ref(false)

const handleToggleSidebar = (isMinimized) => {
  sidebarMinimized.value = isMinimized
}

const showLogin = ref(false)

const user = ref({
  name: '',
  email: '',
  avatar: ''
})
onMounted(() => {

  const currentUser = localStorage.getItem("currentUser")

  console.log("CURRENT USER:", currentUser)

  if (currentUser) {
    user.value = JSON.parse(currentUser)
    console.log("USER CARGADO:", user.value)
  } else {
    console.log("NO HAY USUARIO")
  }

})

const guardarPerfil = () => {

  localStorage.setItem(
    'currentUser',
    JSON.stringify(user.value)
  )

  alert('Perfil actualizado')
}

const cambiarFoto = (event) => {

  const file = event.target.files[0]

  if (!file) return

  const reader = new FileReader()

  reader.onload = (e) => {

    user.value.avatar = e.target.result

    localStorage.setItem(
      'currentUser',
      JSON.stringify(user.value)
    )
  }

  reader.readAsDataURL(file)
}

const cerrarSesion = () => {

  localStorage.removeItem('currentUser')

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


.main-content.sidebar-minimized{
  margin-left:80px;
  width:calc(100% - 80px);
  display:flex;
  justify-content:center;
  align-items:center;
}

.profile-container{
  width:100%;
  display:flex;
  justify-content:center;
  align-items:center;
}

.profile-card{
  width:720px;
  max-width:90%;
  background:#000;
  border:1px solid rgba(191,146,75,.35);
  border-radius:35px;
  padding:55px;
  box-shadow:0 20px 60px rgba(0,0,0,.7);
}

.avatar-container{
  position:relative;
  width:170px;
  margin:0 auto 35px;
}

.avatar{
  width:170px;
  height:170px;
  border-radius:50%;
  object-fit:cover;
  border:5px solid #BF924B;
  display:block;
  box-shadow:0 0 25px rgba(191,146,75,.35);
}

.change-photo{
  position:absolute;
  bottom:5px;
  right:5px;
  width:45px;
  height:45px;
  border-radius:50%;
  background:#BF924B;
  color:white;
  display:flex;
  justify-content:center;
  align-items:center;
  cursor:pointer;
  font-size:18px;
  transition:.3s;
  box-shadow:0 5px 15px rgba(0,0,0,.4);
}

.change-photo:hover{
  transform:scale(1.1);
}

h1{
  text-align:center;
  color:white;
  margin-bottom:35px;
  font-size:2rem;
}

label{
  display:block;
  color:#d1d5db;
  margin:18px 0 8px;
  font-weight:600;
}

input{
  width:100%;
  padding:16px;
  border:none;
  border-radius:12px;
  background:#111827;
  color:white;
  font-size:15px;
  box-sizing:border-box;
}

input:focus{
  outline:none;
  border:1px solid #BF924B;
}

.save-btn{
  width:100%;
  margin-top:30px;
  padding:16px;
  border:none;
  border-radius:12px;
  cursor:pointer;
  font-weight:bold;
  font-size:16px;
  background:linear-gradient(135deg,#BF924B,#F3DDA7);
  color:black;
  transition:.3s;
}

.save-btn:hover{
  transform:translateY(-3px);
}

.logout-btn{
  width:100%;
  margin-top:15px;
  padding:16px;
  border:none;
  border-radius:12px;
  cursor:pointer;
  font-weight:bold;
  font-size:16px;
  background:#dc2626;
  color:white;
  transition:.3s;
}

.logout-btn:hover{
  background:#b91c1c;
  transform:translateY(-3px);
}
.stats{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:15px;
  margin-top:35px;
}

.stat-card{
  background:#111827;
  border:1px solid rgba(191,146,75,.25);
  border-radius:15px;
  padding:18px;
  text-align:center;
}

.stat-card h3{
  color:#BF924B;
  font-size:14px;
  margin-bottom:10px;
}

.stat-card p{
  color:white;
  font-size:22px;
  font-weight:bold;
}

</style>
