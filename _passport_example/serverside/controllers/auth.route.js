// controllers/auth.route.js
const express = require('express');
const router = express.Router();
const auth = require("../utils/users.auth");
const userRepo = require("../utils/users.repository");

// http://localhost:9000/auth
// USE AUTHORIZATION HERE (the method does not know if authorization is present)
// MAC/DAC/RBAC, Claims-based authorization, Policy-based authorization, Resource-based authorization
router.get("/user", auth.authorizeRequest("USER"), userdataAction); // expose function only for USER roles
router.get("/admin", auth.authorizeRequest("ADMIN"), userdataAction); // expose function only for ADMIN roles
router.get("/protected", protectedGetAction); // execute authorization in action method: needed for resource-based auth
router.post("/login", loginPostAction);
router.get("/logout", logoutAction);

// use same endpoints for both roles
async function userdataAction(request, response) {
  let userJson = JSON.stringify(request.user); 
  response.send(userJson);
}

async function protectedGetAction(request, response) {
  // TODO: authorize using all factors (resource / context / environment) ...
  let userRole = "GUEST CONTENT";
  if (request.isAuthenticated()) {
    if (request.user.user_role === "ADMIN") {
      userRole = "ADMIN CONTENT";
    } else {
      userRole = "USER CONTENT";
    }
  } 
  let resultObject = { "contentResult": userRole, "timestamp": new Date().toLocaleString() };
  response.send(JSON.stringify(resultObject));
}

async function loginPostAction(request, response) {
  // passport.authenticate('local', { successRedirect: '/' }));
  let areValid = await userRepo.areValidCredentials(request.body.username, request.body.userpass);

  if (areValid) {
    user = await userRepo.getOneUser(request.body.username);
    request.login(user, function (err) { 
      if (err) { 
        console.log("LOGINERROR");
        console.log(err); 
        areValid = false;
        // return next(err);
      }
      let resultObject = { "loginResult": areValid, "timestamp": new Date().toLocaleString() };
      response.send(JSON.stringify(resultObject));
    });
  } else {
    let resultObject = { "loginResult": areValid, "timestamp": new Date().toLocaleString() };
    response.send(JSON.stringify(resultObject));
  }
}

function logoutAction(request, response) {
  request.logout(function(err){
    let resultObject = { "logoutResult": true, "timestamp": new Date().toLocaleString() };
    if (err) { 
      console.log("LOGINERROR");
      console.log(err); 
      areValid = false;
      // return next(err);
    }
    response.send(JSON.stringify(resultObject));
  });
}

module.exports = router;