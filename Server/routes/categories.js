const express = require('express');
const Category = require('../Models/Category');
const {InventoryItem} = require('../Models/InventoryItem');
const router = express.Router();

// defines the routes related to the Category collection in the Express backend.

router.get('/', async (req, res) => {
    try {
        const outputList = await Category.find().sort({category: 1});
        res.send(outputList);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('An error occurred while fetching categories: ' + error.message);
    }
});

router.delete('/:categoryID', async (req, res) => {
    try {
        const items = await InventoryItem.find({category: req.params.categoryID});

        // Do not delete the category if there are inventory items that belongs to it
        if (items.length) {
            return res.status(403).send('The category is still used by other Inventory Items. ' +
                'So, the category cannot be deleted');
        }

        const category = await Category.findByIdAndDelete(req.params.categoryID);

        if (!category) {
            return res.status(404).send('The category with the given ID was not found.');
        }

        res.send(category);
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).send('An error occurred while deleting the category: ' + error.message);
    }
});

module.exports = router;