import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CarsModule from '../components/CarsModule.vue'
import AuthModule from '../components/AuthModule.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
  },
  { 
    path: '/cars', 
    redirect: '/cars/list/all' 
  },
  {
    path: '/cars/:action/:id',
    name: 'cars',
    component: CarsModule,
    props: true
  },
  {
    path: '/auth',
    name: 'AuthenticationDemo',
    component: AuthModule
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
