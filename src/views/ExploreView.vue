<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import Login from '../components/Login.vue'
import { Search, Heart } from 'lucide-vue-next'
import { useBarberStore } from '@/composables/useBarberStore'
import { useFavoritesStore } from '@/composables/useFavoritesStore'

const router = useRouter()
const search = ref('')
const barberStore = useBarberStore()
const favoritesStore = useFavoritesStore()

// SIDEBAR TOGGLE: Controla el estado de la sidebar minimizada
const sidebarMinimized = ref(false)
const handleToggleSidebar = (isMinimized) => {
  sidebarMinimized.value = isMinimized
}

const showLogin = ref(false)

const barberiasFiltradas = computed(() => {
  return barberStore.barbers.value.filter(barberia =>
    barberia.nombre.toLowerCase().includes(search.value.toLowerCase())
  )
})

function toggleFavorite(barberId) {
  favoritesStore.toggleFavorite(barberId)
}

function isFavorite(barberId) {
  return favoritesStore.isFavorite(barberId)
}
</script>

<template>
  <div class="page-shell">
    <Sidebar @openLogin="showLogin = true" @toggleSidebar="handleToggleSidebar" />

    <main :class="['main-content', { 'sidebar-minimized': sidebarMinimized }]">
      <div class="header">
        <h1 class="intro">Explorar Barberías <Search class="search-icon" /></h1>

        <input
          v-model="search"
          type="text"
          placeholder="Buscar barbería..."
          class="search-input"
        />
      </div>

      <div class="grid">
        <div v-if="barberiasFiltradas.length === 0" class="empty-message">
          <p>No hay barberías disponibles</p>
        </div>

        <div
          v-for="barberia in barberiasFiltradas"
          :key="barberia.id"
          class="card"
          @click="router.push(`/barbershop/${barberia.id}`)"
          role="button"
        >
          <div class="card-image-wrapper">
            <img
              :src="barberia.imagen"
              :alt="barberia.nombre"
              class="card-image"
            />
            <button
              class="favorite-btn"
              @click.stop="toggleFavorite(barberia.id)"
              :class="{ 'is-favorite': isFavorite(barberia.id) }"
            >
              <Heart :fill="isFavorite(barberia.id) ? 'currentColor' : 'none'" />
            </button>
          </div>

          <div class="card-content">
            <h2>{{ barberia.nombre }}</h2>
            <p>{{ barberia.direccion }}</p>

            <div v-if="barberia.ciudad" class="city">{{ barberia.ciudad }}</div>

            <div class="bottom">
              <span>⭐ {{ barberia.rating }}</span>
              <span class="price">${{ barberia.precio }}</span>
              <button class="reserve-btn" @click.stop="router.push(`/barbershop/${barberia.id}`)">Reservar</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Login v-if="showLogin" @close="showLogin = false" />
  </div>
</template>

<style scoped>

@font-face {
    font-family: 'FuenteBlesh';
    src: url('../fonts/BleshForte.otf') format('opentype'); 
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'FuenteBarber';
    src: url('../fonts/BarberStreet.ttf') format('opentype'); 
    font-weight: normal;
    font-style: normal;
}

.page-shell {
  display: flex;
  min-height: 100vh;
  background: #111;
}

.main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
  padding: 40px 80px;
  color: white;
  transition: margin-left 0.3s ease, width 0.3s ease, padding 0.3s ease;
}

.main-content.sidebar-minimized {
  margin-left: 180px;
  width: calc(100% - 80px);
  padding: 40px 80px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.2rem;
  font-family: 'FuenteBlesh', sans-serif;
}

.search-input {
  width: 320px;
  padding: 15px 20px;
  border-radius: 16px;
  border: 1px solid #333;
  background: #1b1b1b;
  color: white;
  outline: none;
  font-size: 1rem;
}

.search-input:focus {
  border-color: #BF924B;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.main-content.sidebar-minimized .grid {
  grid-template-columns: repeat(4, 1fr);
}

.card {
  background: #1a1a1a;
  border-radius: 24px;
  overflow: hidden;
  transition: .3s;
  border: 1px solid rgba(255,255,255,.05);
}

.card:hover {
  transform: translateY(-8px);
}

.card-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s ease;
  color: #6b7280;
}

.favorite-btn:hover {
  background: white;
  transform: scale(1.1);
}

.favorite-btn.is-favorite {
  color: #ef4444;
}

.card-content {
  padding: 20px;
}

.card-content h2 {
  margin-bottom: 8px;
}

.card-content p {
  color: #9ca3af;
  margin-bottom: 6px;
}

.city {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.bottom {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.price {
  color: #BF924B;
  font-weight: 600;
}

.reserve-btn {
  background: #BF924B;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
}

.reserve-btn:hover {
  opacity: 0.9;
}

.empty-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #9ca3af;
}

@media(max-width: 900px) {
  .main-content {
    margin-left: 80px;
    padding: 20px 15px;
  }

  .main-content.sidebar-minimized {
    margin-left: 80px;
    padding: 20px 15px;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .header {
    flex-direction: column;
    gap: 20px;
  }

  .search-input {
    width: 100%;
  }
}

@media(max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
