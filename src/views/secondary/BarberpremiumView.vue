<script setup>
import { ref } from 'vue'

import Sidebar from '@/components/Sidebar.vue'
import Login from '@/components/Login.vue'

import logo from '@/assets/Imagenes/logo/logo.png'

import {
  Bot,
  Zap,
  LensConcave,
  CalendarCog,
  Palette,
  Crown
} from 'lucide-vue-next'

const sidebarMinimized = ref(false)
const showLogin = ref(false)

const showPremiumModal = ref(false)
const showPremiumSuccess = ref(false)

const nombreTitular = ref('')
const numeroTarjeta = ref('')
const vencimiento = ref('')
const cvv = ref('')

const premiumActivo = ref(false)

const handleToggleSidebar = (isMinimized) => {
  sidebarMinimized.value = isMinimized
}

function abrirPremium() {
  showPremiumModal.value = true
}

function cerrarPremium() {
  showPremiumModal.value = false

  nombreTitular.value = ''
  numeroTarjeta.value = ''
  vencimiento.value = ''
  cvv.value = ''
}

function activarPremium() {
  if (
    !nombreTitular.value.trim() ||
    !numeroTarjeta.value.trim() ||
    !vencimiento.value.trim() ||
    !cvv.value.trim()
  ) {
    alert('Completa todos los datos para continuar.')
    return
  }

  const tarjetaLimpia = numeroTarjeta.value.replace(/\s/g, '')

  if (tarjetaLimpia.length !== 16) {
    alert('El número de tarjeta debe tener 16 dígitos.')
    return
  }

  if (cvv.value.length !== 3) {
    alert('El CVV debe tener 3 dígitos.')
    return
  }

  premiumActivo.value = true

  localStorage.setItem(
    'barbertimePremium',
    'true'
  )

  cerrarPremium()

  showPremiumSuccess.value = true
}

function cerrarPremiumSuccess() {
  showPremiumSuccess.value = false
}
</script>

