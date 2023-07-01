const mongoose = require('mongoose');
require('mongoose-type-url');
const Joi = require('joi');

// new attribute to InventoryItem is category
const InventoryItemSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        imageURL: {
            type: mongoose.SchemaTypes.Url,
            required: true,
            trim: true,
        },
        // references a Category object/document
        category: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Category",
            required: true
        }
});

const InventoryItem = mongoose.model('InventoryItem', InventoryItemSchema);

// checks whether inventory item input object has all of its attributes properly
// instantiated
function validateInventoryItem(item) {
    const schema = Joi.object({
        name: Joi.string().trim().required(),
        description: Joi.string().trim().required(),
        price: Joi.number().min(0).required(),
        imageURL: Joi.string().trim().uri().required(),
        category: Joi.string().trim().uppercase().required(),
    });

    return schema.validate(item);
}

module.exports = {
    InventoryItem,
    validate: validateInventoryItem,
};
