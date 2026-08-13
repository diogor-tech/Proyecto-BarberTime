import { ref, computed } from 'vue'

let sharedBarbersRef = ref([])

export function useBarberStore() {
  const barbers = computed(() => sharedBarbersRef.value)

  function getBarberById(id) {
    return sharedBarbersRef.value.find(b => b.id === id)
  }

  function addBarber(barberData) {
    const newBarber = {
      id: Date.now().toString(),
      ...barberData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    sharedBarbersRef.value.push(newBarber)
    return newBarber
  }

  function updateBarber(id, barberData) {
    const index = sharedBarbersRef.value.findIndex(b => b.id === id)
    if (index !== -1) {
      sharedBarbersRef.value[index] = {
        ...sharedBarbersRef.value[index],
        ...barberData,
        updatedAt: new Date().toISOString(),
      }
      return sharedBarbersRef.value[index]
    }
    return null
  }

  function deleteBarber(id) {
    const index = sharedBarbersRef.value.findIndex(b => b.id === id)
    if (index !== -1) {
      sharedBarbersRef.value.splice(index, 1)
      return true
    }
    return false
  }

  const barberCount = computed(() => sharedBarbersRef.value.length)

  return {
    barbers,
    barberCount,
    getBarberById,
    addBarber,
    updateBarber,
    deleteBarber,
  }
}
