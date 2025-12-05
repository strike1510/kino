-- Admin Setup SQL Script for Kino Cinema Database
-- Run this script in your MySQL client (phpMyAdmin, MySQL Workbench, etc.)

-- Step 1: Add is_admin column to Spectator table
ALTER TABLE Spectator ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Step 2: Create admin account
-- Password: admin123 (bcrypt hash with 10 salt rounds)
INSERT INTO Spectator (Email, Username, Password_hash, Age, is_admin) 
VALUES (
    'admin@cinema.com', 
    'admin', 
    '$2b$10$3yLc7fGsabLTQrVvIiVop.paOaXbH0Bu/.RfmMR2SstggBSFv6FGq',
    25,
    TRUE
);

-- Step 3: Verify admin account was created
SELECT ID_spectator, Username, Email, is_admin FROM Spectator WHERE Username = 'admin';

-- Alternative: If admin account already exists, just update it to be admin
-- UPDATE Spectator SET is_admin = TRUE WHERE Username = 'admin' OR Email = 'admin@cinema.com';
