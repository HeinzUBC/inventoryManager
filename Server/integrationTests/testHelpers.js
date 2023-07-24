const {InventoryItem} = require('../Models/InventoryItem');
const Category = require('../Models/Category');
const fs = require('fs');
const path = require('path');

// populate the Category collection in test database for testing
const populateCategories = async () => {
    let categoriesArray = loadInStartedCategoryJSONData();

    // Insert categoriesArray into the Category collection in MongoDB
    await Category.insertMany(categoriesArray);
}

// populate the InventoryItem collection in test database for testing
const populateInventoryItems = async () => {
    let inventoryItemArray = loadInStarterInventoryItemJSONData();

    // Insert inventoryItemArray into the InventoryItem collection in MongoDB
    await InventoryItem.insertMany(inventoryItemArray);
}

// loads in the starter Category JSON Data from file system so that they
// are available to populate the test Category MongoDB collection
function loadInStartedCategoryJSONData() {
    // Resolve the absolute path to the JSON file based on the current working directory
    const filePath = path.resolve(__dirname, '../StarterData/inventoryManager.categories.json');

    // Read the contents of the JSON file.
    const data = fs.readFileSync(filePath, 'utf8');

    // Parse the JSON data into an array of category objects.
    let categoriesArray = JSON.parse(data);

    // Assign the value of category._id.$oid to the _id field.
    // Otherwise, Category.insertMany() will throw an error saying it cannot convert
    // category._id.$oid to ObjectID
    return categoriesArray.map((category) => {
        return {...category, _id: category._id.$oid};
    });
}

// loads in the starter Inventory Item JSON Data from file system so that they
// are available to populate the test Inventory Item MongoDB collection
function loadInStarterInventoryItemJSONData() {
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
    return inventoryItemArray.map((item) => {
        return {...item, _id: item._id.$oid, category: item.category.$oid};
    });
}

module.exports = {
    populateCategories,
    populateInventoryItems,
};

