<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { useAuth } from '@/composables/useAuth'
import { useBarberStore } from '@/composables/useBarberStore'

const router = useRouter()

const { isAdmin } = useAuth()

const {
  pendingBarbers,
  approveBarber,
  rejectBarber
} = useBarberStore()

const sidebarMinimized = ref(false)

const handleToggleSidebar = (value) => {
  sidebarMinimized.value = value
}

// Si no es administrador, no puede entrar
if (!isAdmin.value) {
  router.push('/')
}

const aprobar = (id) => {
  approveBarber(id)
  alert('✅ Barbería aprobada correctamente')
}

const rechazar = (id) => {
  rejectBarber(id)
  alert('❌ Barbería rechazada')
}
</script>

<template>
  <div class="page-shell">

    <Sidebar
      @toggleSidebar="handleToggleSidebar"
    />

    <main
      :class="[
        'main-content',
        {
          'sidebar-minimized': sidebarMinimized
        }
      ]"
    >

      <header class="topbar">

        <div>
          <span class="admin-badge">
            👑 ADMINISTRADOR
          </span>

          <h1>
            Panel de administración
          </h1>

          <p>
            Revisá y administrá las publicaciones de BarberTime.
          </p>
        </div>

      </header>

      <section class="section">

        <div class="section-title">

          <h2>
            💈 Barberías pendientes
          </h2>

          <span class="counter">
            {{ pendingBarbers.length }}
          </span>

        </div>

        <div
          v-if="pendingBarbers.length"
          class="barbers"
        >

          <article
            v-for="barber in pendingBarbers"
            :key="barber.id"
            class="barber-card"
          >

            <div class="barber-info">

              <h3>
                {{ barber.nombre }}
              </h3>

              <p v-if="barber.ciudad">
                📍 {{ barber.ciudad }}
              </p>

              <p v-if="barber.direccion">
                {{ barber.direccion }}
              </p>

              <p v-if="barber.telefono">
                📞 {{ barber.telefono }}
              </p>

              <p
                v-if="barber.descripcion"
                class="description"
              >
                {{ barber.descripcion }}
              </p>

              <small>
                Solicitud enviada:
                {{ new Date(barber.createdAt).toLocaleDateString() }}
              </small>

            </div>

            <div class="actions">

              <button
                class="approve"
                @click="aprobar(barber.id)"
              >
                ✅ Aprobar
              </button>

              <button
                class="reject"
                @click="rechazar(barber.id)"
              >
                ❌ Rechazar
              </button>

            </div>

          </article>

        </div>

        <div
          v-else
          class="empty"
        >
          <div class="empty-icon">
            🎉
          </div>

          <h3>
            No hay publicaciones pendientes
          </h3>

          <p>
            Todas las barberías fueron revisadas.
          </p>
        </div>

      </section>

    </main>

  </div>
</template>

<style scoped>

.page-shell {
  min-height: 100vh;
  background: #0f172a;
}

.main-content {
  margin-left: 280px;
  min-height: 100vh;
  padding: 45px 60px;
  transition: .3s ease;
}

.sidebar-minimized {
  margin-left: 80px;
}

.topbar {
  margin-bottom: 45px;
}

.admin-badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(191, 146, 75, .15);
  border: 1px solid rgba(191, 146, 75, .35);
  color: #F3DDA7;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 15px;
}

h1 {
  color: white;
  font-size: 2.5rem;
  margin: 0 0 10px;
}

.topbar p {
  color: #9ca3af;
}

.section {
  max-width: 1100px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
}

.section-title h2 {
  color: white;
  margin: 0;
}

.counter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #BF924B;
  color: #111;
  font-weight: 700;
}

.barbers {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.barber-card {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  padding: 25px;
  background: #111827;
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 20px;
}

.barber-info {
  color: white;
}

.barber-info h3 {
  font-size: 1.4rem;
  margin: 0 0 12px;
}

.barber-info p {
  color: #cbd5e1;
  margin: 7px 0;
}

.description {
  max-width: 650px;
  margin-top: 15px !important;
  color: #9ca3af !important;
}

.barber-info small {
  display: block;
  margin-top: 18px;
  color: #64748b;
}

.actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  min-width: 150px;
}

.actions button {
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: .2s ease;
}

.actions button:hover {
  transform: translateY(-2px);
}

.approve {
  background: #22c55e;
  color: white;
}

.reject {
  background: #dc2626;
  color: white;
}

.empty {
  padding: 70px 30px;
  background: #111827;
  border-radius: 20px;
  text-align: center;
  color: white;
}

.empty-icon {
  font-size: 50px;
  margin-bottom: 15px;
}

.empty p {
  color: #9ca3af;
}

@media (max-width: 800px) {

  .main-content {
    margin-left: 80px;
    padding: 30px 20px;
  }

  .barber-card {
    flex-direction: column;
  }

  .actions {
    flex-direction: row;
  }

}

</style>