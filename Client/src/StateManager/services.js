import axios from 'axios';

// Service functions that make HTTP requests to the backend API endpoints using Axios.
// These functions provide an interface for interacting with the backend and performing
// CRUD operations on inventory items and categories.

const API_INVENTORY_ITEMS_URL = 'http://localhost:5000/api/inventoryItems';
const API_CATEGORIES_URL = "http://localhost:5000/api/categories";

const getCategoryList = async () => {
    try {
        const response = await axios.get(API_CATEGORIES_URL);
        return response.data;
    } catch (error) {
        throw handleRequestError(error);
    }
}

const deleteCategory = async (categoryID) => {
    try {
        const response = await axios.delete(`${API_CATEGORIES_URL}/${categoryID}`);
        return response.data;
    } catch (error) {
        throw handleRequestError(error);
    }
}

const getInventoryList = async (categoryID) => {
    try {
        const response = await axios.get(`${API_INVENTORY_ITEMS_URL}/fetchAllItems/${categoryID}`);
        return response.data;
    } catch (error) {
        throw handleRequestError(error);
    }
};

const getInventoryItem = async (itemID) => {
    try {
        const response = await axios.get(`${API_INVENTORY_ITEMS_URL}/${itemID}`);
        return response.data;
    } catch (error) {
        throw handleRequestError(error);
    }
};

const addInventoryItem = async (item) => {
    try {
        const response = await axios.post(API_INVENTORY_ITEMS_URL, item);
        return response.data;
    } catch (error) {
        throw handleRequestError(error);
    }
};

const editInventoryItem = async ( itemID, item ) => {
    try {
        const response = await axios.put(`${API_INVENTORY_ITEMS_URL}/${itemID}`, item);
        return response.data;
    } catch (error) {
        throw handleRequestError(error);
    }
};

const deleteInventoryItem = async (itemID) => {
    try {
        const response = await axios.delete(`${API_INVENTORY_ITEMS_URL}/${itemID}`);
        return response.data;
    } catch (error) {
        throw handleRequestError(error);
    }
};

const handleRequestError = (error) => {
    if (error.response) {
        const errorMsg = error.response.data;
        return new Error(errorMsg);
    } else if (error.request) {
        return new Error('No response received from the server.');
    } else {
        return new Error('An error occurred while making the request.');
    }
};

export default {
    getInventoryList,
    getInventoryItem,
    addInventoryItem,
    editInventoryItem,
    deleteInventoryItem,
    getCategoryList,
    deleteCategory,
};

