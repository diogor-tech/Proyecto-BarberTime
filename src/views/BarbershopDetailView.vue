<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import { useRouter, useRoute } from 'vue-router'

import Sidebar from '@/components/Sidebar.vue'
import Login from '@/components/Login.vue'

import {
  Heart,
  MapPin,
  Star,
  ArrowLeft
} from 'lucide-vue-next'

import { useBarberStore } from '@/composables/useBarberStore'
import { useFavoritesStore } from '@/composables/useFavoritesStore'
import { useAgendaStore } from '@/composables/useAgendaStore'
import { useAuth } from '@/composables/useAuth'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

/* =========================
   INSTANCIAS
   ========================= */

const router = useRouter()
const route = useRoute()

const barberStore = useBarberStore()
const favoritesStore = useFavoritesStore()
const agendaStore = useAgendaStore()

const {
  isAuthenticated,
  currentUser
} = useAuth()


/* =========================
   ESTADO
   ========================= */

const sidebarMinimized = ref(false)

const showLogin = ref(false)

const showAgendaModal = ref(false)

const selectedDate = ref('')
const selectedTime = ref('')

const ratingMessage = ref('')

const newComment = ref('')
const comments = ref([])


/* =========================
   BARBERÍA
   ========================= */

const barberId = computed(() => route.params.id)

const barber = computed(() => {
  return barberStore.getBarberById(
    barberId.value
  )
})


/* =========================
   SIDEBAR
   ========================= */

function handleToggleSidebar(isMinimized) {
  sidebarMinimized.value = isMinimized
}


/* =========================
   COMENTARIOS
   ========================= */

function cargarComentarios() {
  const key = `comments:${barberId.value}`

  try {
    comments.value = JSON.parse(
      localStorage.getItem(key) || '[]'
    )
  } catch {
    comments.value = []
  }
}


function agregarComentario() {

  if (!isAuthenticated.value) {
    showLogin.value = true
    return
  }

  if (!newComment.value.trim()) {
    alert(
      'Escribe un comentario antes de publicar.'
    )
    return
  }

  const comentario = {
    id: Date.now(),

    userName:
      currentUser.value?.name ||
      currentUser.value?.email ||
      'Usuario',

    userEmail:
      currentUser.value?.email || '',

    text:
      newComment.value.trim(),

    date:
      new Date().toLocaleDateString('es-UY')
  }

  comments.value.unshift(comentario)

  localStorage.setItem(
    `comments:${barberId.value}`,
    JSON.stringify(comments.value)
  )

  newComment.value = ''
}


function eliminarComentario(id) {

  comments.value =
    comments.value.filter(
      comentario =>
        comentario.id !== id
    )

  localStorage.setItem(
    `comments:${barberId.value}`,
    JSON.stringify(comments.value)
  )
}


/* =========================
   CALIFICACIONES
   ========================= */

const ratedBarbersKey = computed(
  () =>
    `ratedBarbers:${
      currentUser.value?.email || 'guest'
    }`
)


const ratedBarbers = ref(
  readRatedBarbers()
)


function readRatedBarbers() {

  try {

    return JSON.parse(
      localStorage.getItem(
        `ratedBarbers:${
          currentUser.value?.email || 'guest'
        }`
      ) || '[]'
    )

  } catch {

    return []

  }
}


function hasRated() {

  return ratedBarbers.value.includes(
    barberId.value
  )
}


function rateBarber(score) {

  ratingMessage.value = ''

  if (!isAuthenticated.value) {
    showLogin.value = true
    return
  }

  if (hasRated()) {

    ratingMessage.value =
      'Ya calificaste esta barbería.'

    return
  }

  barberStore.rateBarber(
    barberId.value,
    score
  )

  ratedBarbers.value = [
    ...ratedBarbers.value,
    barberId.value
  ]

  localStorage.setItem(
    ratedBarbersKey.value,
    JSON.stringify(
      ratedBarbers.value
    )
  )

  ratingMessage.value =
    'Gracias por compartir tu opinión.'
}


/* =========================
   MAPA
   ========================= */

let clientMap = null


