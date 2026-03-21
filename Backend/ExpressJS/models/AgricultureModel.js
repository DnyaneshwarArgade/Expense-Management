const db = require("../config/db_connection");

const Agriculture = {
  getAll: (callback) => {
    db.query("SELECT * FROM agriculture_expenses", callback);
  },
  getById: (id, callback) => {
    db.query("SELECT * FROM agriculture_expenses WHERE id = ?", [id], callback);
  },
  create: (data, callback) => {
    db.query("INSERT INTO agriculture_expenses SET ?", data, callback);
  },
  update: (id, data, callback) => {
    db.query("UPDATE agriculture_expenses SET ? WHERE id = ?", [data, id], callback);
  },
  delete: (id, callback) => {
    db.query("DELETE FROM agriculture_expenses WHERE id = ?", [id], callback);
  }
};

module.exports = Agriculture;
