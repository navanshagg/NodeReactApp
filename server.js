const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001; // Change this if needed

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1W@e3r4',
  database: 'user',
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Create a table to store the data if it doesn't exist
const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL
)`;

connection.query(createTableQuery, (err) => {
  if (err) throw err;
  console.log('Users table created or already exists');
});

// Parse JSON bodies for POST requests
app.use(express.json());

// Add a new user to the database
app.post('/api/users', (req, res) => {
  const { name, username } = req.body;
  const insertQuery = `INSERT INTO users (name, username) VALUES (?, ?)`;

  connection.query(insertQuery, [name, username], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding user to the database');
    } else {
      res.status(201).send('User added successfully');
    }
  });
});
// Update a user in the database
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, username } = req.body;
  const updateQuery = `UPDATE users SET name = ?, username = ? WHERE id = ?`;

  connection.query(updateQuery, [name, username, userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating user in the database');
    } else {
      res.status(200).send('User updated successfully');
    }
  });
});

// Delete a user from the database
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const deleteQuery = `DELETE FROM users WHERE id = ?`;

  connection.query(deleteQuery, [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting user from the database');
    } else {
      res.status(200).send('User deleted successfully');
    }
  });
});

// Retrieve all users from the database
app.get('/api/users', (req, res) => {
  const selectQuery = 'SELECT * FROM users';

  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving users from the database');
    } else {
      res.status(200).json(results);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});