function cargarMapaCliente() {

  if (
    !barber.value?.latitud ||
    !barber.value?.longitud
  ) {
    return
  }

  const mapElement =
    document.getElementById(
      'client-map'
    )

  if (!mapElement) {
    return
  }

  if (clientMap) {

    clientMap.remove()
    clientMap = null

  }

  const lat =
    Number(barber.value.latitud)

  const lng =
    Number(barber.value.longitud)


  clientMap = L.map(
    mapElement
  ).setView(
    [lat, lng],
    16
  )


  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution:
        '&copy; OpenStreetMap contributors'
    }
  ).addTo(clientMap)


  L.marker([lat, lng])
    .addTo(clientMap)
    .bindPopup(
      `<b>${barber.value.nombre}</b><br>${barber.value.direccion}`
    )
    .openPopup()


  setTimeout(() => {

    if (clientMap) {
      clientMap.invalidateSize()
    }

  }, 100)

}


/* =========================
   GOOGLE MAPS
   ========================= */

function abrirGoogleMaps() {

  if (
    !barber.value?.latitud ||
    !barber.value?.longitud
  ) {
    return
  }

  const url =
    `https://www.google.com/maps/dir/?api=1&destination=${barber.value.latitud},${barber.value.longitud}`

  window.open(
    url,
    '_blank'
  )
}


/* =========================
   FAVORITOS
   ========================= */

function toggleFavorite() {

  if (!isAuthenticated.value) {
    showLogin.value = true
    return
  }

  favoritesStore.toggleFavorite(
    barberId.value
  )
}


function isFavorite() {

  return favoritesStore.isFavorite(
    barberId.value
  )
}


/* =========================
   AGENDA
   ========================= */

function openAgendaModal() {

  if (!isAuthenticated.value) {
    showLogin.value = true
    return
  }

  showAgendaModal.value = true
}


function closeAgendaModal() {

  showAgendaModal.value = false

  selectedDate.value = ''
  selectedTime.value = ''
}


function confirmAgenda() {

  if (
    !selectedDate.value ||
    !selectedTime.value
  ) {
    return
  }

  agendaStore.addAgenda(
    barberId.value,
    selectedDate.value,
    selectedTime.value
  )

  closeAgendaModal()

  alert(
    '¡Reserva confirmada!'
  )
}


function hasAgenda() {

  return agendaStore.hasAgenda(
    barberId.value
  )
}


/* =========================
   INICIO
   ========================= */

onMounted(async () => {

  cargarComentarios()

  await nextTick()

  cargarMapaCliente()

})


watch(
  barberId,
  async () => {

    cargarComentarios()

    await nextTick()

    cargarMapaCliente()

  }
)


watch(
  barber,
  async () => {

    await nextTick()

    cargarMapaCliente()

  }
)

</script>

