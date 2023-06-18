import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/inventoryList';

const getInventoryList = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        throw handleRequestError(error);
    }
};

const getInventoryItem = async (itemID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${itemID}`);
        return response.data;
    } catch (error) {
        throw handleRequestError(error);
    }
};

const addInventoryItem = async (item) => {
    try {
        const response = await axios.post(API_BASE_URL, item);
        return response.data;
    } catch (error) {
        throw handleRequestError(error);
    }
};

const editInventoryItem = async ( itemID, item ) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${itemID}`, item);
        return response.data;
    } catch (error) {
        throw handleRequestError(error);
    }
};

const deleteInventoryItem = async (itemID) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${itemID}`);
        return response.data;
    } catch (error) {
        throw handleRequestError(error);
    }
};

const handleRequestError = (error) => {
    if (error.response) {
        const errorMsg = error.response.data.message;
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
};

