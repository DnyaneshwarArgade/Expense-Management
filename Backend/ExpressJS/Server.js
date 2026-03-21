require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db_connection");

// Import Routes
const agricultureRoutes = require("./routes/AgricultureRoutes");

app.use(cors());
app.use(express.json());

// Use Routes
app.use("/api/agriculture", agricultureRoutes);

app.get("/", (req, res) => res.send("Backend is running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