<template>

  <div class="page-shell">

    <!-- =========================
         SIDEBAR
         ========================= -->

    <Sidebar
      @openLogin="showLogin = true"
      @toggleSidebar="handleToggleSidebar"
    />


    <!-- =========================
         PÁGINA
         ========================= -->

    <main
      :class="[
        'detail-page',
        {
          'sidebar-minimized':
            sidebarMinimized
        }
      ]"
    >

      <!-- ATRÁS -->

      <button
        class="back-btn"
        @click="router.back()"
      >

        <ArrowLeft
          class="back-icon"
        />

        Atrás

      </button>


      <!-- =========================
           BARBERÍA
           ========================= -->

      <div
        v-if="barber"
        class="detail-container"
      >


        <!-- =========================
             IMAGEN PRINCIPAL
             ========================= -->

        <div class="hero-section">

          <img
            :src="barber.imagen"
            :alt="barber.nombre"
            class="hero-image"
          />


          <button
            class="favorite-btn-large"
            @click="toggleFavorite"
            :class="{
              'is-favorite':
                isFavorite()
            }"
          >

            <Heart
              :fill="
                isFavorite()
                  ? 'currentColor'
                  : 'none'
              "
              class="heart-icon"
            />

          </button>

        </div>


        <!-- =========================
             INFORMACIÓN
             ========================= -->

        <div class="info-section">


          <!-- CABECERA -->

          <div class="header-info">

            <div>

              <h1>
                {{ barber.nombre }}
              </h1>


              <div
                class="rating-section"
              >

                <span
                  class="rating"
                >

                  <template
                    v-if="
                      barber.ratingCount
                    "
                  >

                    ⭐
                    {{ barber.rating }}
                    / 5 ·
                    {{ barber.ratingCount }}

                    {{
                      barber.ratingCount === 1
                        ? 'opinión'
                        : 'opiniones'
                    }}

                  </template>


                  <template v-else>

                    Sin calificaciones

                  </template>

                </span>

              </div>

            </div>


            <span
              class="price-badge"
            >
              ${{ barber.precio }}
            </span>

          </div>


          <!-- =========================
               CALIFICACIÓN
               ========================= -->

          <div class="rating-panel">

            <div>

              <h3>
                ¿Cómo fue tu experiencia?
              </h3>

              <p>
                Califica esta barbería
                después de tu visita.
              </p>

            </div>


            <div
              class="rating-stars"
              role="group"
              aria-label="Calificar barbería"
            >

              <button
                v-for="score in 5"
                :key="score"
                type="button"

                :class="{
                  selected:
                    score <=
                    (barber.rating || 0)
                    && hasRated()
                }"

                :aria-label="
                  `Calificar con ${score} estrellas`
                "

                :disabled="
                  hasRated()
                "

                @click="
                  rateBarber(score)
                "
              >

                <Star
                  :fill="
                    score <=
                    (barber.rating || 0)
                    && hasRated()
                      ? 'currentColor'
                      : 'none'
                  "
                />

              </button>

            </div>


            <p
              v-if="ratingMessage"
              class="rating-message"
            >
              {{ ratingMessage }}
            </p>

          </div>


          <!-- =========================
               UBICACIÓN
               ========================= -->

          <section
            class="location-card"
          >

            <div
              class="section-header"
            >

              <div
                class="section-icon"
              >
                <MapPin :size="23" />
              </div>


              <div>

                <span
                  class="section-label"
                >
                  UBICACIÓN
                </span>

                <h2>
                  Encontrá la barbería
                </h2>

                <p>
                  Mirá la ubicación exacta
                  y cómo llegar.
                </p>

              </div>

            </div>


            <!-- MAPA -->

            <div
              v-if="
                barber.latitud &&
                barber.longitud
              "
              id="client-map"
              class="client-map"
            ></div>


            <!-- SIN UBICACIÓN -->

            <div
              v-else
              class="no-map"
            >

              <MapPin :size="28" />

              <p>
                La ubicación todavía
                no está disponible.
              </p>

            </div>


            <!-- DIRECCIÓN -->

            <div
              class="location-bottom"
            >

              <div
                class="address-info"
              >

                <div
                  class="address-icon"
                >
                  <MapPin :size="19" />
                </div>


                <div>

                  <span>
                    Dirección
                  </span>

                  <strong>
                    {{
                      barber.direccion ||
                      'Dirección no disponible'
                    }}
                  </strong>

                  <small>
                    {{ barber.ciudad }}
                  </small>

                </div>

              </div>


              <button
                class="directions-button"
                @click="
                  abrirGoogleMaps
                "

                :disabled="
                  !barber.latitud ||
                  !barber.longitud
                "
              >

                🧭

                <span>
                  Cómo llegar
                </span>

              </button>

            </div>

          </section>


          <!-- =========================
               OPINIONES
               ========================= -->

          <section
            class="comments-section"
          >

            <div
              class="section-header"
            >

              <div
                class="section-icon"
              >
                💬
              </div>


              <div>

                <span
                  class="section-label"
                >
                  COMUNIDAD
                </span>

                <h2>
                  Opiniones de clientes
                </h2>

                <p>
                  Compartí tu experiencia
                  con esta barbería.
                </p>

              </div>

            </div>


            <!-- FORMULARIO -->

            <div
              class="comment-form"
            >

              <textarea
                v-model="newComment"
                placeholder="Cuéntanos tu experiencia con esta barbería..."
                rows="4"
              ></textarea>


              <button
                class="comment-btn"
                @click="
                  agregarComentario
                "
              >
                Publicar comentario
              </button>

            </div>


            <!-- COMENTARIOS -->

            <div
              v-if="
                comments.length > 0
              "
              class="comments-list"
            >

              <div
                v-for="
                  comentario in comments
                "
                :key="comentario.id"
                class="comment-card"
              >

                <div
                  class="comment-header"
                >

                  <div>

                    <strong>
                      {{ comentario.userName }}
                    </strong>

                    <span>
                      {{ comentario.date }}
                    </span>

                  </div>


                  <button
                    v-if="
                      currentUser?.email ===
                      comentario.userEmail
                    "
                    class="delete-comment"
                    @click="
                      eliminarComentario(
                        comentario.id
                      )
                    "
                  >
                    🗑️
                  </button>

                </div>


                <p>
                  {{ comentario.text }}
                </p>

              </div>

            </div>


            <!-- SIN COMENTARIOS -->

            <div
              v-else
              class="no-comments"
            >

              <span>
                💬
              </span>

              <p>
                Todavía no hay comentarios.
              </p>

              <small>
                ¡Sé el primero en compartir
                tu experiencia!
              </small>

            </div>

          </section>


          <!-- =========================
               ESTADO
               ========================= -->

          <div
            class="status-section"
          >

            <div
              :class="[
                'status-badge',
                barber.disponible
                  ? 'open'
                  : 'closed'
              ]"
            >

              {{
                barber.disponible
                  ? '✓ Disponible ahora'
                  : '✗ Cerrado'
              }}

            </div>

          </div>


          <!-- =========================
               SERVICIOS
               ========================= -->

          <div
            v-if="
              barber.servicios &&
              barber.servicios.length > 0
            "
            class="services-section"
          >

            <h3>
              Servicios disponibles
            </h3>


            <div
              class="services-grid"
            >

              <div
                v-for="
                  servicio in barber.servicios
                "
                :key="servicio"
                class="service-tag"
              >

                {{ servicio }}

              </div>

            </div>

          </div>


          <!-- =========================
               DESCRIPCIÓN
               ========================= -->

          <div
            v-if="barber.descripcion"
            class="description-section"
          >

            <h3>
              Descripción
            </h3>

            <p>
              {{ barber.descripcion }}
            </p>

          </div>


          <!-- =========================
               HORARIO
               ========================= -->

          <div
            class="schedule-section"
          >

            <h3>
              Horario de atención
            </h3>


            <div
              v-if="barber.horario"
              class="schedule-info"
            >

              <p>
                {{ barber.horario }}
              </p>

            </div>


            <div
              v-else
              class="schedule-info"
            >

              <p>
                Lunes a Viernes:
                9:00 AM - 8:00 PM
              </p>

              <p>
                Sábado:
                9:00 AM - 6:00 PM
              </p>

              <p>
                Domingo: Cerrado
              </p>

            </div>

          </div>


          <!-- =========================
               AGENDAR
               ========================= -->

          <div
            class="cta-section"
          >

            <button
              v-if="!hasAgenda()"
              class="agenda-btn-large"
              @click="
                openAgendaModal
              "
            >
              Agendar Cita
            </button>


            <button
              v-else
              class="agenda-btn-large disabled"
              disabled
            >
              ✓ Ya tienes una cita agendada
            </button>

          </div>


        </div>

      </div>


      <!-- =========================
           NO ENCONTRADA
           ========================= -->

      <div
        v-else
        class="not-found"
      >

        <p>
          Barbería no encontrada
        </p>

      </div>


      <!-- =========================
           MODAL AGENDA
           ========================= -->

      <div
        v-if="showAgendaModal"
        class="modal-overlay"
        @click="closeAgendaModal"
      >

        <div
          class="modal-content"
          @click.stop
        >

          <button
            class="modal-close"
            @click="closeAgendaModal"
          >
            ✕
          </button>


          <h2>
            Agendar Cita en
            {{ barber?.nombre }}
          </h2>


          <div
            class="form-group"
          >

            <label for="date">
              Selecciona una fecha:
            </label>

            <input
              id="date"
              v-model="selectedDate"
              type="date"
              class="form-input"
            />

          </div>


          <div
            class="form-group"
          >

            <label for="time">
              Selecciona una hora:
            </label>

            <input
              id="time"
              v-model="selectedTime"
              type="time"
              class="form-input"
            />

          </div>


          <div
            class="modal-actions"
          >

            <button
              class="btn-cancel"
              @click="closeAgendaModal"
            >
              Cancelar
            </button>


            <button
              class="btn-confirm"
              @click="confirmAgenda"
              :disabled="
                !selectedDate ||
                !selectedTime
              "
            >
              Confirmar
            </button>

          </div>

        </div>

      </div>

    </main>


    <!-- =========================
         LOGIN
         ========================= -->

    <Login
      v-if="showLogin"
      @close="
        showLogin = false
      "
    />

  </div>

