<template>
  <div class="auth-container">
    <!-- Logo et titre -->
    <div class="auth-header">
      <img src="@/assets/home_logo.png" alt="Kino" class="auth-logo" />
      <h1 class="auth-title">Kino Database</h1>
      <p class="auth-subtitle">Manage your cinema database</p>
    </div>

    <!-- Onglets -->
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

    <!-- Formulaire Login -->
    <div v-if="activeTab === 'login'" class="auth-form">
      <h2 class="form-title">Welcome Back</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input
            id="login-email"
            v-model="loginForm.email"
            type="email"
            required
            placeholder="Enter your email"
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

    <!-- Formulaire Register -->
    <div v-if="activeTab === 'register'" class="auth-form">
      <h2 class="form-title">Create Account</h2>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="register-email">Email</label>
          <input
            id="register-email"
            v-model="registerForm.email"
            type="email"
            required
            placeholder="Enter your email"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="register-password">Password</label>
          <input
            id="register-password"
            v-model="registerForm.password"
            type="password"
            required
            placeholder="At least 8 characters"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            v-model="registerForm.confirmPassword"
            type="password"
            required
            placeholder="Confirm your password"
            class="form-input"
            :class="{ 'input-error': registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword }"
          />
          <div v-if="registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword" class="password-error">
            Passwords do not match
          </div>
        </div>

        <div v-if="registerError" class="error-message">
          {{ registerError }}
        </div>

        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>
    </div>

    <!-- Bouton retour -->
    <button @click="goBack" class="back-btn">
      ← Back to Home
    </button>
  </div>
</template>

<script>
import bcrypt from 'bcryptjs';

export default {
  name: 'AuthPage',
  data() {
    return {
      activeTab: 'login',
      loading: false,
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        email: '',
        password: '',
        confirmPassword: ''
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
    
    this.checkExistingAuth();
  },
  methods: {
    checkExistingAuth() {
      const session = JSON.parse(localStorage.getItem('session') || 'null');
      if (session?.isAuthenticated) {
        this.$router.push('/');
      }
    },

    async handleLogin() {
      this.loginError = '';
      this.loading = true;

      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === this.loginForm.email);

        if (!user) {
          this.loginError = 'Invalid email or password';
          return;
        }

        const isValid = await bcrypt.compare(this.loginForm.password, user.password);

        if (!isValid) {
          this.loginError = 'Invalid email or password';
          return;
        }

        const session = {
          email: user.email,
          isAuthenticated: true,
          timestamp: Date.now()
        };

        localStorage.setItem('session', JSON.stringify(session));
        this.$router.push('/');
        
      } catch (error) {
        this.loginError = 'An error occurred. Please try again.';
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
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        const userExists = users.some(u => u.email === this.registerForm.email);
        if (userExists) {
          this.registerError = 'Email already registered';
          return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.registerForm.password, salt);

        const newUser = {
          email: this.registerForm.email,
          password: hashedPassword,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        const session = {
          email: newUser.email,
          isAuthenticated: true,
          timestamp: Date.now()
        };

        localStorage.setItem('session', JSON.stringify(session));
        this.$router.push('/');
        
      } catch (error) {
        this.registerError = 'An error occurred. Please try again.';
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

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
}

.auth-logo {
  height: 60px;
  margin-bottom: 20px;
}

.auth-title {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 700;
}

.auth-subtitle {
  color: #7f8c8d;
  font-size: 16px;
}

.auth-tabs {
  display: flex;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 30px;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  color: #6c757d;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 15px;
}

.tab-btn.active {
  background: white;
  color: #3498db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-btn:hover:not(.active) {
  color: #2c3e50;
}

.auth-form {
  margin-bottom: 30px;
}

.form-title {
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 25px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  background: white;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-input.input-error {
  border-color: #e74c3c;
}

.password-error {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 6px;
}

.error-message {
  background: #ffeaea;
  color: #c0392b;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  border-left: 4px solid #e74c3c;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-btn {
  width: 100%;
  padding: 12px;
  background: #f8f9fa;
  color: #6c757d;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.back-btn:hover {
  background: #e9ecef;
  border-color: #ced4da;
}

@media (max-width: 480px) {
  .auth-container {
    margin: 30px 20px;
    padding: 30px 20px;
  }
  
  .auth-title {
    font-size: 24px;
  }
  
  .form-title {
    font-size: 20px;
  }
}
</style>