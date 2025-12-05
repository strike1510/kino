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
      
      <!-- BOUTON SIMPLE -->
      <div class="auth-section">
        <button 
          v-if="!isAuthenticated" 
          @click="goToAuth" 
          class="auth-btn login-btn"
        >
          Login
        </button>
        
        <button 
          v-else 
          @click="logout" 
          class="auth-btn logout-btn"
        >
          Logout
        </button>
      </div>
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
  },
  data() {
    return {
      isAuthenticated: false,
      userEmail: ''
    }
  },
  methods: {
    checkAuth() {
      const session = JSON.parse(localStorage.getItem('session') || 'null');
      
      if (session && session.isAuthenticated) {
        const sessionAge = Date.now() - session.timestamp;
        if (sessionAge < 24 * 60 * 60 * 1000) {
          this.isAuthenticated = true;
          this.userEmail = session.email;
        } else {
          localStorage.removeItem('session');
          this.isAuthenticated = false;
          this.userEmail = '';
        }
      }
    },
    
    goToAuth() {
      this.$router.push('/auth');
    },
    
    logout() {
      if (confirm('Do you want to logout?')) {
        localStorage.removeItem('session');
        this.isAuthenticated = false;
        this.userEmail = '';
        this.$router.push('/');
      }
    }
  },
  mounted() {
    this.checkAuth();
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
  background: #2c3e50;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-logo {
  flex: 1;
}

.logo-link {
  display: block;
}

.kino-logo {
  height: 35px;
  width: auto;
  display: block;
  filter: brightness(0) invert(1);
}

.nav-links {
  flex: 1;
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-links a.router-link-exact-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.auth-section {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.auth-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.login-btn {
  background: white;
  color: #2c3e50;
}

.login-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.logout-btn {
  background: #e74c3c;
  color: white;
}

.logout-btn:hover {
  background: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .page-nav {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
  
  .nav-logo {
    align-self: flex-start;
  }
  
  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 10px;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .auth-section {
    order: 2;
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .nav-links a {
    padding: 6px 12px;
    font-size: 14px;
  }
  
  .auth-btn {
    padding: 8px 20px;
    font-size: 13px;
  }
}
</style>