</template>

<style scoped>

/* =========================
   FUENTES
   ========================= */

@font-face {
  font-family: 'FuenteBlesh';
  src: url('../../fonts/BleshForte.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}


/* =========================
   PÁGINA PRINCIPAL
   ========================= */

.page-shell {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.detail-page {
  margin-left: 280px;
  width: calc(100% - 280px);
  min-height: 100vh;
  padding: 35px 45px;
  box-sizing: border-box;

  background:
    linear-gradient(
      135deg,
      #0f0f0f 0%,
      #1a1a1a 100%
    );

  color: white;

  transition:
    margin-left 0.3s ease,
    width 0.3s ease,
    padding 0.3s ease;
}

.detail-page.sidebar-minimized {
  margin-left: 100px;
  width: calc(100% - 100px);
  padding: 35px 45px;
}


/* =========================
   BOTÓN VOLVER
   ========================= */

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 10px 15px;
  margin-bottom: 25px;

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


/* =========================
   CONTENEDOR
   ========================= */

.detail-container {
  width: 100%;
  max-width: 1250px;
  margin: 0 auto;
  box-sizing: border-box;
}


/* =========================
   HERO
   ========================= */

.hero-section {
  position: relative;

  width: 100%;
  height: 420px;

  margin-bottom: 30px;

  border-radius: 20px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;

  object-fit: cover;
}


/* =========================
   FAVORITO
   ========================= */

.favorite-btn-large {
  position: absolute;

  top: 20px;
  right: 20px;

  width: 50px;
  height: 50px;

  background: rgba(0, 0, 0, 0.55);

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


/* =========================
   INFORMACIÓN
   ========================= */

.info-section {
  width: 100%;
  box-sizing: border-box;

  background: rgba(255, 255, 255, 0.05);

  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;

  padding: 35px;

  backdrop-filter: blur(10px);
}


/* =========================
   ENCABEZADO
   ========================= */

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  gap: 25px;

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
  margin-top: -30px;
  font-size: 1.1rem;
  color: #ffd700;
}


/* =========================
   PANEL DE CALIFICACIÓN
   ========================= */

.rating-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 30px;
  padding: 20px;

  border: 1px solid rgba(191, 146, 75, 0.25);
  border-radius: 12px;

  background: rgba(191, 146, 75, 0.06);

  box-sizing: border-box;
}

.rating-panel h3 {
  margin: 0 0 5px;
  font-size: 1rem;
}

.rating-panel p {
  margin: 0;
  color: #9ca3af;
  font-size: 0.9rem;
}

.rating-stars {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.rating-stars button {
  padding: 4px;

  border: 0;
  background: transparent;

  color: #6b7280;

  cursor: pointer;
}

.rating-stars button:hover:not(:disabled),
.rating-stars button.selected {
  color: #ffd700;
}

.rating-stars button:disabled {
  cursor: default;
}

.rating-stars svg {
  width: 25px;
  height: 25px;
}

.rating-message {
  color: #BF924B !important;
}


/* =========================
   PRECIO
   ========================= */

.price-badge {
  font-size: 1.8rem;
  font-weight: 700;

  color: #ff4848;

  padding: 10px 20px;

  background: rgba(255, 72, 72, 0.1);

  border-radius: 8px;
}


/* =========================
   UBICACIÓN
   ========================= */

.location-section {
  display: flex;
  align-items: flex-start;

  gap: 15px;

  margin-bottom: 30px;
  padding: 20px;

  background: rgba(255, 255, 255, 0.05);

  border-radius: 12px;

  box-sizing: border-box;
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


/* =========================
   ESTADO
   ========================= */

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


/* =========================
   SERVICIOS
   ========================= */

.services-section {
  margin-bottom: 30px;
}

.services-section h3 {
  font-size: 1.3rem;
  margin: 0 0 15px 0;
}

.services-grid {
  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(160px, 1fr));

  gap: 10px;
}

.service-tag {
  background: rgba(255, 72, 72, 0.2);

  color: #ff4848;

  padding: 10px 15px;

  border-radius: 8px;

  text-align: center;

  border: 1px solid
    rgba(255, 72, 72, 0.3);
}


/* =========================
   DESCRIPCIÓN
   ========================= */

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

  margin: 0;
}


/* =========================
   MAPA
   ========================= */

.map-section {
  width: 100%;

  margin-bottom: 35px;
}

.map-section h3 {
  font-size: 1.3rem;

  margin: 0 0 15px 0;
}

.client-map {
  width: 100%;
  height: 420px;

  border-radius: 15px;

  overflow: hidden;

  border: 1px solid
    rgba(255, 255, 255, 0.1);

  box-sizing: border-box;
}

/* IMPORTANTE:
   Leaflet necesita que el contenedor
   tenga un tamaño real */

#client-map {
  width: 100%;
  height: 420px;
}


/* =========================
   BOTÓN CÓMO LLEGAR
   ========================= */

.directions-btn {
  width: 100%;

  margin-top: 12px;

  padding: 14px 20px;

  border: none;
  border-radius: 10px;

  background: #BF924B;

  color: #111;

  font-size: 1rem;
  font-weight: 700;

  cursor: pointer;

  transition: 0.3s ease;
}

.directions-btn:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 20px
    rgba(191, 146, 75, 0.3);
}


