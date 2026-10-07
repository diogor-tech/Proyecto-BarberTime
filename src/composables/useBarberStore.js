import { ref, computed } from 'vue'

const STORAGE_KEY = 'barberTime_barbers'

function cargarBarberias() {
  try {
    const guardadas = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    )

    return Array.isArray(guardadas)
      ? guardadas
      : []
  } catch {
    return []
  }
}

const sharedBarbersRef = ref(cargarBarberias())

function guardarBarberias() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(sharedBarbersRef.value)
  )
}

export function useBarberStore() {

  const barbers = computed(() =>
    sharedBarbersRef.value.filter(
      barber => barber.estado === 'aprobada'
    )
  )

  const allBarbers = computed(
    () => sharedBarbersRef.value
  )

  const pendingBarbers = computed(() =>
    sharedBarbersRef.value.filter(
      barber => barber.estado === 'pendiente'
    )
  )

  function getBarberById(id) {
    return sharedBarbersRef.value.find(
      barber => barber.id === id
    )
  }

  function addBarber(barberData) {

    const newBarber = {
      id: Date.now().toString(),

      ...barberData,

      estado: 'pendiente',

      rating: 0,
      ratingCount: 0,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    sharedBarbersRef.value.push(newBarber)

    guardarBarberias()

    return newBarber
  }

  function approveBarber(id) {

    const barber = sharedBarbersRef.value.find(
      item => item.id === id
    )

    if (!barber) return null

    barber.estado = 'aprobada'
    barber.updatedAt = new Date().toISOString()

    guardarBarberias()

    return barber
  }

  function rejectBarber(id) {

    const barber = sharedBarbersRef.value.find(
      item => item.id === id
    )

    if (!barber) return null

    barber.estado = 'rechazada'
    barber.updatedAt = new Date().toISOString()

    guardarBarberias()

    return barber
  }

  function rateBarber(id, rating) {

    const barber = sharedBarbersRef.value.find(
      item => item.id === id
    )

    const score = Number(rating)

    if (
      !barber ||
      !Number.isInteger(score) ||
      score < 1 ||
      score > 5
    ) {
      return null
    }

    const ratingCount = barber.ratingCount || 0

    barber.rating = Number(
      (
        (
          (barber.rating || 0) * ratingCount +
          score
        ) /
        (ratingCount + 1)
      ).toFixed(1)
    )

    barber.ratingCount = ratingCount + 1

    guardarBarberias()

    return barber
  }

  function updateBarber(id, barberData) {

    const index =
      sharedBarbersRef.value.findIndex(
        barber => barber.id === id
      )

    if (index === -1) return null

    sharedBarbersRef.value[index] = {
      ...sharedBarbersRef.value[index],
      ...barberData,
      updatedAt: new Date().toISOString()
    }

    guardarBarberias()

    return sharedBarbersRef.value[index]
  }

  function deleteBarber(id) {

    const index =
      sharedBarbersRef.value.findIndex(
        barber => barber.id === id
      )

    if (index === -1) return false

    sharedBarbersRef.value.splice(index, 1)

    guardarBarberias()

    return true
  }

  const barberCount = computed(
    () => sharedBarbersRef.value.length
  )

  return {
    barbers,
    allBarbers,
    pendingBarbers,
    barberCount,

    getBarberById,

    addBarber,
    approveBarber,
    rejectBarber,

    updateBarber,
    rateBarber,
    deleteBarber
  }
}