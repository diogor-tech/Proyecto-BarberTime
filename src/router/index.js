import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StoreView from "@/views/StoreView.vue"
import CartView from "@/views/CartView.vue"
import ProductView from "@/views/ProductView.vue"
import CheckoutView from "@/views/CheckoutView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/explore',
      name: 'explore',
      component: () => import('../views/ExploreView.vue'),
    },
    {
  path: "/product/:id",
  component: ProductView
},

    {
      path: '/agenda',
      name: 'agenda',
      meta: { requiresAuth: true },
      component: () => import('../views/AgendaView.vue'),
    },

    {
      path: '/favorites',
      name: 'favorites',
      meta: { requiresAuth: true },
      component: () => import('../views/FavoritesView.vue'),
    },

    {
      path: '/profile',
      name: 'profile',
      meta: { requiresAuth: true },
      component: () => import('../views/ProfileView.vue'),
    },

    {
      path: '/premium',
      name: 'premium',
      component: () => import('../views/secondary/BarberpremiumView.vue'),
    },
    {
path:"/checkout",
meta: { requiresAuth: true },
component:CheckoutView
},

    {
      path: '/create',
      name: 'create',
      meta: { requiresAuth: true },
      component: () => import('../views/secondary/BarbercreateView.vue'),
    },
    {
  path: "/cart",
  meta: { requiresAuth: true },
  component: CartView
},

    {
      path: '/barbershop/:id',
      name: 'barbershop-detail',
      component: () => import('../views/BarbershopDetailView.vue'),
    },
    {
  path: "/store",
  name: "store",
  component: StoreView
}

  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('currentUser')) {
    return { path: '/', query: { login: 'required' } }
  }
})

export default router