/* =========================
   HORARIOS
   ========================= */

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


/* =========================
   COMENTARIOS
   ========================= */

.comments-section {
  width: 100%;

  margin-bottom: 35px;

  box-sizing: border-box;
}

.comments-section h3 {
  font-size: 1.3rem;

  margin: 0 0 15px 0;
}

.comment-form {
  width: 100%;

  background: rgba(255, 255, 255, 0.05);

  padding: 20px;

  border-radius: 12px;

  margin-bottom: 20px;

  box-sizing: border-box;
}

.comment-form textarea {
  width: 100%;

  min-height: 120px;

  box-sizing: border-box;

  background: #1f2937;

  border: 1px solid
    rgba(255, 255, 255, 0.1);

  border-radius: 10px;

  padding: 15px;

  color: white;

  resize: vertical;

  font-family: inherit;

  outline: none;

  margin-bottom: 12px;
}

.comment-form textarea:focus {
  border-color: #BF924B;
}

.comment-form textarea::placeholder {
  color: #9ca3af;
}

.comment-btn {
  width: 100%;

  padding: 13px 20px;

  border: none;

  border-radius: 10px;

  background: #BF924B;

  color: #111;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s ease;
}

.comment-btn:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 20px
    rgba(191, 146, 75, 0.25);
}

