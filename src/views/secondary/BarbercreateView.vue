<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Login from '@/components/Login.vue'
import BarberForm from '@/components/BarberForm.vue'
import { useRouter } from 'vue-router'
import { useBarberStore } from '@/composables/useBarberStore'

const router = useRouter()
const barberStore = useBarberStore()

const sidebarMinimized = ref(false)
const showLogin = ref(false)

const handleToggleSidebar = (isMinimized) => {
  sidebarMinimized.value = isMinimized
}

function handleCreateBarber(data) {
  barberStore.addBarber(data)
  router.push('/')
}
</script>

<template>
  <div class="page-shell">
    <Sidebar @openLogin="showLogin = true" @toggleSidebar="handleToggleSidebar" />

    <main :class="['main-content', { 'sidebar-minimized': sidebarMinimized }]">
      <header class="topbar">
        <div>
          <h1>Crea tu Barbería</h1>
          <p>Publica tu barbería y comienza a recibir reservas</p>
        </div>
      </header>

      <section class="create-section">
        <BarberForm @submit="handleCreateBarber" />
      </section>
    </main>

    <Login v-if="showLogin" @close="showLogin = false" />
  </div>
</template>

<style scoped>
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
  margin-left: 100px;
  width: calc(100% - 80px);
  padding: 35px 120px 50px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
}

.topbar h1 {
  font-size: 2.2rem;
  margin-bottom: 8px;
  font-family: 'FuenteBlesh', sans-serif;
}

.topbar p {
  color: #9ca3af;
}

.create-section {
  padding: 30px 0;
}

@media (max-width: 1200px) {
  .main-content {
    padding: 35px 60px 50px;
  }

  .main-content.sidebar-minimized {
    padding: 35px 80px 50px;
  }
}

@media (max-width: 900px) {
  .main-content {
    width: 100%;
    margin-left: 0;
    padding: 35px 30px 50px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .topbar h1 {
    font-size: 1.8rem;
  }
}

@media (max-width: 600px) {
  .main-content {
    padding: 20px 15px 30px;
  }

  .topbar h1 {
    font-size: 1.5rem;
  }
}
</style>
