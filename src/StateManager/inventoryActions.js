// Defines the action creators for managing inventory items in
// your Redux store.

// Action Types
export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const CLEAR_ITEMS = 'CLEAR_ITEMS';

// Action Creators
export const addItem = (item) => {
    return {
        type: ADD_ITEM,
        // The payload property contains the item that needs to be added
        // to the inventory.
        payload: item,
    };
};

export const deleteItem = (itemName) => {
    return {
        type: DELETE_ITEM,
        // The payload property contains the itemName of the item to be
        // deleted from the inventory.
        payload: itemName,
    };
};

export const clearItems = () => {
    return {
        type: CLEAR_ITEMS,
    };
};
