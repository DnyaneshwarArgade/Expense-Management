const Agriculture = require("../models/AgricultureModel");

const getAllAgricultureExpenses = (req, res) => {
  Agriculture.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createAgricultureExpense = (req, res) => {
  const newExpense = req.body;
  
  // Stringify 'details' if it's an array/object for MySQL JSON column
  if (newExpense.details && typeof newExpense.details !== "string") {
    newExpense.details = JSON.stringify(newExpense.details);
  }

  Agriculture.create(newExpense, (err, results) => {
    if (err) {
      console.error("Database Insert Error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Agriculture expense added successfully!", id: results.insertId });
  });
};

const updateAgricultureExpense = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  Agriculture.update(id, updatedData, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Agriculture expense updated successfully!" });
  });
};

const deleteAgricultureExpense = (req, res) => {
  const { id } = req.params;
  Agriculture.delete(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Agriculture expense deleted successfully!" });
  });
};

module.exports = {
  getAllAgricultureExpenses,
  createAgricultureExpense,
  updateAgricultureExpense,
  deleteAgricultureExpense
};
