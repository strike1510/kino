<template>
  <div id="app">
    <MainPage v-if="$route.path === '/'" />
    
    <nav v-else class="page-nav">
      <div class="nav-logo">
        <router-link to="/" class="logo-link">
          <img src="@/assets/home_logo.png" alt="Kino" class="kino-logo" />
        </router-link>
      </div>
      <div class="nav-links">
        <router-link to="/cinema">Cinema Database</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/review">Review</router-link>
      </div>
      <div class="nav-spacer"></div>
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
  align-items: center;
  border-bottom: 1px solid #dee2e6;
  position: relative;
}

.nav-logo {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.nav-spacer {
  flex: 1;
}

.logo-link {
  display: block;
  padding: 0;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
  background: none !important;
}

.kino-logo {
  height: 40px;
  width: auto;
  display: block;
  transition: all 0.3s ease;
}

.kino-logo:hover {
  filter: brightness(1.1);
}

.nav-links {
  flex: 1;
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

.nav-links a {
  color: #495057;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-links a:hover {
  background: #e9ecef;
  color: #212529;
}

.nav-links a.router-link-exact-active {
  background: #007bff;
  color: white;
}

@media (max-width: 768px) {
  .page-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 10px 15px;
  }
  
  .nav-logo {
    align-self: center;
  }
  
  .kino-logo {
    height: 35px;
  }
  
  .nav-links {
    align-self: center;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }
  
  .nav-links a {
    padding: 6px 12px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .nav-links {
    gap: 10px;
  }
  
  .nav-links a {
    padding: 5px 10px;
    font-size: 13px;
  }
  
  .kino-logo {
    height: 30px;
  }
}
</style>