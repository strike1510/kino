<template>
  <div id="app">
    <MainPage v-if="$route.path === '/'" />
    
    <nav v-else class="page-nav">
      <router-link to="/">Main</router-link>
      <router-link to="/home">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/review">Review</router-link>
    </nav>
    
    <router-view v-if="$route.path !== '/'"/>
  </div>
</template>

<script>
import MainPage from '@/components/vue/Main.vue'

export default {
  name: 'App',
  components: {
    MainPage
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

.page-nav {
  background: #f8f9fa;
  padding: 15px;
  display: flex;
  gap: 20px;
  justify-content: center;
  border-bottom: 1px solid #dee2e6;
}

.page-nav a {
  color: #495057;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
}

.page-nav a:hover {
  background: #e9ecef;
  color: #212529;
}

.page-nav a.router-link-exact-active {
  background: #007bff;
  color: white;
}

@media (max-width: 768px) {
  .page-nav {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>