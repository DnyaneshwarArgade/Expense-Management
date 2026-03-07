const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "ashwini",
  password: "1234",
  database: "expense_tracker"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("MySQL Database connected successfully!");
  }
});

module.exports = db;