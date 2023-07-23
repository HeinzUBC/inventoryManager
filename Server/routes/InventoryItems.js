const express = require('express');
const {InventoryItem, validate} = require('../Models/InventoryItem');
const Category = require('../Models/Category');
const router = express.Router();

// Defines the routes related to the inventory item collection in the Express backend.
router.get('/fetchAllItems/:categoryID?', async (req, res) => {
    try {
        const filter = {};
        if (req.params.categoryID) {
            filter.category = req.params.categoryID;
        }

        const outputList = await InventoryItem
            .find(filter)
            .sort({ name: 1 })
            .select({ _id: 1, name: 1, imageURL: 1 });

        res.send(outputList);
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        res.status(500).send('An error occurred while fetching inventory items: ' + error.message);
    }
});

router.get('/:itemID', async (req, res) => {
    try {
        const item = await InventoryItem
            .findById(req.params.itemID)
            .populate('category');

        if (!item) {
            return res.status(404).send('The item with the given ID was not found.');
        }

        res.send(item);
    } catch (error) {
        console.error('Error fetching inventory item:', error);
        res.status(500).send('An error occurred while fetching the inventory item: ' + error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        // value contains the validated req.body (inventoryItem) object
        const {error, value} = validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        let category = await Category.findOne({category: value.category});

        if (!category) {
            category = new Category({
                category: value.category,
            });
            category = await category.save();
        }

        const newItem = new InventoryItem({
            name: value.name,
            description: value.description,
            price: parseFloat(value.price),
            imageURL: value.imageURL,
            category: category._id,
        });

        await newItem.save();
        res.send(newItem);
    } catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(500).send('An error occurred while creating the inventory item: ' + error.message);
    }
});

router.put('/:itemID', async (req, res) => {
    try {
        // value contains the validated req.body (inventoryItem) object
        const {error, value} = validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        let category = await Category
            .findOne({category: value.category});

        if (!category) {
            category = new Category({
                category: value.category,
            });
            category = await category.save();
        }

        const item = await InventoryItem.findByIdAndUpdate(
            req.params.itemID,
            {
                name: value.name,
                description: value.description,
                price: parseFloat(value.price),
                imageURL: value.imageURL,
                category: category._id,
            },
            { new: true }
        );

        if (!item) {
            return res.status(404).send('The item with the given ID was not found.');
        }

        res.send(item);
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).send('An error occurred while updating the inventory item: ' + error.message);
    }
});

router.delete('/:itemID', async (req, res) => {
    try {
        const item = await InventoryItem.findByIdAndDelete(req.params.itemID);

        if (!item) {
            return res.status(404).send('The item with the given ID was not found.');
        }

        res.send(item);
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).send('An error occurred while deleting the inventory item: ' + error.message);
    }
});

module.exports = router;