<template>

  <div class="page-shell">

    <Sidebar
      @openLogin="showLogin = true"
      @toggleSidebar="handleToggleSidebar"
    />

    <main
      :class="[
        'main-content',
        { 'sidebar-minimized': sidebarMinimized }
      ]"
    >

      <!-- HERO -->
      <section class="hero">

        <div class="premium-logo">
          <img
            :src="logo"
            alt="Logo BarberTime"
          />

          BarberTime

          <span>PREMIUM</span>
        </div>

        <h1>
          Todo Barber<span>Time</span>.<br>
          Sin límites.
        </h1>

        <p class="hero-description">
          Obtén acceso a herramientas inteligentes,
          reservas prioritarias, promociones exclusivas
          y funciones avanzadas para mejorar tu experiencia
          en cada corte.
        </p>

        <p class="hero-price">
          Prueba 1 mes por 0 US$ • Después 4,99 US$/mes •
          Cancela cuando quieras
        </p>

        <button
          class="hero-button"
          @click="abrirPremium"
        >
          👑 Probar BarberTime Premium
        </button>

        <p class="hero-small">
          O accede con el plan familiar o estudiante.
        </p>

      </section>


      <!-- FUNCIONES -->
      <section class="features">

        <div class="feature-card">

          <div class="feature-icon">
            <Bot />
          </div>

          <h3>IA de estilos</h3>

          <p>
            Descubre qué cortes de pelo podrían quedarte
            mejor usando análisis inteligente basado en tu rostro.
          </p>

        </div>


        <div class="feature-card">

          <div class="feature-icon">
            <Zap />
          </div>

          <h3>Reservas prioritarias</h3>

          <p>
            Adelántate a otros usuarios en barberías
            colaboradoras y consigue horarios premium exclusivos.
          </p>

        </div>


        <div class="feature-card">

          <div class="feature-icon">
            <LensConcave />
          </div>

          <h3>Promociones exclusivas</h3>

          <p>
            Accede a descuentos especiales, cortes gratis
            acumulando puntos y ofertas limitadas.
          </p>

        </div>


        <div class="feature-card">

          <div class="feature-icon">
            <CalendarCog />
          </div>

          <h3>Recordatorios inteligentes</h3>

          <p>
            BarberTime te avisará automáticamente cuándo
            probablemente necesites tu próximo corte.
          </p>

        </div>


        <div class="feature-card">

          <div class="feature-icon">
            <Palette />
          </div>

          <h3>Simulación de cortes</h3>

          <p>
            Visualiza distintos estilos antes de reservar
            tu cita utilizando previsualizaciones virtuales.
          </p>

        </div>


        <div class="feature-card">

          <div class="feature-icon">
            <Crown />
          </div>

          <h3>Insignia Premium</h3>

          <p>
            Destaca tu perfil con una insignia exclusiva
            dentro de la comunidad BarberTime.
          </p>

        </div>

      </section>


      <!-- MODAL DE PAGO -->
      <div
        v-if="showPremiumModal"
        class="premium-overlay"
        @click="cerrarPremium"
      >

        <div
          class="premium-modal"
          @click.stop
        >

          <button
            class="premium-close"
            @click="cerrarPremium"
          >
            ✕
          </button>

          <div class="premium-modal-icon">
            👑
          </div>

          <h2>
            BarberTime Premium
          </h2>

          <p class="premium-modal-description">
            Disfruta de todas las funciones Premium.
          </p>


          <div class="premium-plan">
            <span>
              Primer mes
            </span>

            <strong>
              US$ 0
            </strong>
          </div>


          <div class="premium-plan">
            <span>
              Después
            </span>

            <strong>
              US$ 4,99 / mes
            </strong>
          </div>


          <div class="premium-form">

            <label>
              Nombre del titular
            </label>

            <input
              v-model="nombreTitular"
              type="text"
              placeholder="Ej: Juan Pérez"
            />


            <label>
              Número de tarjeta
            </label>

            <input
              v-model="numeroTarjeta"
              type="text"
              maxlength="19"
              placeholder="1234 5678 9012 3456"
              @input="
                numeroTarjeta = numeroTarjeta
                  .replace(/\D/g, '')
                  .replace(/(.{4})/g, '$1 ')
                  .trim()
              "
            />


            <div class="card-row">

              <div>

                <label>
                  Vencimiento
                </label>

                <input
                  v-model="vencimiento"
                  type="text"
                  maxlength="5"
                  placeholder="MM/AA"
                />

              </div>


              <div>

                <label>
                  CVV
                </label>

                <input
                  v-model="cvv"
                  type="password"
                  maxlength="3"
                  placeholder="123"
                />

              </div>

            </div>


            <button
              class="pay-button"
              @click="activarPremium"
            >
              👑 Activar Premium
            </button>


            <p class="secure-text">
              🔒 Pago seguro · Suscripción cancelable
            </p>

          </div>

        </div>

      </div>


      <!-- MENSAJE PREMIUM ACTIVADO -->
      <div
        v-if="showPremiumSuccess"
        class="premium-success-overlay"
        @click="cerrarPremiumSuccess"
      >

        <div
          class="premium-success-modal"
          @click.stop
        >

          <div class="success-crown">
            👑
          </div>


          <h2>
            ¡Premium activado!
          </h2>


          <p class="success-subtitle">
            Ahora tienes acceso a todas las funciones
            exclusivas de BarberTime.
          </p>


          <div class="unlocked-title">
            ✨ Has desbloqueado:
          </div>


          <div class="unlocked-list">


            <div class="unlocked-item">

              <span>🤖</span>

              <div>

                <strong>
                  IA de estilos
                </strong>

                <p>
                  Recomendaciones inteligentes
                  según tu rostro.
                </p>

              </div>

            </div>


            <div class="unlocked-item">

              <span>⚡</span>

              <div>

                <strong>
                  Reservas prioritarias
                </strong>

                <p>
                  Accede antes que otros usuarios
                  a horarios exclusivos.
                </p>

              </div>

            </div>


            <div class="unlocked-item">

              <span>🎁</span>

              <div>

                <strong>
                  Promociones exclusivas
                </strong>

                <p>
                  Descuentos, ofertas especiales
                  y beneficios Premium.
                </p>

              </div>

            </div>


            <div class="unlocked-item">

              <span>📅</span>

              <div>

                <strong>
                  Recordatorios inteligentes
                </strong>

                <p>
                  Recibe avisos sobre cuándo podría
                  tocar tu próximo corte.
                </p>

              </div>

            </div>


            <div class="unlocked-item">

              <span>🎨</span>

              <div>

                <strong>
                  Simulación de cortes
                </strong>

                <p>
                  Visualiza diferentes estilos
                  antes de elegir tu corte.
                </p>

              </div>

            </div>


            <div class="unlocked-item">

              <span>👑</span>

              <div>

                <strong>
                  Insignia Premium
                </strong>

                <p>
                  Destaca tu perfil dentro de
                  la comunidad BarberTime.
                </p>

              </div>

            </div>


          </div>


          <button
            class="success-button"
            @click="cerrarPremiumSuccess"
          >
            🚀 Empezar a disfrutar Premium
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

