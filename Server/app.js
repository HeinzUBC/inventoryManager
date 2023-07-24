const mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
require("dotenv").config();

// The main entry point for the Express backend. It sets up the application,
// defines middleware, connects to the MongoDB database, and configures the routes.

var inventoryRouter = require('./routes/InventoryItems');
var categoryRouter = require('./routes/categories');

var app = express();

// Enable Cross-Origin Resource Sharing (CORS) and allow requests from different origins.
// This prevents cross-site request forgery (CSRF) issues
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/inventoryItems', inventoryRouter);
app.use('/api/categories', categoryRouter);

// app.js connects to different MongoDB Atlas databases
// based on whether we are running the backend with "npm start"
// or "npm test"
let mongoDBConnectionString = process.env.MONGODB_URI;
if (process.env.NODE_ENV === 'test') {
    mongoDBConnectionString = process.env.MONGODB_TEST_URL;
}

// Connect Express backend to (or create if first time) a remote MongoDB
// database called inventoryManager
mongoose
    .connect(mongoDBConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => {
        console.error('Could not connect to MongoDB...');
        console.error(err);

        // Terminate the process with a non-zero exit code
        process.exit(1);
    });

module.exports = app;
