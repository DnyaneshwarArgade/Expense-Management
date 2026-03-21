const express = require("express");
const router = express.Router();
const AgricultureController = require("../controllers/AgricultureController");

router.get("/", AgricultureController.getAllAgricultureExpenses);
router.post("/", AgricultureController.createAgricultureExpense);
router.put("/:id", AgricultureController.updateAgricultureExpense);
router.delete("/:id", AgricultureController.deleteAgricultureExpense);

module.exports = router;
