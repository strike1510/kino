import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'main',
    // Main page is handled directly in App.vue
    component: { template: '<div></div>' }
  },
  {
    path: '/cinema',
    name: 'cinema',
    component: () => import('../views/CinemaView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/review',
    name: 'review',
    component: () => import('../views/ReviewView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router