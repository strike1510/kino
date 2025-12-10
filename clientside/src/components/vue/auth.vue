<template>
  <div class="auth-container">
    <!-- Logo and title -->
    <div class="auth-header">
      <img src="@/assets/home_logo.png" alt="Kino" class="auth-logo" />
      <h1 class="auth-title">Kino Database</h1>
      <p class="auth-subtitle">Manage your cinema database</p>
    </div>

    <!-- windows -->
    <div class="auth-tabs">
      <button
        @click="activeTab = 'login'"
        :class="{ active: activeTab === 'login' }"
        class="tab-btn"
      >
        Sign In
      </button>
      <button
        @click="activeTab = 'register'"
        :class="{ active: activeTab === 'register' }"
        class="tab-btn"
      >
        Sign Up
      </button>
    </div>

    <!-- Forum Login -->
    <div v-if="activeTab === 'login'" class="auth-form">
      <h2 class="form-title">Welcome Back</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-identifier">Username or Email</label>
          <input
            id="login-identifier"
            v-model="loginForm.identifier"
            type="text"
            required
            placeholder="Enter your username or email"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="login-password">Password</label>
          <input
            id="login-password"
            v-model="loginForm.password"
            type="password"
            required
            placeholder="Enter your password"
            class="form-input"
          />
        </div>

        <div v-if="loginError" class="error-message">
          {{ loginError }}
        </div>

        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>



    <!-- back Bouton -->
    <button @click="goBack" class="back-btn">
      ← Back to Home
    </button>
  </div>
</template>

<script>
export default {
  name: 'AuthPage',
  data() {
    return {
      activeTab: 'login',
      loading: false,
      loginForm: {
        identifier: '', // Can be username or email
        password: ''
      },
      registerForm: {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        age: null
      },
      loginError: '',
      registerError: ''
    };
  },
  mounted() {
    const tabParam = this.$route.query.tab;
    if (tabParam === 'register') {
      this.activeTab = 'register';
    }
    this.checkIfAlreadyLoggedIn();
  },
  methods: {
    async checkIfAlreadyLoggedIn() {
      try {
        const response = await fetch('http://localhost:9000/auth/status', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.isAuthenticated) {
          // User is already logged in, redirect to home
          alert('You are already logged in as ' + data.user.username);
          this.$router.push('/');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    },

    async handleLogin() {
      this.loginError = '';
      this.loading = true;

      try {
        const response = await fetch('http://localhost:9000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            identifier: this.loginForm.identifier,
            password: this.loginForm.password
          })
        });

        const data = await response.json();

        if (data.loginResult) {
          // Save user info to localStorage for quick access
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          this.$router.push('/');
        } else {
          this.loginError = data.error || 'Invalid credentials';
        }
      } catch (error) {
        this.loginError = 'Server error. Please try again.';
        console.error('Login error:', error);
      } finally {
        this.loading = false;
      }
    },

    async handleRegister() {
      this.registerError = '';
      
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.registerError = 'Passwords do not match';
        return;
      }

      if (this.registerForm.password.length < 8) {
        this.registerError = 'Password must be at least 8 characters';
        return;
      }

      this.loading = true;

      try {
        const response = await fetch('http://localhost:9000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: this.registerForm.email,
            username: this.registerForm.username,
            password: this.registerForm.password,
            age: this.registerForm.age || null
          })
        });

        const data = await response.json();

        if (data.registerResult) {
          // Save user info to localStorage
          if (data.user) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
          }
          this.$router.push('/');
        } else {
          this.registerError = data.error || 'Registration failed';
        }
      } catch (error) {
        this.registerError = 'Server error. Please try again.';
        console.error('Registration error:', error);
      } finally {
        this.loading = false;
      }
    },

    goBack() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped src="../css/auth.css"></style>