const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const {InventoryItem} = require('../../Models/InventoryItem');
const Category = require('../../Models/Category');
const {populateCategories, populateInventoryItems} = require('../testHelpers');

describe('Inventory Items (GET /) && (GET /:itemID) API', () => {

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
});