.comments-list {
  width: 100%;

  display: flex;

  flex-direction: column;

  gap: 12px;
}

.comment-card {
  width: 100%;

  padding: 18px;

  background: rgba(255, 255, 255, 0.05);

  border: 1px solid
    rgba(255, 255, 255, 0.08);

  border-radius: 12px;

  box-sizing: border-box;
}

.comment-header {
  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  margin-bottom: 10px;
}

.comment-header div {
  display: flex;

  flex-direction: column;

  gap: 3px;
}

.comment-header strong {
  color: #BF924B;

  font-size: 1rem;
}

.comment-header span {
  color: #9ca3af;

  font-size: 0.8rem;
}

.comment-card p {
  margin: 0;

  color: rgba(255, 255, 255, 0.9);

  line-height: 1.5;

  word-break: break-word;
}

.delete-comment {
  background: transparent;

  border: none;

  cursor: pointer;

  font-size: 16px;

  opacity: 0.7;

  transition: 0.2s ease;
}

.delete-comment:hover {
  opacity: 1;

  transform: scale(1.1);
}

.no-comments {
  color: #9ca3af;

  text-align: center;

  padding: 20px;

  background: rgba(255, 255, 255, 0.03);

  border-radius: 10px;
}


/* =========================
   BOTÓN RESERVAR
   ========================= */

