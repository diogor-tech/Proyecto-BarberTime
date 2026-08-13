<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Login from '@/components/Login.vue'
import { Heart, MapPin, Star, Clock, ArrowLeft } from 'lucide-vue-next'
import { useBarberStore } from '@/composables/useBarberStore'
import { useFavoritesStore } from '@/composables/useFavoritesStore'
import { useAgendaStore } from '@/composables/useAgendaStore'

const router = useRouter()
const route = useRoute()
const barberStore = useBarberStore()
const favoritesStore = useFavoritesStore()
const agendaStore = useAgendaStore()

const sidebarMinimized = ref(false)
const showLogin = ref(false)
const showAgendaModal = ref(false)
const selectedDate = ref('')
const selectedTime = ref('')

const handleToggleSidebar = (isMinimized) => {
  sidebarMinimized.value = isMinimized
}

const barberId = computed(() => route.params.id)

const barber = computed(() => {
  return barberStore.getBarberById(barberId.value)
})

function toggleFavorite() {
  favoritesStore.toggleFavorite(barberId.value)
}

function isFavorite() {
  return favoritesStore.isFavorite(barberId.value)
}

function openAgendaModal() {
  showAgendaModal.value = true
}

function closeAgendaModal() {
  showAgendaModal.value = false
  selectedDate.value = ''
  selectedTime.value = ''
}

function confirmAgenda() {
  agendaStore.addAgenda(barberId.value, selectedDate.value, selectedTime.value)
  closeAgendaModal()
  alert('¡Reserva confirmada!')
}

function hasAgenda() {
  return agendaStore.hasAgenda(barberId.value)
}
</script>

<template>
  <div class="page-shell">
    <Sidebar @openLogin="showLogin = true" @toggleSidebar="handleToggleSidebar" />

    <main :class="['detail-page', { 'sidebar-minimized': sidebarMinimized }]">
      <!-- Botón atrás -->
      <button class="back-btn" @click="router.back()">
        <ArrowLeft class="back-icon" />
        Atrás
      </button>

      <div v-if="barber" class="detail-container">
        <!-- Hero Image -->
        <div class="hero-section">
          <img :src="barber.imagen" :alt="barber.nombre" class="hero-image" />
          <button
            class="favorite-btn-large"
            @click="toggleFavorite"
            :class="{ 'is-favorite': isFavorite() }"
          >
            <Heart :fill="isFavorite() ? 'currentColor' : 'none'" class="heart-icon" />
          </button>
        </div>

        <!-- Info Section -->
        <div class="info-section">
          <div class="header-info">
            <div>
              <h1>{{ barber.nombre }}</h1>
              <div class="rating-section">
                <span class="rating">⭐ {{ barber.rating }} / 5</span>
              </div>
            </div>
            <span class="price-badge">${{ barber.precio }}</span>
          </div>

          <!-- Location -->
          <div class="location-section">
            <MapPin class="location-icon" />
            <div>
              <p class="location-text">{{ barber.direccion }}</p>
              <p class="city-text">{{ barber.ciudad }}</p>
            </div>
          </div>

          <!-- Estado -->
          <div class="status-section">
            <div :class="['status-badge', barber.disponible ? 'open' : 'closed']">
              {{ barber.disponible ? '✓ Disponible ahora' : '✗ Cerrado' }}
            </div>
          </div>

          <!-- Servicios -->
          <div v-if="barber.servicios && barber.servicios.length > 0" class="services-section">
            <h3>Servicios disponibles</h3>
            <div class="services-grid">
              <div v-for="servicio in barber.servicios" :key="servicio" class="service-tag">
                {{ servicio }}
              </div>
            </div>
          </div>

          <!-- Descripción -->
          <div v-if="barber.descripcion" class="description-section">
            <h3>Descripción</h3>
            <p>{{ barber.descripcion }}</p>
          </div>

          <!-- Horario -->
          <div class="schedule-section">
            <h3>Horario de atención</h3>
            <div v-if="barber.horario" class="schedule-info">
              <p>{{ barber.horario }}</p>
            </div>
            <div v-else class="schedule-info">
              <p>Lunes a Viernes: 9:00 AM - 8:00 PM</p>
              <p>Sábado: 9:00 AM - 6:00 PM</p>
              <p>Domingo: Cerrado</p>
            </div>
          </div>

          <!-- Botón grande de agendar -->
          <div class="cta-section">
            <button
              v-if="!hasAgenda()"
              class="agenda-btn-large"
              @click="openAgendaModal"
            >
              Agendar Cita
            </button>
            <button v-else class="agenda-btn-large disabled" disabled>
              ✓ Ya tienes una cita agendada
            </button>
          </div>
        </div>
      </div>

      <div v-else class="not-found">
        <p>Barbería no encontrada</p>
      </div>

      <!-- Modal de Agenda -->
      <div v-if="showAgendaModal" class="modal-overlay" @click="closeAgendaModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeAgendaModal">✕</button>
          <h2>Agendar Cita en {{ barber?.nombre }}</h2>

          <div class="form-group">
            <label for="date">Selecciona una fecha:</label>
            <input
              id="date"
              v-model="selectedDate"
              type="date"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="time">Selecciona una hora:</label>
            <input
              id="time"
              v-model="selectedTime"
              type="time"
              class="form-input"
            />
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" @click="closeAgendaModal">Cancelar</button>
            <button
              class="btn-confirm"
              @click="confirmAgenda"
              :disabled="!selectedDate || !selectedTime"
            >
              Confirmar
            </button>
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