@font-face {
  font-family: 'FuenteBarber';
  src: url('../fonts/BarberStreet.ttf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

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


.page-shell {
  display: flex;
  min-height: 100vh;
  background: #050505;
}


.main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
  padding: 50px;
  position: relative;
  overflow-x: hidden;
}


.main-content.sidebar-minimized {
  margin-left: 80px;
  width: calc(100% - 80px);
}


.hero,
.features {
  position: relative;
  z-index: 1;
}


.premium-logo {
  display: inline-block;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 12px 22px;
  border-radius: 999px;
  margin-bottom: 40px;
  font-weight: bold;
  color: #f1c96b;
  font-size: 1.2rem;
}


.premium-logo span {
  font-weight: normal;
  color: #ffd67f;
  font-family: 'FuenteBarber', sans-serif;
}


.premium-logo img {
  width: 20px;
  height: 20px;
  margin-right: 1px;
}


.hero {
  text-align: center;
  padding-top: 40px;
  margin-bottom: 80px;
}


.hero h1 {
  font-family: 'FuenteBlesh', sans-serif;
  font-size: 4.5rem;
  line-height: 1.1;
  margin-bottom: 24px;
  color: white;
}


.hero h1 span {
  color: #dba84d;
}


.hero-description {
  max-width: 850px;
  margin: 0 auto 30px;
  color: #d1d5db;
  font-size: 1.2rem;
  line-height: 1.8;
}


.hero-price {
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 40px;
}


.hero-button {
  background: linear-gradient(
    135deg,
    #dba84d,
    #ffd67f
  );

  color: black;

  border: none;

  padding: 18px 40px;

  border-radius: 999px;

  font-size: 1rem;

  font-weight: bold;

  cursor: pointer;

  transition: 0.3s;
}


.hero-button:hover {
  transform: scale(1.05);
}


.hero-small {
  margin-top: 35px;
  color: #9ca3af;
}


.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}


.feature-card {
  background: rgba(255,255,255,0.04);

  border: 1px solid rgba(255,255,255,0.08);

  backdrop-filter: blur(10px);

  border-radius: 28px;

  padding: 35px;

  transition: 0.3s;
}


.feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 201, 107, 0.3);
}


.feature-icon {
  width: 56px;
  height: 56px;

  display: grid;
  place-items: center;

  border-radius: 18px;

  background: rgba(191,146,75,0.18);

  font-size: 2.5rem;

  margin-bottom: 20px;
}


.feature-icon svg {
  width: 30px;
  height: 30px;
}


.feature-card h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #ffd67f;
}


.feature-card p {
  color: #c9c9c9;
  line-height: 1.7;
}


/* FONDO */

.main-content::before {
  content: "";

  position: fixed;

  inset: 0;

  background:
    radial-gradient(
      circle at top left,
      rgba(255, 174, 0, 0.18),
      transparent 35%
    ),

    radial-gradient(
      circle at top right,
      rgba(255, 255, 255, 0.06),
      transparent 30%
    ),

    radial-gradient(
      circle at bottom center,
      rgba(255, 174, 0, 0.08),
      transparent 35%
    );

  z-index: -1;

  pointer-events: none;
}


/* MODAL DE PAGO */

.premium-overlay {
  position: fixed;

  inset: 0;

  background: rgba(0, 0, 0, 0.8);

  display: flex;

  align-items: center;

  justify-content: center;

  z-index: 2000;

  backdrop-filter: blur(8px);
}


.premium-modal {
  width: 460px;

  max-width: 92%;

  background: #151515;

  border: 1px solid rgba(219, 168, 77, 0.35);

  border-radius: 24px;

  padding: 35px;

  position: relative;

  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6);
}


.premium-close {
  position: absolute;

  top: 15px;

  right: 15px;

  width: 35px;

  height: 35px;

  border: none;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.08);

  color: white;

  cursor: pointer;

  font-size: 16px;
}


.premium-modal-icon {
  width: 65px;

  height: 65px;

  display: grid;

  place-items: center;

  margin: 0 auto 15px;

  border-radius: 20px;

  background: rgba(219, 168, 77, 0.15);

  font-size: 2rem;
}


.premium-modal h2 {
  text-align: center;

  color: #ffd67f;

  font-size: 1.8rem;

  margin-bottom: 8px;
}


.premium-modal-description {
  text-align: center;

  color: #9ca3af;

  margin-bottom: 25px;
}


.premium-plan {
  display: flex;

  justify-content: space-between;

  padding: 12px 15px;

  margin-bottom: 8px;

  border-radius: 10px;

  background: rgba(255, 255, 255, 0.05);

  color: #d1d5db;
}


.premium-plan strong {
  color: #ffd67f;
}


