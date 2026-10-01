<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Login from '@/components/Login.vue'
import { UserRound, Heart, X, Calendar, Clock } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAgendaStore } from '@/composables/useAgendaStore'
import { useBarberStore } from '@/composables/useBarberStore'
import { useFavoritesStore } from '@/composables/useFavoritesStore'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const agendaStore = useAgendaStore()
const barberStore = useBarberStore()
const favoritesStore = useFavoritesStore()
const { avatar } = useAuth()
const { isAuthenticated } = useAuth()

// SIDEBAR TOGGLE
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

// MODAL DE AGENDAMIENTO
const showAgendaModal = ref(false)
const selectedBarberForAgenda = ref(null)

// CALENDARIO Y HORARIOS
const hoy = new Date()
const año = ref(hoy.getFullYear())
const mes = ref(hoy.getMonth())
const diaSeleccionado = ref(null)
const horaSeleccionada = ref(null)

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const horarios = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
]

const diasDelMes = computed(() => {
  return new Date(año.value, mes.value + 1, 0).getDate()
})

const primerDia = computed(() => {
  let dia = new Date(año.value, mes.value, 1).getDay()
  return dia === 0 ? 6 : dia - 1
})

// AGENDA DE USUARIO
const agendaBarbers = computed(() => {
  return agendaStore.agendaBarbers.value.filter(item =>
    !searchQuery.value || item.barberia?.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function toggleFavorite(barberId) {
  favoritesStore.toggleFavorite(barberId)
}

function isFavorite(barberId) {
  return favoritesStore.isFavorite(barberId)
}

function openAgendaModal(barber) {
  selectedBarberForAgenda.value = barber
  showAgendaModal.value = true
  diaSeleccionado.value = null
  horaSeleccionada.value = null
  ano.value = hoy.getFullYear()
  mes.value = hoy.getMonth()
}

function closeAgendaModal() {
  showAgendaModal.value = false
  selectedBarberForAgenda.value = null
}

function seleccionarDia(dia) {
  diaSeleccionado.value = dia
  horaSeleccionada.value = null
}

function seleccionarHora(hora) {
  horaSeleccionada.value = hora
}

function mesAnterior() {
  mes.value--
  if (mes.value < 0) {
    mes.value = 11
    año.value--
  }
  diaSeleccionado.value = null
}

function mesSiguiente() {
  mes.value++
  if (mes.value > 11) {
    mes.value = 0
    año.value++
  }
  diaSeleccionado.value = null
}

function confirmarAgenda() {
  if (!diaSeleccionado.value) {
    alert('Selecciona un día')
    return
  }

  if (!horaSeleccionada.value) {
    alert('Selecciona una hora')
    return
  }

  const fecha = `${diaSeleccionado.value.toString().padStart(2, '0')}/${(mes.value + 1).toString().padStart(2, '0')}/${año.value}`
  
  agendaStore.updateAgenda(selectedBarberForAgenda.value.id, fecha, horaSeleccionada.value)
  
  alert(`¡Cita agendada para el ${fecha} a las ${horaSeleccionada.value}!`)
  closeAgendaModal()
}

function removeAgenda(barberId) {
  if (confirm('¿Deseas eliminar esta reserva?')) {
    agendaStore.removeAgenda(barberId)
  }
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
          <h1 class="intro">Mis Citas</h1>
          <p>Gestiona y reserva en tus barberías favoritas</p>
        </div>

        <div class="user-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar cita..."
          />
          <div :class="['avatar-box', { 'is-authenticated': isAuthenticated }]" @click="irAPerfil">
            <img v-if="avatar" :src="avatar" class="avatar-image" alt="Foto de perfil" />
            <UserRound v-else class="user-icon" />
          </div>
        </div>
      </header>

      <!-- CITAS AGENDADAS -->
      <section class="agenda-section">
        <div class="section-header">
          <h2>📅 Mis Citas Agendadas</h2>
          <p v-if="agendaBarbers.length === 0" class="empty-text">
            No tienes citas agendadas. ¡Reserva tu corte favorito!
          </p>
        </div>

        <div v-if="agendaBarbers.length > 0" class="agenda-grid">
          <div
            v-for="item in agendaBarbers"
            :key="item.id"
            class="agenda-card"
          >
            <div
              class="card-image"
              :style="{ backgroundImage: `url(${item.barberia?.imagen || 'https://via.placeholder.com/400'})` }"
            >
              <div class="rating">
                ⭐ {{ item.barberia?.rating || 'Nueva' }}
              </div>
              <button
                class="favorite-btn"
                @click.stop="toggleFavorite(item.barberia?.id)"
                :class="{ 'is-favorite': isFavorite(item.barberia?.id) }"
              >
                <Heart :fill="isFavorite(item.barberia?.id) ? 'currentColor' : 'none'" />
              </button>
            </div>

            <div class="card-body">
              <h3>{{ item.barberia?.nombre }}</h3>
              <p class="location">{{ item.barberia?.direccion }} · {{ item.barberia?.ciudad }}</p>

              <div class="agenda-info">
                <div v-if="item.fecha" class="info-item">
                  <Calendar class="icon" />
                  <span>{{ item.fecha }}</span>
                </div>
                <div v-if="item.hora" class="info-item">
                  <Clock class="icon" />
                  <span>{{ item.hora }}</span>
                </div>
              </div>

              <div class="card-footer">
                <button
                  class="edit-btn"
                  @click="openAgendaModal(item.barberia)"
                >
                  Cambiar fecha
                </button>
                <button
                  class="remove-btn"
                  @click="removeAgenda(item.barberia?.id)"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- BUSCAR Y AGENDAR NUEVAS BARBERÍAS -->
      <section class="explore-section">
        <h2>🔍 Explora y Agenda Nuevas Barberías</h2>

        <div class="explore-grid">
          <div
            v-if="barberStore.barbers.value.length === 0"
            class="empty-state"
          >
            <p>No hay barberías disponibles</p>
          </div>

          <div
            v-for="barber in barberStore.barbers.value"
            v-else
            :key="barber.id"
            class="explore-card"
            :class="{ scheduled: agendaStore.hasAgenda(barber.id) }"
          >
            <div
              class="card-image"
              :style="{ backgroundImage: `url(${barber.imagen})` }"
            >
              <div class="rating">⭐ {{ barber.rating || 'Nueva' }}</div>
              <button
                class="favorite-btn"
                @click.stop="toggleFavorite(barber.id)"
                :class="{ 'is-favorite': isFavorite(barber.id) }"
              >
                <Heart :fill="isFavorite(barber.id) ? 'currentColor' : 'none'" />
              </button>
            </div>

            <div class="card-body">
              <h3>{{ barber.nombre }}</h3>
              <p class="location">{{ barber.direccion }}</p>

              <div class="tags">
                <span v-for="(servicio, index) in barber.servicios" :key="index">
                  {{ servicio.nombre || servicio }}
                </span>
              </div>

              <button
                v-if="!agendaStore.hasAgenda(barber.id)"
                class="schedule-btn"
                @click="openAgendaModal(barber)"
              >
                Agendar Cita
              </button>
              <button v-else class="scheduled-btn" disabled>
                ✓ Cita Agendada
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- MODAL DE AGENDAMIENTO -->
    <div v-if="showAgendaModal" class="modal-overlay" @click.self="closeAgendaModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeAgendaModal">
          <X />
        </button>

        <h2>Agenda tu cita en {{ selectedBarberForAgenda?.nombre }}</h2>

        <div class="modal-body">
          <!-- CALENDARIO -->
          <div class="calendar-section">
            <h3>Selecciona un día</h3>

            <div class="calendar">
              <div class="calendar-header">
                <button @click="mesAnterior">◀</button>
                <h3>{{ meses[mes] }} {{ año }}</h3>
                <button @click="mesSiguiente">▶</button>
              </div>

              <div class="dias-semana">
                <div>Lun</div>
                <div>Mar</div>
                <div>Mié</div>
                <div>Jue</div>
                <div>Vie</div>
                <div>Sáb</div>
                <div>Dom</div>
              </div>

              <div class="dias-grid">
                <div
                  v-for="n in primerDia"
                  :key="'vacio' + n"
                  class="dia-vacio"
                ></div>

                <div
                  v-for="dia in diasDelMes"
                  :key="dia"
                  class="dia"
                  :class="{ activo: diaSeleccionado === dia }"
                  @click="seleccionarDia(dia)"
                >
                  {{ dia }}
                </div>
              </div>
            </div>
          </div>

          <!-- HORARIOS -->
          <div v-if="diaSeleccionado" class="horarios-section">
            <h3>Selecciona una hora</h3>

            <div class="horarios-grid">
              <div
                v-for="hora in horarios"
                :key="hora"
                class="hora"
                :class="{ seleccionado: horaSeleccionada === hora }"
                @click="seleccionarHora(hora)"
              >
                {{ hora }}
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="closeAgendaModal">Cancelar</button>
          <button
            class="confirm-btn"
            @click="confirmarAgenda"
            :disabled="!diaSeleccionado || !horaSeleccionada"
          >
            Confirmar Cita
          </button>
        </div>
      </div>
    </div>

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
.agenda-section,
.explore-section {
  margin-bottom: 60px;
}

.section-header {
  margin-bottom: 35px;
}

.section-header h2,
.explore-section h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.empty-text {
  color: #9ca3af;
  font-size: 1rem;
}

/* GRIDS */
.agenda-grid,
.explore-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 28px;
  margin-top: 25px;
}

/* TARJETAS */
.agenda-card,
.explore-card {
  background: #1a1a1a;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.agenda-card:hover,
.explore-card:hover {
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

.favorite-btn {
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
  color: #BF924B;
  transition: all 0.3s ease;
  z-index: 2;
}

.favorite-btn:hover {
  background: rgba(191, 146, 75, 0.2);
  transform: scale(1.1);
}

.favorite-btn.is-favorite {
  color: #ff6b6b;
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

.agenda-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #BF924B;
  font-size: 0.95rem;
  background: rgba(191, 146, 75, 0.1);
  padding: 10px 14px;
  border-radius: 8px;
}

.info-item .icon {
  width: 18px;
  height: 18px;
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

.schedule-btn,
.edit-btn,
.confirm-btn {
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

.schedule-btn:hover,
.edit-btn:hover,
.confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(191, 146, 75, 0.4);
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.remove-btn,
.cancel-btn {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: #ff6b6b;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.remove-btn:hover,
.cancel-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  border-color: #ff6b6b;
}

.scheduled-btn {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: rgba(107, 207, 107, 0.2);
  color: #6bcf6b;
  border-radius: 10px;
  font-weight: 600;
  cursor: default;
}

.explore-card.scheduled {
  opacity: 0.6;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 24px;
  padding: 40px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid rgba(191, 146, 75, 0.2);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #BF924B;
}

.modal-content h2 {
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

.calendar-section h3,
.horarios-section h3 {
  margin-bottom: 20px;
  font-size: 1.1rem;
  font-weight: 600;
}

.calendar {
  background: #252525;
  padding: 20px;
  border-radius: 16px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: #BF924B;
  color: #000;
  cursor: pointer;
  font-size: 18px;
  transition: 0.3s;
}

.calendar-header button:hover {
  transform: scale(1.05);
}

.calendar-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.dias-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
  text-align: center;
}

.dias-semana div {
  color: #9ca3af;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 8px 0;
}

.dias-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.dia-vacio {
  height: 40px;
}

.dia {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #1a1a1a;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.dia:hover {
  background: #BF924B;
  color: #000;
}

.dia.activo {
  background: #BF924B;
  color: #000;
  font-weight: 700;
}

.horarios-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.hora {
  padding: 14px;
  background: #252525;
  border: 1px solid transparent;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.hora:hover {
  background: #BF924B;
  color: #000;
  border-color: #BF924B;
}

.hora.seleccionado {
  background: #BF924B;
  color: #000;
  font-weight: 700;
  border-color: #BF924B;
}

.modal-footer {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.modal-footer button {
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  font-size: 0.95rem;
}

@media (max-width: 1024px) {
  .modal-body {
    grid-template-columns: 1fr;
  }

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

  .agenda-grid,
  .explore-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 30px 20px;
  }

  .horarios-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
