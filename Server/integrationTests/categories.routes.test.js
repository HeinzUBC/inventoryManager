const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Category = require('../Models/Category');
const {InventoryItem} = require('../Models/InventoryItem');
const {populateCategories} = require("./testHelpers");

describe('Categories API', () => {
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
        // initialize the Category collection with data
        await populateCategories();
    });

    afterEach(async () => {
        // Clear the "InventoryItem" and "Category" collections before each test
        await InventoryItem.deleteMany({});
        await Category.deleteMany({});
    });

    describe('GET /', function () {
        it('should return all Categories', async () => {

            // Send a GET request to fetch all categories
            const response = await request(app).get('/api/categories');

            // extract list of item names from GET request output
            const listOfCategories = response.body.map((category) => {
                return category.category;
            })

            const expectedListOfCategories = [
                "CLOTHING",
                "ELECTRONICS",
                "VEGETABLE",
                "BEVERAGE",
                "FISH",
                "FRUIT",
                "ANIMAL"
            ];

            // Assertions
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(7);

            // Check whether GET request has successfully retrieved all the
            // inventory items from the database
            expect(listOfCategories).toEqual(expect.arrayContaining(expectedListOfCategories));
        });
    });

    describe('DELETE /:categoryID', function () {

        it('should return 404 error if Category associated' +
            'with categoryID does not exist', async () => {

            const nonExistentCategoryID = new mongoose.Types.ObjectId().toString();

            // Send a DELETE request to delete the category
            const response = await request(app).delete('/api/categories/' + nonExistentCategoryID);

            // Assertions
            expect(response.status).toBe(404);
            expect(response.text).toBe("The category with the given ID was not found.");
        });

        it('should return 403 error if current Category is being' +
            'used by Inventory Items', async () => {
            let category = new Category({
                category: "PLANT"
            });

            // save category to database. Next, assign it to category variable.
            // That way, we have access to the _id of new category object
            category = await category.save();

            const newItem = new InventoryItem({
                name: "red tomato",
                description: "A sweet and sour healthy fruit native to north america.",
                price: 2.67,
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
                category: category._id,
            });

            await newItem.save();

            // Send a DELETE request to delete the category
            const response = await request(app).delete('/api/categories/' + category._id);

            // Assertions
            expect(response.status).toBe(403);
            expect(response.text).toBe('The category is still used by other Inventory Items. ' +
                'So, the category cannot be deleted');
        });

        it('should delete a Category that is not used by' +
            'any Inventory Items', async () => {
            let category = new Category({
                category: "PLANT"
            });

            // save category to database. Next, assign it to category variable.
            // That way, we have access to the _id of new category object
            category = await category.save();

            // Send a DELETE request to delete the category
            const response = await request(app).delete('/api/categories/' + category._id);

            // Assertions
            expect(response.status).toBe(200);

            // Check whether the DELETE request returned with the
            // deleted Category object. When comparing response.body._id with
            // category._id, we need category._id.toString(). The reason is that
            // body._id is the string representation of the ObjectID, whereas
            // category._id is the actual ObjectID object.
            expect(response.body).toHaveProperty('_id', category._id.toString());
            expect(response.body).toHaveProperty('category', category.category);

            const categoryFromDB = await Category.findById(category._id);

            // check to see whether the deletion actually removed the
            // category from the database
            expect(categoryFromDB).toBeNull();
        });

        it('should return a 500 error when categoryID is not' +
            ' of ObjectID format', async () => {

            // Send a DELETE request to delete the category
            const response = await request(app).delete('/api/categories/1');

            // Assertions
            expect(response.status).toBe(500);
            expect(response.text).toBe("An error occurred while deleting the category: " +
                "Cast to ObjectId failed for value \"1\" (type string) at path \"category\" " +
                "for model \"InventoryItem\"");
        });
    });
});
