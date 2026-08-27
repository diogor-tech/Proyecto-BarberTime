<script setup>
import Sidebar from "@/components/Sidebar.vue"
import products from "@/data/products"
import { useRoute, useRouter } from "vue-router"
import { ref } from "vue"
import Login from "@/components/Login.vue"
import { UserRound } from "lucide-vue-next"
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()

const sidebarMinimized = ref(false)
const showLogin = ref(false)
const { avatar, isAuthenticated } = useAuth()

function irAPerfil() {
  if (isAuthenticated.value) {
    router.push('/profile')
    return
  }

  showLogin.value = true
}

const handleToggleSidebar = (v) => {
  sidebarMinimized.value = v
}

const producto = products.find(
  p => p.id == route.params.id
)

const agregarCarrito = () => {

  if (!isAuthenticated.value) {
    showLogin.value = true
    return
  }

  const carrito =
    JSON.parse(localStorage.getItem("cart")) || []

  const existe = carrito.find(
    p => p.id === producto.id
  )

  if (existe) {
    existe.cantidad++
  } else {
    carrito.push({
      ...producto,
      cantidad: 1
    })
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(carrito)
  )

  alert("Producto agregado al carrito 🛒")

}
</script>

<template>

<div class="page-shell">

<Sidebar
@toggleSidebar="handleToggleSidebar"
/>

<main :class="['main-content',{ 'sidebar-minimized': sidebarMinimized }]">

<header class="topbar">
  <div>
    <h1 class="intro">Detalle del producto</h1>
    <p>Equipamiento profesional para tu rutina.</p>
  </div>
  <div class="user-box">
    <input type="text" placeholder="Buscar producto..." />
    <div :class="['avatar-box', { 'is-authenticated': isAuthenticated }]" @click="irAPerfil">
      <img v-if="avatar" :src="avatar" class="avatar-image" alt="Foto de perfil" />
      <UserRound v-else class="user-icon" />
    </div>
  </div>
</header>

<div
v-if="producto"
class="product"
>

<img
:src="producto.image"
>

<div class="info">

<span class="category">{{ producto.category }}</span>

<h1>{{ producto.name }}</h1>

<h2>{{ producto.brand }}</h2>

<p class="rating">
⭐ {{ producto.rating }}
</p>

<div class="price-row">
  <p v-if="producto.discount" class="old-price">${{ producto.price }}</p>
  <p class="price">${{ Math.round(producto.price - producto.price * (producto.discount || 0) / 100) }}</p>
</div>

<p>

Categoría:
<b>{{ producto.category }}</b>

</p>

<p>

Stock:
<b>{{ producto.stock }}</b>

</p>

<button
@click="agregarCarrito"
>

🛒 Agregar al carrito

</button>

</div>

</div>

<div v-else class="empty-state">
  <h2>Producto no encontrado</h2>
  <p>Este producto ya no está disponible en la tienda.</p>
</div>

</main>

<Login v-if="showLogin" @close="showLogin = false" />

</div>

</template>

<style scoped>
.main-content { margin-left: 280px; width: calc(100% - 280px); min-height: 100vh; padding: 35px 100px 50px; color: white; transition: margin-left 0.3s ease, width 0.3s ease, padding 0.3s ease; }
.main-content.sidebar-minimized { margin-left: 80px; width: calc(100% - 80px); padding: 35px 120px 50px; }
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 45px; }
.topbar h1 { margin: 6px 0 8px; font-family: 'FuenteBlesh', sans-serif; }
.topbar p { color: #9ca3af; }
.user-box { display: flex; align-items: center; gap: 20px; }
.user-box input { width: 280px; padding: 15px 20px; border: none; border-radius: 14px; background: #1f2937; color: white; outline: none; }
.user-box input::placeholder { color: #9ca3af; }
.avatar-box { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: linear-gradient(135deg, rgba(191,146,75,.12), rgba(255,183,67,.08)); border: 1px solid rgba(255,255,255,.06); cursor: pointer; }
.avatar-box.is-authenticated { border-radius: 50%; overflow: hidden; }
.user-icon { width: 28px; height: 28px; color: #BF924B; }
.category { color: #BF924B !important; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.product { display: grid; grid-template-columns: minmax(280px, 480px) minmax(0, 1fr); gap: 55px; align-items: center; padding: 28px; background: #1a1a1a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; }
.product img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 18px; }
.info { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
.info h1 { font-size: clamp(2rem, 4vw, 3.4rem); margin: 0; }
.info h2 { color: #9ca3af; font-size: 1.1rem; font-weight: 500; }
.info p:not(.price):not(.rating):not(.old-price) { color: #d1d5db; }
.rating { color: #ffd700; font-size: 1.05rem; }
.price-row { display: flex; align-items: baseline; gap: 12px; }
.price { color: #BF924B; font-size: 2.5rem; font-weight: 700; }
.old-price { color: #6b7280; text-decoration: line-through; }
.info button { margin-top: 8px; padding: 15px 24px; border: none; border-radius: 12px; background: linear-gradient(135deg, #BF924B, #ffb743); color: #000; font-weight: 700; cursor: pointer; }
.empty-state { padding: 70px 30px; text-align: center; background: #1a1a1a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; color: white; }
.empty-state p { margin-top: 12px; color: #9ca3af; }
@media (max-width: 900px) { .main-content, .main-content.sidebar-minimized { margin-left: 80px; width: calc(100% - 80px); padding: 25px 30px 40px; } .product { grid-template-columns: 1fr; gap: 30px; } .topbar { flex-direction: column; align-items: flex-start; gap: 20px; } .user-box, .user-box input { width: 100%; } }
@media (max-width: 600px) { .main-content, .main-content.sidebar-minimized { margin-left: 0; width: 100%; padding: 25px 20px 40px; } .product { padding: 16px; } }
</style>