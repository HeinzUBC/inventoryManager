const mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var dbConfig = require("./config/db.config");
var inventoryRouter = require('./routes/InventoryItems');
var categoryRouter = require('./routes/categories');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/inventoryItems', inventoryRouter);
app.use('/api/categories', categoryRouter);

// Connect (or create if first time) a remote MongoDB database called inventoryManager
mongoose
    .connect(dbConfig.url, {
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