.premium-form {
  margin-top: 25px;

  display: flex;

  flex-direction: column;

  gap: 10px;
}


.premium-form label {
  color: #d1d5db;

  font-size: 0.9rem;

  font-weight: 600;

  margin-top: 5px;
}


.premium-form input {
  width: 100%;

  padding: 14px;

  box-sizing: border-box;

  border-radius: 10px;

  border: 1px solid rgba(255, 255, 255, 0.1);

  background: #222;

  color: white;

  outline: none;

  font-size: 15px;
}


.premium-form input:focus {
  border-color: #BF924B;
}


.premium-form input::placeholder {
  color: #777;
}


.card-row {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 15px;
}


.card-row div {
  display: flex;

  flex-direction: column;

  gap: 10px;
}


.pay-button {
  width: 100%;

  margin-top: 15px;

  padding: 16px;

  border: none;

  border-radius: 12px;

  background:
    linear-gradient(
      135deg,
      #dba84d,
      #ffd67f
    );

  color: #111;

  font-weight: 800;

  font-size: 1rem;

  cursor: pointer;

  transition: 0.2s ease;
}


.pay-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 25px
    rgba(219, 168, 77, 0.3);
}


.secure-text {
  text-align: center;

  color: #777;

  font-size: 0.75rem;

  margin-top: 15px;
}


/* PREMIUM ACTIVADO */

.premium-success-overlay {
  position: fixed;

  inset: 0;

  background: rgba(0, 0, 0, 0.85);

  display: flex;

  align-items: center;

  justify-content: center;

  z-index: 3000;

  backdrop-filter: blur(10px);
}


.premium-success-modal {
  width: 560px;

  max-width: 92%;

  max-height: 90vh;

  overflow-y: auto;

  background: #151515;

  border: 1px solid rgba(219, 168, 77, 0.5);

  border-radius: 25px;

  padding: 35px;

  text-align: center;

  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.7);
}


.success-crown {
  width: 75px;

  height: 75px;

  margin: 0 auto 15px;

  display: grid;

  place-items: center;

  border-radius: 50%;

  background: rgba(219, 168, 77, 0.15);

  font-size: 2.5rem;

  box-shadow:
    0 0 30px rgba(219, 168, 77, 0.2);
}


.premium-success-modal h2 {
  color: #ffd67f;

  font-size: 2rem;

  margin-bottom: 10px;
}


.success-subtitle {
  color: #d1d5db;

  line-height: 1.6;

  margin-bottom: 25px;
}


.unlocked-title {
  text-align: left;

  color: #ffd67f;

  font-weight: 700;

  font-size: 1.1rem;

  margin-bottom: 12px;
}


.unlocked-list {
  display: flex;

  flex-direction: column;

  gap: 10px;

  text-align: left;
}


.unlocked-item {
  display: flex;

  align-items: flex-start;

  gap: 15px;

  padding: 14px;

  border-radius: 12px;

  background: rgba(255, 255, 255, 0.05);

  border: 1px solid rgba(255, 255, 255, 0.07);
}


.unlocked-item > span {
  font-size: 1.6rem;

  width: 35px;

  text-align: center;

  flex-shrink: 0;
}


.unlocked-item strong {
  display: block;

  color: white;

  margin-bottom: 3px;
}


.unlocked-item p {
  margin: 0;

  color: #9ca3af;

  font-size: 0.85rem;

  line-height: 1.4;
}


.success-button {
  width: 100%;

  margin-top: 25px;

  padding: 16px;

  border: none;

  border-radius: 12px;

  background:
    linear-gradient(
      135deg,
      #dba84d,
      #ffd67f
    );

  color: #111;

  font-size: 1rem;

  font-weight: 800;

  cursor: pointer;

  transition: 0.2s ease;
}


.success-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 25px
    rgba(219, 168, 77, 0.3);
}


/* RESPONSIVE */

@media (max-width: 1200px) {

  .features {
    grid-template-columns: 1fr 1fr;
  }

}


@media (max-width: 900px) {

  .main-content {
    margin-left: 0;
    width: 100%;
    padding: 30px;
  }

  .main-content.sidebar-minimized {
    margin-left: 80px;
    width: calc(100% - 80px);
  }

  .hero h1 {
    font-size: 3rem;
  }

  .features {
    grid-template-columns: 1fr;
  }

}


@media (max-width: 600px) {

  .premium-modal {
    padding: 25px;
  }

  .premium-success-modal {
    padding: 25px;
  }

  .premium-success-modal h2 {
    font-size: 1.6rem;
  }

  .card-row {
    grid-template-columns: 1fr;
  }

}

</style>