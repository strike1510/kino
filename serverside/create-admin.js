require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./utils/db.include.js');

async function setupAdmin() {
  try {
    console.log('Starting admin setup...\n');

    // Step 1: Add is_admin column if it doesn't exist
    console.log('Step 1: Adding is_admin column to Spectator table...');
    try {
      await pool.execute('ALTER TABLE Spectator ADD COLUMN is_admin BOOLEAN DEFAULT FALSE');
      console.log('✓ is_admin column added successfully\n');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ is_admin column already exists\n');
      } else {
        throw err;
      }
    }

    // Step 2: Create admin account
    console.log('Step 2: Creating admin account...');
    const adminEmail = 'admin@cinema.com';
    const adminUsername = 'admin';
    const adminPassword = 'admin123'; // Change this to a secure password
    const adminAge = 25;

    // Check if admin already exists
    const [existingAdmin] = await pool.execute(
      'SELECT ID_spectator FROM Spectator WHERE Username = ? OR Email = ?',
      [adminUsername, adminEmail]
    );

    if (existingAdmin.length > 0) {
      console.log('Admin account already exists. Updating admin status...');
      await pool.execute(
        'UPDATE Spectator SET is_admin = TRUE WHERE Username = ? OR Email = ?',
        [adminUsername, adminEmail]
      );
      console.log('✓ Admin status updated\n');
    } else {
      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

      // Insert admin user
      await pool.execute(
        'INSERT INTO Spectator (Email, Username, Password_hash, Age, is_admin) VALUES (?, ?, ?, ?, TRUE)',
        [adminEmail, adminUsername, passwordHash, adminAge]
      );
      console.log('✓ Admin account created successfully\n');
    }

    // Step 3: Display admin credentials
    console.log('═══════════════════════════════════════');
    console.log('ADMIN ACCOUNT CREDENTIALS:');
    console.log('═══════════════════════════════════════');
    console.log('Email:    admin@cinema.com');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('═══════════════════════════════════════\n');
    console.log('⚠️  IMPORTANT: Change the password after first login!\n');

    // Step 4: Verify admin setup
    const [adminCheck] = await pool.execute(
      'SELECT Username, Email, is_admin FROM Spectator WHERE Username = ?',
      [adminUsername]
    );
    console.log('Admin account verification:', adminCheck[0]);

    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
}

setupAdmin();
