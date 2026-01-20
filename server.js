require('dotenv').config();
const express = require('express');
const cors = require('cors')
const connectDB = require('./config/db');
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || "5000";

// middlewares
app.use(cors());
app.use(express.json())
app.use(helmet()); // adds all default security headers
// Log requests in 'dev' format
app.use(morgan("dev"));

// Database connection
connectDB()

app.get('/', (req, res) => {
    res.send("API is running...")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