.page-shell {
  display: flex;
  width: 100%;
}

.detail-page {
  margin-left: 280px;
  width: calc(100% - 280px);
  padding: 40px 80px;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color: white;
  min-height: 100vh;
  transition: margin-left 0.3s ease, width 0.3s ease, padding 0.3s ease;
}

.detail-page.sidebar-minimized {
  margin-left: 100px;
  width: calc(100% - 100px);
  padding: 40px 50px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.back-icon {
  width: 18px;
  height: 18px;
}

.detail-container {
  max-width: 900px;
  margin: 0 auto;
}

.hero-section {
  position: relative;
  margin-bottom: 40px;
  border-radius: 20px;
  overflow: hidden;
  height: 400px;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-btn-large {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.favorite-btn-large:hover {
  background: rgba(255, 72, 72, 0.8);
}

.favorite-btn-large.is-favorite {
  background: rgba(255, 72, 72, 1);
  color: white;
}

.heart-icon {
  width: 24px;
  height: 24px;
}

.info-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.header-info h1 {
  font-size: 2.5rem;
  font-family: 'FuenteBlesh', sans-serif;
  margin: 0 0 10px 0;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating {
  font-size: 1.1rem;
  color: #ffd700;
}

.price-badge {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ff4848;
  padding: 10px 20px;
  background: rgba(255, 72, 72, 0.1);
  border-radius: 8px;
}

.location-section {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.location-icon {
  width: 24px;
  height: 24px;
  color: #ff4848;
  flex-shrink: 0;
  margin-top: 2px;
}

.location-text {
  font-size: 1.1rem;
  margin: 0;
}

.city-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 5px 0 0 0;
}

.status-section {
  margin-bottom: 30px;
}

.status-badge {
  display: inline-block;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
}

.status-badge.open {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.status-badge.closed {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.services-section {
  margin-bottom: 30px;
}

.services-section h3 {
  font-size: 1.3rem;
  margin: 0 0 15px 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.service-tag {
  background: rgba(255, 72, 72, 0.2);
  color: #ff4848;
  padding: 10px 15px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(255, 72, 72, 0.3);
}

.description-section {
  margin-bottom: 30px;
}

.description-section h3 {
  font-size: 1.3rem;
  margin: 0 0 15px 0;
}

.description-section p {
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.schedule-section {
  margin-bottom: 30px;
}

.schedule-section h3 {
  font-size: 1.3rem;
  margin: 0 0 15px 0;
}

.schedule-info {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px 20px;
  border-radius: 8px;
  border-left: 4px solid #ff4848;
}

.schedule-info p {
  margin: 8px 0;
  color: rgba(255, 255, 255, 0.9);
}

.cta-section {
  margin-top: 40px;
  display: flex;
  gap: 15px;
}

.agenda-btn-large {
  flex: 1;
  padding: 18px 40px;
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ff4848, #ff6b6b);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.agenda-btn-large:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 72, 72, 0.4);
}

.agenda-btn-large.disabled {
  background: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
  opacity: 0.6;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content h2 {
  margin: 0 0 25px 0;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #ff4848;
  box-shadow: 0 0 0 3px rgba(255, 72, 72, 0.1);
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-confirm {
  background: linear-gradient(135deg, #ff4848, #ff6b6b);
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 72, 72, 0.3);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .detail-page {
    margin-left: 80px;
    padding: 30px 20px;
  }

  .hero-section {
    height: 250px;
  }

  .header-info {
    flex-direction: column;
  }

  .info-section {
    padding: 25px;
  }

  .header-info h1 {
    font-size: 1.8rem;
  }

  .services-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}
</style>
