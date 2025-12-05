const passport = require("passport");
const usersRepo = require(__dirname + "\\users.repository.js"); // use same folder as the current file

// const localStrategy = require('passport-local');
// passport.use(new LocalStrategy(xxx));
// check https://www.passportjs.org/howtos/password/ for full localStrategy implementation
// instead, we will call request.login on our own, it is cleaner ...

// session+passport docs:
// https://www.passportjs.org/howtos/session/
// https://www.passportjs.org/concepts/authentication/sessions/

module.exports = {
  initializeAuthentications(app) {
    app.use(passport.initialize());
    app.use(passport.authenticate('session'));

    // Serialization will be called during request.login(userFromDb) 
    // Result will be saved into session
    passport.serializeUser(function (userFromDb, doneFunction) { 
      console.log("<SERIALIZE>");
      console.log(userFromDb);
      const userObj = { "id": userFromDb.user_id, "name": userFromDb.user_name, "role": userFromDb.user_role }; // only the ID/unqique name would be enough...
      console.log(userObj);
      console.log("</SERIALIZE>");
      doneFunction(null, userObj);
    });

    // This will be login when serialized user is in the session
    // Result will be saved into request.user
    passport.deserializeUser(async function (userObj, doneFunction) { 
      console.log("<DE SERIALIZE>");
      console.log(userObj);
      let userFromDb = await usersRepo.getOneUser(userObj.name);
      console.log(userFromDb);
      console.log("</DE SERIALIZE>");
      doneFunction(null, userFromDb);
    });
  },

  authorizeRequest(requiredRole) {
    return function (request, response, next) {
      if (request.isAuthenticated()) { // Do we have an authenticated user?
        if (requiredRole) { // No special role needed for page -> check if current user has the SAME role (todo: hierarchy?)
          if (requiredRole === request.user.user_role) { 
            return next();
          } else {
            return response.end(JSON.stringify({"error": "401 Unautorized (bad user level)", "timestamp": new Date().toLocaleString()})); 
          }
        } else { // No special role needed for page -> next middleware
          return next();
        }
      } else { // not authenticated at all
        return response.end(JSON.stringify({"error": "401 Unautorized (not authenticated)", "timestamp": new Date().toLocaleString()})); 
        // OR: response.redirect("/auth"); 
      }
    }
  }
};