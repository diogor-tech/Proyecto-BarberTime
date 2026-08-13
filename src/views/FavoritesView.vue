<script setup>

import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Login from '@/components/Login.vue'
import { useRouter } from 'vue-router'
import { Scissors, Heart, ZapIcon, BellPlus, LensConcaveIcon } from 'lucide-vue-next'
import { useFavoritesStore } from '@/composables/useFavoritesStore'

const router = useRouter()
const favoritesStore = useFavoritesStore()

const sidebarMinimized = ref(false)
const handleToggleSidebar = (isMinimized) => {
  sidebarMinimized.value = isMinimized
}

const showLogin = ref(false)

// Computed local para acceder a favoriteBarbers de forma segura
const favoriteBarbersList = computed(() => {
  const barbers = favoritesStore.favoriteBarbers
  return Array.isArray(barbers) ? barbers : []
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
  <Sidebar @openLogin="showLogin = true" @toggleSidebar="handleToggleSidebar" />
  <main :class="['favorites-page', { 'sidebar-minimized': sidebarMinimized }]">

    <header class="favorites-header">

      <div>
        <h1>Tus Favoritas</h1>

        <p>
          Guarda barberías para encontrarlas rápidamente más tarde.
        </p>
      </div>

      <button class="explore-button" @click="router.push('/explore')">
        Explorar barberías
      </button>

    </header>

    <section class="favorites-banner">

      <div class="banner-content">

        <h2>
          Tus mejores cortes, siempre a un clic <Scissors class="scissorsicon" />
        </h2>

        <p>
          Guarda barberías favoritas, compara estilos,
          revisa promociones y organiza tus próximas reservas.
        </p>

      </div>

    </section>

    <section
      v-if="favoriteBarbersList.length === 0"
      class="empty-state"
    >

      <div class="empty-icon">
        <Heart class="hearticon" />
      </div>

      <h2>
        No tienes barberías favoritas
      </h2>

      <p>
        Cuando marques una barbería como favorita,
        aparecerá aquí para que puedas acceder
        rápidamente a ella.
      </p>

      <button class="favorite-button" @click="router.push('/explore')">
        Buscar barberías
      </button>

    </section>

    <section v-else class="favorites-grid">
      <div
        v-for="barber in favoriteBarbersList"
        :key="barber.id"
        class="favorite-card"
        @click="viewBarbershop(barber.id)"
        role="button"
      >
        <div class="card-image-wrapper">
          <img :src="barber.imagen" :alt="barber.nombre" class="card-image" />
          <button
            class="remove-favorite-btn"
            @click.stop="removeFavorite(barber.id)"
            title="Quitar de favoritos"
          >
            <Heart fill="currentColor" class="heart-icon" />
          </button>
        </div>

        <div class="card-info">
          <h3>{{ barber.nombre }}</h3>
          <p class="location">{{ barber.direccion }}, {{ barber.ciudad }}</p>

          <div class="card-meta">
            <span class="rating">⭐ {{ barber.rating }}</span>
            <span class="price">${{ barber.precio }}</span>
          </div>

          <div v-if="barber.servicios && barber.servicios.length > 0" class="services-tags">
            <span v-for="servicio in barber.servicios.slice(0, 3)" :key="servicio" class="tag">
              {{ servicio }}
            </span>
          </div>

          <button class="schedule-btn" @click.stop="viewBarbershop(barber.id)">
            Ver detalles
          </button>
        </div>
      </div>
    </section>

    <section class="benefits-grid" v-if="favoriteBarbersList.length === 0">

      <div class="benefit-card">

        <div class="benefit-icon">
          <ZapIcon class="zapicon" />
        </div>

        <h3>
          Acceso rápido
        </h3>

        <p>
          Encuentra tus barberías favoritas sin tener
          que buscarlas nuevamente.
        </p>

      </div>

      <div class="benefit-card">

        <div class="benefit-icon">
          <BellPlus class="bellplusicon" />
        </div>

        <h3>
          Promociones
        </h3>

        <p>
          Recibe notificaciones sobre descuentos
          y eventos especiales.
        </p>

      </div>

      <div class="benefit-card">

        <div class="benefit-icon">
          <LensConcaveIcon class="lensconcaveicon" />
        </div>

        <h3>
          Tus estilos favoritos
        </h3>

        <p>
          Mantén organizadas las barberías
          que mejor encajan contigo.
        </p>

      </div>

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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.favorites-page {
  margin-left: 280px;
  min-height: 100vh;
  padding: 45px;
  background: #0b0b0b;
  color: white;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  position: relative;
  overflow-x: hidden;
  transition: margin-left 0.28s ease, width 0.28s ease, padding 0.28s ease, transform 0.28s ease;
}

.favorites-page.sidebar-minimized {
  margin-left: 80px;
  width: calc(100% - 80px);
  padding: 45px 110px;
}

/* Fondo */

.favorites-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at top left,
      rgba(255, 72, 72, 0.08),
      transparent 30%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(255, 196, 101, 0.08),
      transparent 35%
    );
  z-index: -1;
}

