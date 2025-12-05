const bcrypt = require('bcrypt');
const pool = require(__dirname + "\\db.include.js");

// User repository for Kino Cinema App
// Handles user authentication and registration using Spectator table

module.exports = {
  // Get user information (without password)
  async getOneUser(username) {
    try {
      let sql = "SELECT ID_spectator, Email, Username, Age, Registration_date, is_admin FROM Spectator WHERE Username = ?"; 
      const [rows] = await pool.execute(sql, [username]);
      if (rows.length === 1) {
        return rows[0];
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  
  // Validate user credentials (username/email + password)
  async areValidCredentials(identifier, password) {
    try {
      // Support login with either username or email
      let sql = "SELECT * FROM Spectator WHERE Username = ? OR Email = ?"; 
      const [rows] = await pool.execute(sql, [identifier, identifier]); 
      console.log("CHECKING USER CREDENTIALS...");
      
      if (rows.length === 1) {
        let result = await bcrypt.compare(password, rows[0].Password_hash);
        console.log("Password validation result:", result);
        return result;
      } else {
        console.log("User not found");
        return false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // Register new user
  async registerUser(email, username, password, age) {
    try {
      // Check if user already exists
      let checkSql = "SELECT ID_spectator FROM Spectator WHERE Username = ? OR Email = ?";
      const [existingUsers] = await pool.execute(checkSql, [username, email]);
      
      if (existingUsers.length > 0) {
        return { success: false, error: "Username or email already exists" };
      }

      // Hash password with bcrypt (salt rounds = 10)
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Insert new user
      let insertSql = "INSERT INTO Spectator (Email, Username, Password_hash, Age) VALUES (?, ?, ?, ?)";
      const [result] = await pool.execute(insertSql, [email, username, passwordHash, age]);

      console.log("New user registered:", username);
      return { success: true, userId: result.insertId };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // Get user by username or email
  async getUserByIdentifier(identifier) {
    try {
      let sql = "SELECT ID_spectator, Email, Username, Age, Registration_date, is_admin FROM Spectator WHERE Username = ? OR Email = ?";
      const [rows] = await pool.execute(sql, [identifier, identifier]);
      
      if (rows.length === 1) {
        return rows[0];
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
