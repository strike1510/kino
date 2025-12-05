const bcrypt = require('bcrypt');
pool = require(__dirname + "\\db.include.js");

// TODO (everyone): Registration... 
// TODO (optional): Edit user... Change Password...
// TODO (not now): Email verification... User activation... Password rules...

module.exports = {
  async getOneUser(userName) {
    try {
      let sql = "SELECT user_id,user_name,user_email,user_role FROM users WHERE user_name = ? "; 
      // must always leave out the password+hash info from the result!
      const [rows, fields] = await pool.execute(sql, [ userName ]);
      if (rows.length == 1) {
        return rows[0];
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  
  async areValidCredentials(username, password) {
    try {
      let sql = "SELECT * FROM USERS WHERE user_name = ?"; 
      const [rows, fields] = await pool.execute(sql, [username]); 
      console.log("CHECKING USER...");
      console.log(rows);
      if (rows.length == 1 && rows[0].user_name === username) {
        let result = await bcrypt.compare(password, rows[0].user_pass);
        return result;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}; 