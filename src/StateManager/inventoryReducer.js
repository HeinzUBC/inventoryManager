import { ADD_ITEM, DELETE_ITEM, CLEAR_ITEMS } from './inventoryActions';

// This reducer handles the actions related to adding, deleting, and clearing
// items in the inventory. It uses immutable updates by returning new state arrays
// instead of modifying the existing state directly

// Array containing default inventory items. Each item object has properties
// name, description, price, and imageURL.
const initialState = [
    {
        name: 'sockeye salmon',
        description: 'a large omnivorous fish native to British Columbia',
        price: 25.25,
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Oncorhynchus_nerka.jpg',
    },
    {
        name: 'ipad',
        description: 'tablet computer device by Apple',
        price: 1000,
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png',
    },
    {
        name: 'white cotton socks',
        description: 'cotton clothing worn on the feet',
        price: 10,
        imageURL: 'https://as2.ftcdn.net/v2/jpg/02/86/46/23/' +
            '1000_F_286462331_SGRBwvdnzciSCSXhnem1FHGsgGkeZHos.jpg',
    },
    {
        name: 'orange',
        description: 'citrus fruit rich in vitamin C',
        price: 2.12,
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/' +
            'Mandarin_Oranges_%28Citrus_Reticulata%29.jpg/1920px-Mandarin_Oranges_%28Citrus_Reticulata%29.jpg',
    },
    {
        name: 'watermelon',
        description: 'large green fruit that is sweet and very watery',
        price: 15.69,
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Watermelon_cross_BNC.jpg/' +
            '1920px-Watermelon_cross_BNC.jpg',
    },
    {
        name: 'bottled water',
        description: 'portable source of water',
        price: 3,
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/' +
            'PET_Bottle_Water.jpg/1920px-PET_Bottle_Water.jpg',
    },
    // Add more initial items here if needed
];

// Function that takes in the inventory state and an action as parameters.
const inventoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ITEM:
            // Returns a new state array by spreading the existing state and appending
            // the payload (new item) using action.payload.
            return [...state, action.payload];
        case DELETE_ITEM:
            // reducer FILTERS OUT the item with name matching payload from the state array
            // and returns the filtered array.
            return state.filter((item) =>
                item.name !== action.payload);
        case CLEAR_ITEMS:
            //  the reducer returns an empty array, effectively clearing all items from the state.
            return [];
        default:
            return state;
    }
};

export default inventoryReducer;

