const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const {InventoryItem} = require('../../Models/InventoryItem');
const Category = require('../../Models/Category');
const {populateCategories, populateInventoryItems} = require('../testHelpers');

describe('Inventory Items (DELETE /:itemID) API', () => {

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
});