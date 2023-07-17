const mongoose = require('mongoose');

// Defines a Mongoose schema and model for the "Category" collection in the MongoDB database.
const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        trim: true,
        uppercase: true,
        required: true,
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;


