const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const {InventoryItem} = require('../Models/InventoryItem');
const Category = require('../Models/Category');
const fs = require('fs');
const path = require('path');

describe('Inventory Items API', () => {

    beforeAll(async () => {
        // Connect to the test database before running the tests
        await mongoose.connect(process.env.MONGODB_TEST_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Clear the "InventoryItem" and "Category" collections before each test
        await InventoryItem.deleteMany({});
        await Category.deleteMany({});
    });

    afterAll(async () => {
        // Clear the "InventoryItem" and "Category" collections before each test
        await InventoryItem.deleteMany({});
        await Category.deleteMany({});

        // Close the database connection after all tests are done
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // initialize the Category and InventoryItem collections
        // with data
        await populateCategories();
        await populateInventoryItems();
    });

    afterEach(async () => {
        // Clear the "InventoryItem" and "Category" collections before each test
        await InventoryItem.deleteMany({});
        await Category.deleteMany({});
    });

    // populate the Category collection in test database for testing
    const populateCategories = async () => {
        // Resolve the absolute path to the JSON file based on the current working directory
        const filePath = path.resolve(__dirname, '../StarterData/inventoryManager.categories.json');

        // Read the contents of the JSON file.
        const data = fs.readFileSync(filePath, 'utf8');

        // Parse the JSON data into an array of category objects.
        let categoriesArray = JSON.parse(data);

        // Assign the value of category._id.$oid to the _id field.
        // Otherwise, Category.insertMany() will throw an error saying it cannot convert
        // category._id.$oid to ObjectID
        categoriesArray = categoriesArray.map((category) => {
            return {...category, _id: category._id.$oid};
        });

        // Insert categoriesArray into the Category collection in MongoDB
        await Category.insertMany(categoriesArray);
    }

    // populate the InventoryItem collection in test database for testing
    const populateInventoryItems = async () => {
        // Resolve the absolute path to the JSON file based on the current working directory
        const filePath = path.resolve(__dirname, '../StarterData/inventoryManager.inventoryitems.json');

        // Read the contents of the JSON file.
        const data = fs.readFileSync(filePath, 'utf8');

        // Parse the JSON data into an array of inventory item objects.
        let inventoryItemArray = JSON.parse(data);

        // Assign the value of item._id.$oid to the _id field.
        // Otherwise, InventoryItem.insertMany() will throw an error saying it cannot convert
        // item._id.$oid to ObjectID.
        // For the same reason as above, assign the value of item.category.$oid to the
        // category field.
        inventoryItemArray = inventoryItemArray.map((item) => {
            return {...item, _id: item._id.$oid, category: item.category.$oid};
        });

        // Insert inventoryItemArray into the InventoryItem collection in MongoDB
        await InventoryItem.insertMany(inventoryItemArray);
    }

    describe('GET /', function () {
        it('should return all Inventory Items when' +
            ' categoryID is not provided', async () => {

            // Send a GET request without passing in categoryID to fetch
            // Inventory Items
            const response = await request(app).get('/api/inventoryItems/fetchAllItems/');

            // Assertions
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(15);

            // extract list of item names from GET request output
            const listOfItemNames = response.body.map((item) => {
                return item.name;
            })

            const expectedListOfItemNames = [
                "african rhinocero",
                "ancient chinese pants",
                "bottled water",
                "cotton gown from 19th century",
                "dress from 19th century",
                "green spinach",
                "hippo",
                "iced tea",
                "ipad",
                "orange",
                "pacific bluefine tuna",
                "red tomato",
                "romaine lettuce",
                "sockeye salmon",
                "watermelon"
            ];

            // Check whether GET request has successfully retrieved all the
            // inventory items from the database
            expect(listOfItemNames).toEqual(expect.arrayContaining(expectedListOfItemNames));
        });

        it('should return only Inventory Items that belong to the ' +
            '"CLOTHING" Category', async () => {

            // find clothing category to get its _id
            const clothing = await Category.findOne({category: "CLOTHING"});

            // Send a GET request with clothing._id to fetch
            // only Inventory Items belonging to CLOTHING category
            const response = await request(app).get('/api/inventoryItems/fetchAllItems/' + clothing._id);

            // Assertions
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);

            // extract list of item names from GET request output
            const listOfItemNames = response.body.map((item) => {
                return item.name;
            })

            const expectedListOfItemNames = [
                "ancient chinese pants",
                "cotton gown from 19th century",
                "dress from 19th century"
            ];

            // Check whether GET request has successfully retrieved all expected
            // inventory items from the database
            expect(listOfItemNames).toEqual(expect.arrayContaining(expectedListOfItemNames));
        });

        it('should return a 500 error when the provided categoryID' +
            'does not follow ObjectID format', async () => {

            const response = await request(app).get('/api/inventoryItems/fetchAllItems/1');

            // Assertions
            expect(response.status).toBe(500);
            expect(response.text).toBe("An error occurred while fetching inventory items: Cast to ObjectId " +
                "failed for value \"1\" (type string) at path \"category\" for model \"InventoryItem\"");
        });
    });

    describe('GET /:itemID', function () {

        it('should return a 404 error if inventory item associated' +
            'with itemID does not exist', async () => {

            const nonExistentItemID = new mongoose.Types.ObjectId().toString();


            const response = await request(app).get('/api/inventoryItems/' + nonExistentItemID);

            // Assertions
            expect(response.status).toBe(404);
            expect(response.text).toBe("The item with the given ID was not found.");
        });

        it('should return a 500 error when the provided categoryID' +
            'does not follow ObjectID format', async () => {

            const response = await request(app).get('/api/inventoryItems/1');

            // Assertions
            expect(response.status).toBe(500);
            expect(response.text).toBe("An error occurred while fetching the inventory item: Cast to ObjectId " +
                "failed for value \"1\" (type string) at path \"_id\" for model \"InventoryItem\"");
        });

        it('should successfully retrieve the iPad inventory item' +
            'that is stored in test database', async () => {

            // find ipad inventory item to get its _id
            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const response = await request(app).get('/api/inventoryItems/' + iPadItem._id);

            // Assertions
            expect(response.status).toBe(200);

            // Check that we retrieved the correct inventory item object
            // and that the data is not corrupted
            expect(response.body).toHaveProperty('_id', iPadItem._id.toString());
            expect(response.body).toHaveProperty('name', iPadItem.name);
            expect(response.body).toHaveProperty('price', iPadItem.price);
            expect(response.body).toHaveProperty('description', iPadItem.description);
            expect(response.body).toHaveProperty('imageURL', iPadItem.imageURL);
            expect(response.body).toHaveProperty('category._id',
                iPadItem.category._id.toString());
        });
    });

    describe('POST /', function () {

        it('should return a 400 error as the item being' +
            'added is missing the name field', async () => {

            const item = {
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"name\" is required");
        });

        it('should return a 400 error as the item being' +
            'added is missing the description field', async () => {

            const item = {
                name: "iPad",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"description\" is required");
        });

        it('should return a 400 error as the item being' +
            'added is missing the price field', async () => {

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"price\" is required");
        });

        it('should return a 400 error as the item being' +
            'added is missing the imageURL field', async () => {

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: 1000,
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"imageURL\" is required");
        });

        it('should return a 400 error as the item being' +
            'added is missing the category field', async () => {

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"category\" is required");
        });

        it('should return a 400 error as the item being' +
            'added has empty string for name', async () => {

            const item = {
                name: "",
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"name\" is not allowed to be empty");
        });

        it('should return a 400 error as the item being' +
            'added has empty string for description', async () => {

            const item = {
                name: "iPad",
                description: "",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"description\" is not allowed to be empty");
        });

        it('should return a 400 error as the item being' +
            'added has non-numeric value for price', async () => {

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: "",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"price\" must be a number");
        });

        it('should return a 400 error as the item being' +
            'added has negative number for price', async () => {

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: -1,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"price\" must be greater than or equal to 0");
        });

        it('should return a 400 error as the item being' +
            'added has empty string for imageURl', async () => {

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"imageURL\" is not allowed to be empty");
        });

        it('should return a 400 error as the item being' +
            'added has non-URL format string for imageURl', async () => {

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"imageURL\" must be a valid uri");
        });

        it('should return a 400 error as the item being' +
            'added has empty string for category', async () => {

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"category\" is not allowed to be empty");
        });

        it('should successfully add the item even though the item' +
            'contains a lowercase category string', async () => {

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "electronics",
            };

            const electronics = await Category.findOne({category: "ELECTRONICS"});

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(200);
            expect(response.body.category).toEqual(electronics._id.toString());
        });

        it('should successfully add the item when it contains a new' +
            'Category type. New Category is also created', async () => {

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "tablet computer",
            };

            const response = await request(app)
                .post('/api/inventoryItems/')
                .send(item);

            // Assertions
            expect(response.status).toBe(200);

            const tabletComputer = await Category.findOne({category: "TABLET COMPUTER"});

            // Check that tablet computer category was actually created
            // in database
            expect(tabletComputer).not.toBeNull();

            expect(response.body.category).toEqual(tabletComputer._id.toString());
        });
    });

    describe('PUT /:itemID', function () {

        it('should return a 400 error as the item being' +
            'edited is missing the name field', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"name\" is required");
        });

        it('should return a 400 error as the item being' +
            'added is missing the description field', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "iPad",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"description\" is required");
        });

        it('should return a 400 error as the item being' +
            'added is missing the price field', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"price\" is required");
        });

        it('should return a 400 error as the item being' +
            'added is missing the imageURL field', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: 1000,
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"imageURL\" is required");
        });

        it('should return a 400 error as the item being' +
            'added is missing the category field', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"category\" is required");
        });

        it('should return a 400 error as the item being' +
            'added has empty string for name', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "",
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"name\" is not allowed to be empty");
        });

        it('should return a 400 error as the item being' +
            'added has empty string for description', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "iPad",
                description: "",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"description\" is not allowed to be empty");
        });

        it('should return a 400 error as the item being' +
            'added has non-numeric value for price', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: "",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"price\" must be a number");
        });

        it('should return a 400 error as the item being' +
            'added has negative number for price', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: -1,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"price\" must be greater than or equal to 0");
        });

        it('should return a 400 error as the item being' +
            'added has empty string for imageURl', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"imageURL\" is not allowed to be empty");
        });

        it('should return a 400 error as the item being' +
            'added has non-URL format string for imageURl', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "ELECTRONICS",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"imageURL\" must be a valid uri");
        });

        it('should return a 400 error as the item being' +
            'added has empty string for category', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "iPad",
                description: "tablet computer device by Apple",
                price: 1000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(400);
            expect(response.text).toBe("\"category\" is not allowed to be empty");
        });

        it('should successfully edit the item even though the input' +
            'contains a lowercase category string', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "iPad Pro",
                description: "tablet computer device by Apple Inc",
                price: 2000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "electronics",
            };

            const electronics = await Category.findOne({category: "ELECTRONICS"});

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(200);
            expect(response.body.name).toBe("ipad pro");
            expect(response.body.description).toBe("tablet computer device by Apple Inc");
            expect(response.body.price).toBe(2000);
            expect(response.body.category).toEqual(electronics._id.toString());
        });

        it('should successfully edit the item when it contains a new' +
            'Category type. New Category is also created', async () => {

            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            const item = {
                name: "iPad Pro",
                description: "tablet computer device by Apple Inc",
                price: 2000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "tablet computer",
            };

            const response = await request(app)
                .put('/api/inventoryItems/' + iPadItem._id)
                .send(item);

            // Assertions
            expect(response.status).toBe(200);
            expect(response.body.name).toBe("ipad pro");
            expect(response.body.description).toBe("tablet computer device by Apple Inc");
            expect(response.body.price).toBe(2000);

            const tabletComputer = await Category.findOne({category: "TABLET COMPUTER"});

            // Check that tablet computer category was actually created
            // in database
            expect(tabletComputer).not.toBeNull();

            expect(response.body.category).toEqual(tabletComputer._id.toString());
        });

        it('should return a 500 error when itemID is not' +
            ' of ObjectID format', async () => {

            const item = {
                name: "iPad Pro",
                description: "tablet computer device by Apple Inc",
                price: 2000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "tablet computer",
            };

            const response = await request(app)
                .put('/api/inventoryItems/1')
                .send(item);

            // Assertions
            expect(response.status).toBe(500);
            expect(response.text).toBe("An error occurred while updating the inventory item: " +
                "Cast to ObjectId failed for value \"1\" (type string) at path \"_id\" for " +
                "model \"InventoryItem\"");
        });

        it('should reutrn a 404 error when item associated with itemID' +
            'does not exist', async () => {

            const item = {
                name: "iPad Pro",
                description: "tablet computer device by Apple Inc",
                price: 2000,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
                category: "tablet computer",
            };

            const nonExistentItemID = new mongoose.Types.ObjectId().toString();

            const response = await request(app)
                .put('/api/inventoryItems/' + nonExistentItemID)
                .send(item);

            // Assertions
            expect(response.status).toBe(404);
            expect(response.text).toBe("The item with the given ID was not found.");
        });
    });

    describe('DELETE /:itemID', function () {

        it('should return 404 error if Inventory Item associated' +
            'with itemID does not exist', async () => {

            const nonExistentItemID = new mongoose.Types.ObjectId().toString();

            // Send a DELETE request to delete the item
            const response = await request(app).delete('/api/inventoryItems/' + nonExistentItemID);

            // Assertions
            expect(response.status).toBe(404);
            expect(response.text).toBe("The item with the given ID was not found.");
        });

        it('should return a 500 error when itemID is not' +
            ' of ObjectID format', async () => {

            // Send a DELETE request to delete the item
            const response = await request(app).delete('/api/inventoryItems/1');

            // Assertions
            expect(response.status).toBe(500);
            expect(response.text).toBe("An error occurred while deleting the inventory item: " +
                "Cast to ObjectId failed for value \"1\" (type string) at path \"_id\" for " +
                "model \"InventoryItem\"");
        });

        it('should delete an Inventory Item', async () => {

            // Obtain the item we want to delete here so that we have
            // its _id
            const iPadItem = await InventoryItem
                .findOne({name: "ipad"})
                .populate('category');

            // Send a DELETE request to delete the category
            const response = await request(app).delete('/api/inventoryItems/' + iPadItem._id);

            // Assertions
            expect(response.status).toBe(200);

            // Check whether the DELETE request returned with the
            // deleted Inventory Item object. When comparing response.body._id with
            // iPadItem._id, we need iPadItem._id.toString(). The reason is that
            // body._id is the string representation of the ObjectID, whereas
            // iPadItem._id is the actual ObjectID object.
            expect(response.body).toHaveProperty('_id', iPadItem._id.toString());
            expect(response.body.name).toBe("ipad");
            expect(response.body.description).toBe("tablet computer device by Apple");
            expect(response.body.price).toBe(1000);

            const electronics = await Category.findOne({category: "ELECTRONICS"});
            expect(response.body.category).toEqual(electronics._id.toString());

            const iPadItemFromDB = await Category.findById(iPadItem._id);

            // check to see whether the deletion actually removed the
            // inventory item from the database
            expect(iPadItemFromDB).toBeNull();
        });
    });

    // Add more test cases for other routes in "Server/routes/InventoryItems.js"
});