.cta-section {
  width: 100%;

  margin-top: 40px;

  display: flex;

  gap: 15px;
}

.agenda-btn-large {
  flex: 1;

  padding: 18px 40px;

  font-size: 1.2rem;
  font-weight: 700;

  background:
    linear-gradient(
      135deg,
      #ff4848,
      #ff6b6b
    );

  color: white;

  border: none;

  border-radius: 12px;

  cursor: pointer;

  transition: all 0.3s ease;
}

.agenda-btn-large:hover:not(.disabled) {
  transform: translateY(-2px);

  box-shadow:
    0 10px 30px
    rgba(255, 72, 72, 0.4);
}

.agenda-btn-large.disabled {
  background:
    rgba(255, 255, 255, 0.2);

  cursor: not-allowed;

  opacity: 0.6;
}


/* =========================
   NO ENCONTRADO
   ========================= */

.not-found {
  text-align: center;

  padding: 60px 20px;

  font-size: 1.2rem;

  color: rgba(255, 255, 255, 0.6);
}


/* =========================
   MODAL RESERVA
   ========================= */

.modal-overlay {
  position: fixed;

  inset: 0;

  background:
    rgba(0, 0, 0, 0.7);

  display: flex;

  align-items: center;

  justify-content: center;

  z-index: 1000;
}

.modal-content {
  background: #1a1a1a;

  border: 1px solid
    rgba(255, 255, 255, 0.1);

  border-radius: 16px;

  padding: 40px;

  max-width: 500px;

  width: 90%;

  position: relative;

  box-sizing: border-box;
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
 /* =========================================
   NUEVA UBICACIÓN
   ========================================= */

.location-card {
  width: 100%;
  margin: 30px 0;
  padding: 28px;
  box-sizing: border-box;
  background: linear-gradient(
    145deg,
    rgba(255,255,255,0.055),
    rgba(255,255,255,0.025)
  );
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.18);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 22px;
}

.section-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(191,146,75,0.12);
  border: 1px solid rgba(191,146,75,0.22);
  color: #bf924b;
}

.section-label {
  display: block;
  color: #bf924b;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 2.5px;
  margin-bottom: 4px;
}

.section-header h2 {
  margin: 0;
  color: #f5f5f5;
  font-size: 1.45rem;
}

.section-header p {
  margin: 5px 0 0;
  color: #8f96a3;
  font-size: 0.88rem;
}


/* MAPA */

.client-map {
  width: 100%;
  height: 400px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  box-sizing: border-box;
}


/* DIRECCIÓN */

.location-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 18px;
  padding: 18px;
  border-radius: 16px;
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.06);
}

.address-info {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}

.address-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(191,146,75,0.1);
  color: #bf924b;
}

.address-info > div:last-child {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.address-info span {
  color: #8f96a3;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.address-info strong {
  color: #f0f0f0;
  font-size: 0.95rem;
  font-weight: 600;
}

.address-info small {
  color: #777f8c;
  font-size: 0.8rem;
}


/* BOTÓN CÓMO LLEGAR */

.directions-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 150px;
  padding: 13px 20px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    #bf924b,
    #d9ae63
  );
  color: #111;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.directions-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 10px 25px
    rgba(191,146,75,0.25);
}

.directions-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}


/* SIN MAPA */

.no-map {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 18px;
  background: rgba(255,255,255,0.025);
  border: 1px dashed rgba(255,255,255,0.1);
  color: #777f8c;
}

.no-map p {
  margin: 0;
}


/* COMENTARIOS */

.comments-section {
  width: 100%;
  margin: 30px 0;
  padding: 28px;
  box-sizing: border-box;
  background: linear-gradient(
    145deg,
    rgba(255,255,255,0.045),
    rgba(255,255,255,0.02)
  );
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
}

.comment-form {
  padding: 18px;
  border-radius: 16px;
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 20px;
}

.comment-form textarea {
  width: 100%;
  min-height: 110px;
  box-sizing: border-box;
  resize: vertical;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: #181c23;
  color: white;
  font-family: inherit;
  outline: none;
}

.comment-form textarea:focus {
  border-color: #bf924b;
}

.comment-form textarea::placeholder {
  color: #737b88;
}

