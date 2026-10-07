import { computed, ref } from 'vue'

export const DEFAULT_AVATAR =
  'https://drive.google.com/thumbnail?id=1Igq46CyxTBBX8AEimgfYxqmZrgcZLZqL&sz=w640'

const currentUser = ref(readCurrentUser())

function readCurrentUser() {
  const storedUser = localStorage.getItem('currentUser')

  if (!storedUser) return null

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem('currentUser')
    return null
  }
}

export function useAuth() {
  const isAuthenticated = computed(
    () => currentUser.value !== null
  )

  const avatar = computed(
    () => currentUser.value?.avatar || ''
  )

  const isAdmin = computed(
    () => currentUser.value?.role === 'admin'
  )

  const isBarber = computed(
    () => currentUser.value?.role === 'barbero'
  )

  const isClient = computed(
    () => currentUser.value?.role === 'cliente'
  )

  function setUser(user) {
    currentUser.value = user
  }

  function logout() {
    localStorage.removeItem('currentUser')
    currentUser.value = null
  }

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    isBarber,
    isClient,
    avatar,
    setUser,
    logout,
  }
}