const express = require('express');
const Category = require('../Models/Category');
const {InventoryItem} = require('../Models/InventoryItem');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const outputList = await Category.find().sort({ category: 1 });
        res.send(outputList);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('An error occurred while fetching categories: ' + error.message);
    }
});

router.delete('/:categoryID', async (req, res) => {
    try {
        const item = await Category.findByIdAndDelete(req.params.categoryID);

        if (!item) {
            return res.status(404).send('The category with the given ID was not found.');
        }

        await InventoryItem.deleteMany({ category: req.params.categoryID });

        res.send(item);
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).send('An error occurred while deleting the category: ' + error.message);
    }
});

module.exports = router;