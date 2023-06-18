const express = require('express');
const Joi = require('joi');
const {v4: uuid} = require('uuid');
const router = express.Router();

// Array containing default inventory items. Each item object has properties
// name, description, price, and imageURL.
const inventoryList = [
    {
        id: uuid(),
        name: 'sockeye salmon',
        description: 'a large omnivorous fish native to British Columbia',
        price: 25.25,
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Oncorhynchus_nerka.jpg',
    },
    {
        id: uuid(),
        name: 'ipad',
        description: 'tablet computer device by Apple',
        price: 1000,
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png',
    },
    {
        id: uuid(),
        name: 'white cotton socks',
        description: 'cotton clothing worn on the feet',
        price: 10,
        imageURL: 'https://as2.ftcdn.net/v2/jpg/02/86/46/23/' +
            '1000_F_286462331_SGRBwvdnzciSCSXhnem1FHGsgGkeZHos.jpg',
    },
    {
        id: uuid(),
        name: 'orange',
        description: 'citrus fruit rich in vitamin C',
        price: 2.12,
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/' +
            'Mandarin_Oranges_%28Citrus_Reticulata%29.jpg/1920px-Mandarin_Oranges_%28Citrus_Reticulata%29.jpg',
    },
    {
        id: uuid(),
        name: 'watermelon',
        description: 'large green fruit that is sweet and very watery',
        price: 15.69,
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Watermelon_cross_BNC.jpg/' +
            '1920px-Watermelon_cross_BNC.jpg',
    },
    {
        id: uuid(),
        name: 'bottled water',
        description: 'portable source of water',
        price: 3,
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/' +
            'PET_Bottle_Water.jpg/1920px-PET_Bottle_Water.jpg',
    },
    // Add more initial items here if needed
]

// checks whether inventory item input object has all of its attributes properly
// instantiated
function validateInventoryItem(item) {
    const schema = Joi.object({
        name: Joi.string().trim().required(),
        description: Joi.string().trim().required(),
        price: Joi.number().min(0).required(),
        imageURL: Joi.string().trim().uri().required()
    });

    return schema.validate(item);
}

// GET request handler to obtain the list of inventory items.
router.get('/',  (req, res) => {

    // obtain list of inventory item. Each inventory item only contains a
    // subset of all attributes.
    const outputList = inventoryList.map((item) => {
        return {
            id: item.id,
            name: item.name,
            imageURL: item.imageURL,
        };
    });

    // sort output list by name attribute.
    outputList.sort((itemA, itemB) => {
        return itemA.name.toLowerCase().localeCompare(itemB.name.toLowerCase())
    });

    res.send(outputList);
});

// GET request handler to obtain specific inventory item with itemID.
// This fetches the inventory item with all its attributes
router.get('/:itemID',  (req, res) => {
    const item = inventoryList.find(item => {
        return item.id === req.params.itemID;
    });
    if (!item) {
        return res.status(404).send('The item with the given ID was not found.');
    }
    res.send(item);
});

// POST request handler to add a new inventory item object to inventoryList
router.post('/', (req, res) => {
    const { error } = validateInventoryItem(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const newItem = {
        id: uuid(),
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        imageURL: req.body.imageURL
    };

    inventoryList.push(newItem);
    res.send(newItem);
});

// PUT request handler to modify the attributes of inventory item with itemID
router.put('/:itemID', (req, res) => {
    const item = inventoryList.find(item => {
        return item.id === req.params.itemID;
    });

    if (!item) {
        return res.status(404).send('The item with the given ID was not found.');
    }

    const { error } = validateInventoryItem(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    item.name = req.body.name;
    item.description = req.body.description;
    item.price = parseFloat(req.body.price);
    item.imageURL = req.body.imageURL;

    res.send(item);
});

// DELETE request handler to delete the inventory item with itemID
router.delete('/:itemID', (req, res) => {
    const item = inventoryList.find(item => {
        return item.id === req.params.itemID;
    });
    if (!item) return res.status(404).send('The item with the given ID was not found.');

    const itemIndex = inventoryList.indexOf(item);
    inventoryList.splice(itemIndex, 1);
    res.send(item);
})

module.exports = router;


