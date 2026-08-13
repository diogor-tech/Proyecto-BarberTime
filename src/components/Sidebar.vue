<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import {
  House,
  Search,
  Calendar,
  Heart,
  User,
  Crown,
  TextAlignJustify,
  ShoppingBag,
  ShoppingCart
} from "lucide-vue-next"

const emit = defineEmits(['openLogin', 'toggleSidebar'])
const router = useRouter()
const route = useRoute()
const isMinimized = ref(false)
const cartCount = ref(0)

const actualizarCarrito = () => {

  const carrito =
    JSON.parse(localStorage.getItem("cart")) || []

  cartCount.value = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  )

}

actualizarCarrito()

window.addEventListener("storage", actualizarCarrito)
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
  emit('toggleSidebar', isMinimized.value)
}

const logo = new URL('../assets/Imagenes/logo/logo.png', import.meta.url).href

const links = [
  { label: 'Inicio', to: '/', icon: House },
  { label: 'Explorar', to: '/explore', icon: Search },
  { label: 'Agenda', to: '/agenda', icon: Calendar },
  { label: 'Favoritas', to: '/favorites', icon: Heart },
  { label: 'Tienda', to: '/store', icon: ShoppingBag ,ShoppingCart},
  { label: 'Carrito', to: '/cart', icon: ShoppingCart },
  { label: 'Perfil', to: '/profile', icon: User },
]


const navigate = (link) => {

  if (link.to === '/profile') {

    const currentUser = localStorage.getItem('currentUser')

    if (currentUser) {
      router.push('/profile')
    } else {
      emit('openLogin')
    }

    return
  }

  router.push(link.to)
}

</script>

<template>
  <aside :class="['sidebar', { minimized: isMinimized }]">
    <div class="sidebar-header">
      <div v-if="!isMinimized" class="brand" @click.prevent="router.push('/')">
        <div class="brand-icon">
          <img :src="logo" alt="Logo BarberTime" />
        </div>
        <h2>Barber<span>Time</span>
        </h2>
      </div>

      <button class="minimize-btn" @click="toggleMinimize" :title="isMinimized ? 'Expandir' : 'Minimizar'">
        <TextAlignJustify class="minimize-icon" />
      </button>
    </div>

    <nav v-if="!isMinimized" class="menu">
      <a
        v-for="link in links"
        :key="link.label"
        :href="link.to"
        :class="{ active: route.path === link.to }"
        @click.prevent="navigate(link)"
      >
        <component :is="link.icon" class="menu-icon" />
        <span>{{ link.label }}</span>

<span
  v-if="link.to === '/cart' && cartCount > 0"
  class="cart-badge"
>
  {{ cartCount }}
</span>
      </a>
    </nav>

    <div v-if="!isMinimized" class="premium-box">
      <h3>PREMIUM <Crown class="crown-icon" /></h3>
      <p>Obtén reservas prioritarias y promociones exclusivas.</p>
      <button @click="router.push('/premium')">Actualizar</button>
    </div>
  </aside>
</template>

<style scoped>

@font-face {
    font-family: 'FuenteBarbera';
    src: url('../fonts/BARBERA.otf') format('opentype'); 
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'FuenteBarber';
    src: url('../fonts/BarberStreet.ttf') format('opentype'); 
    font-weight: normal;
    font-style: normal;
}

.sidebar {
  width: 280px;
  min-height: 100vh;
  background:#000000e3;
  padding: 35px 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  left: 0;
  top: 0;
  transition: width 0.3s ease;
}

.sidebar.minimized {
  width: 80px;
  padding: 35px 15px;
  align-items: center;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  width: 100%;
}

.sidebar.minimized .sidebar-header {
  flex-direction: column;
  justify-content: flex-start;
}

.minimize-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: 0.3s;
}

.minimize-btn:hover {
  background: rgba(191, 146, 75, 0.15);
  color: #BF924B;
}

.minimize-icon {
  width: 24px;
  height: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
}

.brand-icon img {
  width: 200%;
  height: 200%;
  object-fit: contain;
}

.brand h2 {
  font-size: 1.5rem;
  color: #ffffff;
  -webkit-background-clip: text;                          
  background-clip: text;                                                
}

.brand h2 span {
  background: linear-gradient(to top, #BF924B, #F3DDA7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: bold;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 50px;
}

.menu a {
  font-family: 'FuenteBarbera', sans-serif;
  font-size: 1.4rem;
  text-decoration: none;
  color: #9ca3af;
  padding: 15px;
  border-radius: 14px;
  transition: 0.3s;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0; 
 
}

.menu .active {
  background: linear-gradient(to right,#32371f, #000000e3);
  color: #bf924b;
}

.premium-box {
  background: linear-gradient(135deg, #bf924b, #ffc465);
  padding: 25px;
  border-radius: 24px;
}

.premium-box h3 {
  color: #000000e3;
  font-family: 'FuenteBarber', sans-serif;
  font-weight: normal;
  margin-bottom: 10px;
  letter-spacing: 1px;
  font-size: 1.5rem;
}

.crown-icon {
  width: 30px;
  height: 30px;
  color: #3d2f18;
  fill: #a7782d;
  margin-left: -5px;
}

.premium-box p {
  
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.premium-box button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: black;
  color: white;
  cursor: pointer;
  font-weight: 600;
}
.cart-badge{

margin-left:auto;

background:#dc2626;

color:white;

width:24px;

height:24px;

border-radius:50%;

display:flex;

justify-content:center;

align-items:center;

font-size:12px;

font-weight:bold;

}

</style>