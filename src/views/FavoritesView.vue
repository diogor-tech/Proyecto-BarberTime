<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Login from '@/components/Login.vue'
import { useRouter } from 'vue-router'
import { Heart, UserRound, Star } from 'lucide-vue-next'
import { useFavoritesStore } from '@/composables/useFavoritesStore'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const favoritesStore = useFavoritesStore()
const { avatar } = useAuth()
const { isAuthenticated } = useAuth()

const sidebarMinimized = ref(false)
const handleToggleSidebar = (isMinimized) => {
  sidebarMinimized.value = isMinimized
}

const showLogin = ref(false)

function irAPerfil() {
  if (isAuthenticated.value) {
    router.push('/profile')
    return
  }

  showLogin.value = true
}
const searchQuery = ref('')

// Computed para acceder a favoriteBarbers con búsqueda
const favoriteBarbersList = computed(() => {
  const list = favoritesStore.favoriteBarbers.value || []
  
  if (!searchQuery.value) return list
  
  return list.filter(barber =>
    barber.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    barber.ciudad.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function removeFavorite(barberId) {
  favoritesStore.removeFavorite(barberId)
}

function viewBarbershop(barberId) {
  router.push(`/barbershop/${barberId}`)
}
</script>

<template>
  <div class="page-shell">
    <Sidebar
      @openLogin="showLogin = true"
      @toggleSidebar="handleToggleSidebar"
    />

    <main :class="['main-content', { 'sidebar-minimized': sidebarMinimized }]">
      <header class="topbar">
        <div>
          <h1 class="intro">Mis Favoritas</h1>
          <p>Tus barberías preferidas guardadas en un solo lugar</p>
        </div>

        <div class="user-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar favorita..."
          />
          <div :class="['avatar-box', { 'is-authenticated': isAuthenticated }]" @click="irAPerfil">
            <img v-if="avatar" :src="avatar" class="avatar-image" alt="Foto de perfil" />
            <UserRound v-else class="user-icon" />
          </div>
        </div>
      </header>

      <!-- BARBERÍAS FAVORITAS -->
      <section v-if="favoriteBarbersList.length > 0" class="favorites-section">
        <h2>❤️ Mis Barberías Favoritas</h2>

        <div class="favorites-grid">
          <div
            v-for="barber in favoriteBarbersList"
            :key="barber.id"
            class="favorite-card"
          >
            <div
              class="card-image"
              :style="{ backgroundImage: `url(${barber.imagen})` }"
            >
              <div class="rating">
                ⭐ {{ barber.rating || 'Nueva' }}
              </div>
              <button
                class="remove-btn"
                @click.stop="removeFavorite(barber.id)"
                title="Quitar de favoritos"
              >
                <Heart :fill="'currentColor'" />
              </button>
            </div>

            <div class="card-body">
              <h3>{{ barber.nombre }}</h3>
              <p class="location">{{ barber.direccion }} · {{ barber.ciudad }}</p>

              <div class="card-info">
                <span class="price">${{ barber.precio }}</span>
                <span v-if="barber.disponible" class="status available">Disponible</span>
                <span v-else class="status closed">Cerrado</span>
              </div>

              <div v-if="barber.servicios" class="tags">
                <span
                  v-for="servicio in barber.servicios.slice(0, 3)"
                  :key="servicio"
                >
                  {{ servicio }}
                </span>
              </div>

              <div class="card-footer">
                <button
                  class="view-btn"
                  @click.stop="viewBarbershop(barber.id)"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ESTADO VACÍO -->
      <section v-else class="empty-state">
        <div class="empty-icon">
          <Heart />
        </div>
        <h2>Sin favoritas aún</h2>
        <p>Cuando marques una barbería como favorita, aparecerá aquí para acceso rápido.</p>
        <button class="explore-btn" @click="router.push('/explore')">
          Explorar Barberías
        </button>
      </section>
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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  min-height: 100%;
}

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(45deg, #111111, #000000);
  color: white;
  display: flex;
  min-height: 100vh;
}

.page-shell {
  display: flex;
  width: 100%;
}

.main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
  padding: 35px 100px 50px;
  transition: margin-left 0.3s ease, width 0.3s ease, padding 0.3s ease;
}

.main-content.sidebar-minimized {
  margin-left: 80px;
  width: calc(100% - 80px);
  padding: 35px 120px 50px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 45px;
}

.topbar h1 {
  font-size: 2.2rem;
  font-family: 'FuenteBlesh', sans-serif;
  margin-bottom: 8px;
}

.topbar p {
  color: #9ca3af;
  font-size: 0.95rem;
}

.intro {
  font-family: 'FuenteBlesh', sans-serif;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-box input {
  background: #1f2937;
  border: none;
  padding: 15px 20px;
  border-radius: 14px;
  color: white;
  width: 280px;
  outline: none;
  font-size: 0.95rem;
}

.user-box input::placeholder {
  color: #9ca3af;
}

.avatar-box {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(191, 146, 75, 0.12), rgba(255, 183, 67, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  cursor: pointer;
}

.avatar-box.is-authenticated {
  border-radius: 50%;
  overflow: hidden;
}

.avatar-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

.user-icon {
  color: #BF924B;
  width: 28px;
  height: 28px;
}

/* SECCIONES */
.favorites-section {
  margin-bottom: 60px;
}

.favorites-section h2 {
  font-size: 1.8rem;
  margin-bottom: 30px;
  font-weight: 600;
}

/* GRID */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 28px;
}

/* TARJETAS */
.favorite-card {
  background: #1a1a1a;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.favorite-card:hover {
  transform: translateY(-8px);
  border-color: rgba(191, 146, 75, 0.3);
  box-shadow: 0 12px 40px rgba(191, 146, 75, 0.15);
}

.card-image {
  height: 220px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.card-image::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
}

.rating {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 2;
}

.remove-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ff6b6b;
  transition: all 0.3s ease;
  z-index: 2;
}

.remove-btn:hover {
  background: rgba(255, 107, 107, 0.2);
  transform: scale(1.1);
}

.card-body {
  padding: 20px;
}

.card-body h3 {
  font-size: 1.25rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.location {
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.card-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.price {
  color: #BF924B;
  font-weight: 700;
  font-size: 1.1rem;
}

.status {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}

.status.available {
  background: rgba(107, 207, 107, 0.2);
  color: #6bcf6b;
}

.status.closed {
  background: rgba(255, 107, 107, 0.2);
  color: #ff9999;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tags span {
  background: rgba(191, 146, 75, 0.15);
  color: #BF924B;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.card-footer {
  display: flex;
  gap: 10px;
}

.view-btn,
.explore-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #BF924B, #ffb743);
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.view-btn:hover,
.explore-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(191, 146, 75, 0.4);
}

/* ESTADO VACÍO */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 40px;
  background: linear-gradient(135deg, rgba(191, 146, 75, 0.1), rgba(0, 0, 0, 0.5));
  border: 1px solid rgba(191, 146, 75, 0.2);
  border-radius: 24px;
}

.empty-icon {
  color: #ff6b6b;
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-state h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.empty-state p {
  color: #9ca3af;
  font-size: 1rem;
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .main-content {
    padding: 35px 50px 50px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 25px 20px 50px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .user-box {
    width: 100%;
  }

  .user-box input {
    flex: 1;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .empty-state {
    padding: 60px 20px;
  }
}
</style>