import {createAsyncThunk} from '@reduxjs/toolkit';
import {actionTypes} from './actionTypes';
import services from "./services";

// These async action creators handle the asynchronous logic and dispatch
// actions to the inventoryReducer Redux store to interact with the backend API.

const getCategoryListAsync = createAsyncThunk(
    actionTypes.GET_CATEGORY_LIST,
    async () => {
        try {
            return await services.getCategoryList();
        } catch (error) {
            throw new Error(error.message);
        }
    }
);

const deleteCategoryAsync = createAsyncThunk(
    actionTypes.DEL_CATEGORY,
    async (categoryID) => {
        try {
            return await services.deleteCategory(categoryID);
        } catch (error) {
            throw new Error(error.message);
        }
    }
);

const getInventoryListAsync = createAsyncThunk(
    actionTypes.GET_INVENTORY_LIST,
    async (categoryID ) => {
        try {
            return await services.getInventoryList(categoryID);
        } catch (error) {
            throw new Error(error.message);
        }
    }
);

const getInventoryItemAsync = createAsyncThunk(
    actionTypes.GET_INVENTORY_ITEM,
    async (itemID) => {
        try {
            return await services.getInventoryItem(itemID);
        } catch (error) {
            throw new Error(error.message);
        }
    }
);

const addInventoryItemAsync = createAsyncThunk(
    actionTypes.ADD_INVENTORY_ITEM,
    async (item) => {
        try {
            return await services.addInventoryItem(item);
        } catch (error) {
            throw new Error(error.message);
        }
    }
);

const editInventoryItemAsync = createAsyncThunk(
    actionTypes.EDIT_INVENTORY_ITEM,
    async ({ itemID, item }) => {
        try {
            return await services.editInventoryItem( itemID, item ); // Set the response as the payload of the fulfilled action
        } catch (error) {
            throw new Error(error.message);
        }
    }
);


const deleteInventoryItemAsync = createAsyncThunk(
    actionTypes.DEL_INVENTORY_ITEM,
    async (itemID) => {
        try {
            return await services.deleteInventoryItem(itemID);
        } catch (error) {
            throw new Error(error.message);
        }
    }
);

export default {
    getInventoryListAsync,
    getInventoryItemAsync,
    addInventoryItemAsync,
    editInventoryItemAsync,
    deleteInventoryItemAsync,
    getCategoryListAsync,
    deleteCategoryAsync,
};







