// controllers/auth.route.js
const express = require('express');
const router = express.Router();
const auth = require("../utils/users.auth");
const userRepo = require("../utils/users.repository");

// Authentication routes for Kino Cinema App
// Base URL: http://localhost:9000/auth

// Login endpoint
router.post("/login", loginPostAction);

// Register endpoint
router.post("/register", registerPostAction);

// Logout endpoint
router.get("/logout", logoutAction);

// Check authentication status
router.get("/status", authStatusAction);

// Get current user info (protected route)
router.get("/user", auth.authorizeRequest(), getUserAction);

// Login action
async function loginPostAction(request, response) {
  try {
    const { identifier, password } = request.body; // identifier can be username or email
    
    if (!identifier || !password) {
      return response.status(400).json({
        loginResult: false,
        error: "Username/email and password are required",
        timestamp: new Date().toLocaleString()
      });
    }

    let areValid = await userRepo.areValidCredentials(identifier, password);

    if (areValid) {
      let user = await userRepo.getUserByIdentifier(identifier);
      
      request.login(user, function (err) { 
        if (err) { 
          console.log("LOGIN ERROR:", err);
          return response.status(500).json({
            loginResult: false,
            error: "Login failed",
            timestamp: new Date().toLocaleString()
          });
        }
        
        return response.json({
          loginResult: true,
          user: {
            id: user.ID_spectator,
            username: user.Username,
            email: user.Email,
            is_admin: user.is_admin
          },
          timestamp: new Date().toLocaleString()
        });
      });
    } else {
      return response.status(401).json({
        loginResult: false,
        error: "Invalid credentials",
        timestamp: new Date().toLocaleString()
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return response.status(500).json({
      loginResult: false,
      error: "Server error",
      timestamp: new Date().toLocaleString()
    });
  }
}

// Register action
async function registerPostAction(request, response) {
  try {
    const { email, username, password, age } = request.body;
    
    if (!email || !username || !password) {
      return response.status(400).json({
        registerResult: false,
        error: "Email, username, and password are required",
        timestamp: new Date().toLocaleString()
      });
    }

    if (password.length < 8) {
      return response.status(400).json({
        registerResult: false,
        error: "Password must be at least 8 characters",
        timestamp: new Date().toLocaleString()
      });
    }

    const result = await userRepo.registerUser(email, username, password, age || null);

    if (result.success) {
      // Auto-login after registration
      let user = await userRepo.getOneUser(username);
      
      request.login(user, function (err) {
        if (err) {
          console.log("AUTO-LOGIN ERROR:", err);
          return response.json({
            registerResult: true,
            message: "Registration successful, please login",
            timestamp: new Date().toLocaleString()
          });
        }
        
        return response.json({
          registerResult: true,
          user: {
            id: user.ID_spectator,
            username: user.Username,
            email: user.Email
          },
          timestamp: new Date().toLocaleString()
        });
      });
    } else {
      return response.status(400).json({
        registerResult: false,
        error: result.error,
        timestamp: new Date().toLocaleString()
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return response.status(500).json({
      registerResult: false,
      error: "Server error",
      timestamp: new Date().toLocaleString()
    });
  }
}

// Logout action
function logoutAction(request, response) {
  request.logout(function(err) {
    if (err) { 
      console.log("LOGOUT ERROR:", err);
      return response.status(500).json({
        logoutResult: false,
        error: "Logout failed",
        timestamp: new Date().toLocaleString()
      });
    }
    
    return response.json({
      logoutResult: true,
      timestamp: new Date().toLocaleString()
    });
  });
}

// Check authentication status
function authStatusAction(request, response) {
  if (request.isAuthenticated()) {
    return response.json({
      isAuthenticated: true,
      user: {
        id: request.user.ID_spectator,
        username: request.user.Username,
        email: request.user.Email,
        is_admin: request.user.is_admin
      },
      timestamp: new Date().toLocaleString()
    });
  } else {
    return response.json({
      isAuthenticated: false,
      timestamp: new Date().toLocaleString()
    });
  }
}

// Get current user info
function getUserAction(request, response) {
  return response.json({
    user: {
      id: request.user.ID_spectator,
      username: request.user.Username,
      email: request.user.Email,
      age: request.user.Age,
      registrationDate: request.user.Registration_date,
      is_admin: request.user.is_admin
    },
    timestamp: new Date().toLocaleString()
  });
}

module.exports = router;
