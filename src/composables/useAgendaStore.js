import { ref, computed } from 'vue'
import { useBarberStore } from './useBarberStore'

let sharedAgendaRef = ref([])

export function useAgendaStore() {
  const agenda = computed(() => sharedAgendaRef.value)
  const barberStore = useBarberStore()

  const agendaCount = computed(() => sharedAgendaRef.value.length)

  const agendaBarbers = computed(() => {
    try {
      if (!Array.isArray(sharedAgendaRef.value)) {
        return []
      }
      return sharedAgendaRef.value
        .map(item => ({
          ...item,
          barberia: barberStore.getBarberById(item.barberId)
        }))
        .filter(item => item.barberia !== undefined && item.barberia !== null)
    } catch (error) {
      console.error('Error en agendaBarbers:', error)
      return []
    }
  })

  function hasAgenda(barberId) {
    return sharedAgendaRef.value.some(item => item.barberId === barberId)
  }

  function addAgenda(barberId, fecha = null, hora = null) {
    if (!hasAgenda(barberId)) {
      sharedAgendaRef.value.push({
        id: Date.now().toString(),
        barberId,
        fecha,
        hora,
        createdAt: new Date().toISOString(),
      })
      return true
    }
    return false
  }

  function removeAgenda(barberId) {
    const index = sharedAgendaRef.value.findIndex(item => item.barberId === barberId)
    if (index !== -1) {
      sharedAgendaRef.value.splice(index, 1)
      return true
    }
    return false
  }

  function updateAgenda(barberId, fecha, hora) {
    const index = sharedAgendaRef.value.findIndex(item => item.barberId === barberId)
    if (index !== -1) {
      sharedAgendaRef.value[index] = {
        ...sharedAgendaRef.value[index],
        fecha,
        hora,
        updatedAt: new Date().toISOString(),
      }
      return true
    }
    return false
  }

  return {
    agenda,
    agendaCount,
    agendaBarbers,
    hasAgenda,
    addAgenda,
    removeAgenda,
    updateAgenda,
  }
}

