const passport = require("passport");
const usersRepo = require(__dirname + "\\users.repository.js");

// Passport authentication for Kino Cinema App
// Based on passport documentation and session management

module.exports = {
  initializeAuthentications(app) {
    app.use(passport.initialize());
    app.use(passport.authenticate('session'));

    // Serialization: called during request.login(userFromDb) 
    // Result is saved into session
    passport.serializeUser(function (userFromDb, doneFunction) { 
      console.log("<SERIALIZE USER>");
      console.log(userFromDb);
      const userObj = { 
        "id": userFromDb.ID_spectator, 
        "username": userFromDb.Username, 
        "email": userFromDb.Email,
        "is_admin": userFromDb.is_admin
      };
      console.log(userObj);
      console.log("</SERIALIZE USER>");
      doneFunction(null, userObj);
    });

    // Deserialization: called when serialized user is in the session
    // Result is saved into request.user
    passport.deserializeUser(async function (userObj, doneFunction) { 
      console.log("<DESERIALIZE USER>");
      console.log(userObj);
      let userFromDb = await usersRepo.getOneUser(userObj.username);
      console.log(userFromDb);
      console.log("</DESERIALIZE USER>");
      doneFunction(null, userFromDb);
    });
  },

  // Middleware to protect routes requiring authentication
  authorizeRequest() {
    return function (request, response, next) {
      if (request.isAuthenticated()) {
        return next();
      } else {
        return response.status(401).json({
          "error": "401 Unauthorized - Authentication required", 
          "timestamp": new Date().toLocaleString()
        }); 
      }
    }
  }
};
