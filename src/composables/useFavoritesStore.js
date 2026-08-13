import { ref, computed } from 'vue'
import { useBarberStore } from './useBarberStore'

let sharedFavoritesRef = ref([])

export function useFavoritesStore() {
  const favorites = computed(() => sharedFavoritesRef.value)
  const barberStore = useBarberStore()

  const favoriteCount = computed(() => sharedFavoritesRef.value.length)

  const favoriteBarbers = computed(() => {
    try {
      if (!Array.isArray(sharedFavoritesRef.value)) {
        return []
      }
      return sharedFavoritesRef.value
        .map(id => barberStore.getBarberById(id))
        .filter(b => b !== undefined && b !== null)
    } catch (error) {
      console.error('Error en favoriteBarbers:', error)
      return []
    }
  })

  function isFavorite(barberId) {
    return sharedFavoritesRef.value.includes(barberId)
  }

  function toggleFavorite(barberId) {
    const index = sharedFavoritesRef.value.indexOf(barberId)
    if (index === -1) {
      sharedFavoritesRef.value.push(barberId)
    } else {
      sharedFavoritesRef.value.splice(index, 1)
    }
  }

  function addFavorite(barberId) {
    if (!isFavorite(barberId)) {
      sharedFavoritesRef.value.push(barberId)
    }
  }

  function removeFavorite(barberId) {
    const index = sharedFavoritesRef.value.indexOf(barberId)
    if (index !== -1) {
      sharedFavoritesRef.value.splice(index, 1)
    }
  }

  return {
    favorites,
    favoriteCount,
    favoriteBarbers,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
  }
}