.favorites-header,
.favorites-banner,
.empty-state,
.benefits-grid {
  position: relative;
  z-index: 1;
}

/* Header */

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
}

.favorites-header h1 {
  font-size: 2.4rem;
  margin-bottom: 10px;
  color: #ffffff;
  font-family: 'FuenteBlesh', sans-serif;
}

.favorites-header p {
  color: #9ca3af;
  font-size: 1rem;
}

.explore-button {
  background: linear-gradient(135deg, #ffb347, #ffd27a);
  border: none;
  padding: 14px 24px;
  border-radius: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.28s;
}

.explore-button:hover {
  transform: translateY(-3px);
}

/* Banner */

.favorites-banner {
  background: linear-gradient(135deg, rgba(255, 179, 71, 0.15), rgba(0,0,0,0.6));
  border: 1px solid rgba(255,255,255,0.05);
  padding: 35px;
  border-radius: 28px;
  margin-bottom: 40px;
}

.banner-content h2 {
  font-size: 2rem;
  margin-bottom: 14px;
}

.banner-content p {
  color: #cfcfcf;
  line-height: 1.7;
  max-width: 750px;
}

.scissorsicon {
  margin-left: 6px;
  color: #ffcc73;
  width: 20px;
  height: 20px;
}

/* Empty */

.empty-state {
  background: #141414;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 30px;
  padding: 65px 30px;
  text-align: center;
  margin-bottom: 45px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.hearticon {
  color: #ff8484;
  fill: #ff8484;
  width: 84px;
  height: 84px;
}

.empty-state h2 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.empty-state p {
  color: #9ca3af;
  max-width: 650px;
  margin: auto;
  line-height: 1.7;
  margin-bottom: 30px;
}

.favorite-button {
  background: linear-gradient(135deg, #ffb347, #ffd27a);
  border: none;
  padding: 15px 28px;
  border-radius: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.28s;
}

.favorite-button:hover {
  transform: scale(1.04);
}

/* Cards */

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
  margin-bottom: 45px;
}

.favorite-card {
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  overflow: hidden;
  transition: 0.3s ease;
}

.favorite-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 179, 71, 0.3);
}

.card-image-wrapper {
  position: relative;
  height: 240px;
  overflow: hidden;
  background: #1f2937;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s ease;
  color: #ef4444;
}

.remove-favorite-btn:hover {
  background: white;
  transform: scale(1.1);
}

.heart-icon {
  width: 22px;
  height: 22px;
}

.card-info {
  padding: 24px;
}

.card-info h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #ffffff;
}

.location {
  color: #9ca3af;
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.rating {
  color: #ffcc73;
  font-weight: 600;
}

.price {
  color: #ffb347;
  font-weight: 700;
  font-size: 1.1rem;
}

.services-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tag {
  background: rgba(255, 179, 71, 0.15);
  color: #ffcc73;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
}

.schedule-btn {
  width: 100%;
  background: linear-gradient(135deg, #ffb347, #ffd27a);
  border: none;
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
  color: #000;
}

.schedule-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 179, 71, 0.3);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.benefit-card {
  background: #141414;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  padding: 30px;
  transition: 0.3s;
}

.benefit-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 179, 71, 0.3);
}

.benefit-icon {
  font-size: 2.3rem;
  margin-bottom: 18px;
}

.zapicon,
.bellplusicon,
.lensconcaveicon {
  width: 22px;
  height: 22px;
  color: #ffcc73;
  margin-left: 6px;
}

.benefit-card h3 {
  margin-bottom: 12px;
  color: #ffcc73;
}

.benefit-card p {
  color: #c2c2c2;
  line-height: 1.7;
}

/* Responsive */

@media (max-width: 1100px) {
  .benefits-grid {
    grid-template-columns: 1fr;
  }

  .favorites-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}

@media (max-width: 900px) {
  .favorites-page {
    margin-left: 0;
    padding: 25px;
  }

  .favorites-header h1 {
    font-size: 2.2rem;
  }
}

</style>