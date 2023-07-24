const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const {InventoryItem} = require('../../Models/InventoryItem');
const Category = require('../../Models/Category');
const {populateCategories, populateInventoryItems} = require('../testHelpers');

describe('Inventory Items (POST /) API', () => {

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
});