.comment-btn {
  width: 100%;
  margin-top: 12px;
  padding: 13px;
  border: none;
  border-radius: 11px;
  background: linear-gradient(
    135deg,
    #bf924b,
    #d9ae63
  );
  color: #111;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.comment-btn:hover {
  transform: translateY(-2px);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-card {
  padding: 18px;
  border-radius: 15px;
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.06);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-header div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.comment-header strong {
  color: #bf924b;
}

.comment-header span {
  color: #777f8c;
  font-size: 0.75rem;
}

.comment-card p {
  margin: 0;
  color: #d5d7db;
  line-height: 1.55;
}

.delete-comment {
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.5;
}

.delete-comment:hover {
  opacity: 1;
}

.no-comments {
  padding: 30px;
  text-align: center;
  border-radius: 15px;
  background: rgba(255,255,255,0.025);
  border: 1px dashed rgba(255,255,255,0.08);
}

.no-comments span {
  display: block;
  font-size: 1.7rem;
  margin-bottom: 8px;
}

.no-comments p {
  margin: 0 0 4px;
  color: #c9cbd0;
  font-weight: 600;
}

.no-comments small {
  color: #737b88;
}


/* RESPONSIVE */

@media (max-width: 700px) {

  .location-card,
  .comments-section {
    padding: 20px;
  }

  .client-map {
    height: 320px;
  }

  .location-bottom {
    flex-direction: column;
    align-items: stretch;
  }

  .directions-button {
    width: 100%;
  }

}
.form-group label {
  display: block;

  margin-bottom: 10px;

  font-weight: 600;
}

.form-input {
  width: 100%;

  padding: 12px 15px;

  background:
    rgba(255, 255, 255, 0.05);

  border: 1px solid
    rgba(255, 255, 255, 0.2);

  border-radius: 8px;

  color: white;

  font-size: 1rem;

  box-sizing: border-box;
}

.form-input:focus {
  outline: none;

  border-color: #ff4848;

  box-shadow:
    0 0 0 3px
    rgba(255, 72, 72, 0.1);
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
  background:
    rgba(255, 255, 255, 0.1);

  color: white;
}

.btn-cancel:hover {
  background:
    rgba(255, 255, 255, 0.2);
}

.btn-confirm {
  background:
    linear-gradient(
      135deg,
      #ff4848,
      #ff6b6b
    );

  color: white;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow:
    0 5px 15px
    rgba(255, 72, 72, 0.3);
}

.btn-confirm:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}


/* =========================
   RESPONSIVE
   ========================= */

@media (max-width: 1000px) {

  .detail-page {
    margin-left: 100px;

    width: calc(100% - 100px);

    padding: 30px;
  }

  .detail-page.sidebar-minimized {
    margin-left: 100px;

    width: calc(100% - 100px);

    padding: 30px;
  }

  .detail-container {
    max-width: 100%;
  }

}


@media (max-width: 768px) {

  .detail-page {
    margin-left: 80px;

    width: calc(100% - 80px);

    padding: 25px 15px;
  }

  .detail-page.sidebar-minimized {
    margin-left: 80px;

    width: calc(100% - 80px);

    padding: 25px 15px;
  }

  .hero-section {
    height: 280px;
  }

  .info-section {
    padding: 25px 20px;
  }

  .header-info {
    flex-direction: column;
  }

  .header-info h1 {
    font-size: 1.8rem;
  }

  .rating-panel {
    align-items: flex-start;

    flex-direction: column;
  }

  .services-grid {
    grid-template-columns:
      repeat(
        auto-fit,
        minmax(120px, 1fr)
      );
  }

  .client-map,
  #client-map {
    height: 350px;
  }

}


@media (max-width: 500px) {

  .detail-page {
    margin-left: 0;

    width: 100%;

    padding: 20px 12px;
  }

  .detail-page.sidebar-minimized {
    margin-left: 0;

    width: 100%;

    padding: 20px 12px;
  }

  .hero-section {
    height: 220px;
  }

  .info-section {
    padding: 20px 15px;
  }

  .header-info h1 {
    font-size: 1.5rem;
  }

  .client-map,
  #client-map {
    height: 300px;
  }

  .cta-section {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column;
  }

}

</style>