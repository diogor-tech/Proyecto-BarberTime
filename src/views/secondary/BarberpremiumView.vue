<div class="
"></div><script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Login from '@/components/Login.vue'
import logo from '@/assets/Imagenes/logo/logo.png'
import { Bot, Zap, LensConcave, CalendarCog, Palette, Crown } from 'lucide-vue-next';

const sidebarMinimized = ref(false)
const showLogin = ref(false)

const handleToggleSidebar = (isMinimized) => {
  sidebarMinimized.value = isMinimized
}
</script>

<template>
  <div class="page-shell">
    <Sidebar @openLogin="showLogin = true" @toggleSidebar="handleToggleSidebar" />

    <main :class="['main-content', { 'sidebar-minimized': sidebarMinimized }]">
      <section class="hero">
        <div class="premium-logo"> <img :src="logo" alt="Logo BarberTime" /> BarberTime <span>PREMIUM</span></div>

        <h1>
          Todo Barber<span>Time</span>.<br>
          Sin límites.
        </h1>

        <p class="hero-description">
          Obtén acceso a herramientas inteligentes, reservas prioritarias,
          promociones exclusivas y funciones avanzadas para mejorar
          tu experiencia en cada corte.
        </p>

        <p class="hero-price">
          Prueba 1 mes por 0 US$ • Después 4,99 US$/mes •
          Cancela cuando quieras
        </p>

        <button class="hero-button">Probar BarberTime Premium</button>

        <p class="hero-small">
          O accede con el plan familiar o estudiante.
        </p>
      </section>

      <section class="features">
        <div class="feature-card">
          <div class="feature-icon"><Bot /></div>
          <h3>IA de estilos</h3>
          <p>
            Descubre qué cortes de pelo podrían quedarte mejor
            usando análisis inteligente basado en tu rostro.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon"><Zap /></div>
          <h3>Reservas prioritarias</h3>
          <p>
            Adelántate a otros usuarios en barberías colaboradoras
            y consigue horarios premium exclusivos.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon"><LensConcave /></div>
          <h3>Promociones exclusivas</h3>
          <p>
            Accede a descuentos especiales, cortes gratis
            acumulando puntos y ofertas limitadas.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon"><CalendarCog /></div>
          <h3>Recordatorios inteligentes</h3>
          <p>
            BarberTime te avisará automáticamente cuándo
            probablemente necesites tu próximo corte.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon"><Palette /></div>
          <h3>Simulación de cortes</h3>
          <p>
            Visualiza distintos estilos antes de reservar
            tu cita utilizando previsualizaciones virtuales.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon"><Crown /></div>
          <h3>Insignia Premium</h3>
          <p>
            Destaca tu perfil con una insignia exclusiva
            dentro de la comunidad BarberTime.
          </p>
        </div>
      </section>

    </main>

    <Login v-if="showLogin" @close="showLogin = false" />
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

.premium-page,
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

.hero-description,
.hero-price,
.hero-small {
  color: #d1d5db;
}

.hero-description {
  max-width: 720px;
  margin: 0 auto 24px;
  font-size: 1.1rem;
  line-height: 1.8;
}

.hero-price {
  font-weight: 700;
  margin-bottom: 28px;
}

.hero-button {
  background: #bf924b;
  color: #0f172a;
  border: none;
  padding: 18px 36px;
  border-radius: 999px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.hero-button:hover {
  transform: translateY(-2px);
}

.hero-small {
  margin-top: 16px;
  font-size: 0.95rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.feature-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 28px;
  min-height: 230px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.feature-icon {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: rgba(191,146,75,0.18);
  font-size: 1.5rem;
}

.feature-card h3 {
  color: white;
  font-size: 1.4rem;
}

.feature-card p {
  color: #d1d5db;
  line-height: 1.8;
}

.main-content::before {
  content: "";
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 174, 0, 0.18), transparent 35%),
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.06), transparent 30%),
    radial-gradient(circle at bottom center, rgba(255, 174, 0, 0.08), transparent 35%);
  z-index: -1;
  pointer-events: none;
}

.main-content > * {
  position: relative;
  z-index: 1;



  margin-bottom: 35px;

  font-weight: 800;
}

.hero-description {
  max-width: 850px;

  margin: auto;

  color: #d1d5db;

  font-size: 1.2rem;

  line-height: 1.8;

  margin-bottom: 30px;
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
  font-size: 2.5rem;

  margin-bottom: 20px;
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

/* Responsive */

@media (max-width: 1200px) {

  .features {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 900px) {

  .premium-page {
    margin-left: 0;

    padding: 30px;
  }

  .hero h1 {
    font-size: 3rem;
  }

  .features {
    grid-template-columns: 1fr;
  }
}
</style>
