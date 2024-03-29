import {createSlice} from "@reduxjs/toolkit";
import {REQUEST_STATE} from "./requestState";
import thunk from "./thunk";

// The Redux reducer logic that manages the state updates based on the different request states and
// handles the responses from the async actions.

const INITIAL_STATE = {
    categoryList: [],
    inventoryList: [],
    currentItem: {},
    error: null,
    fetchInventoryList: false,
    fetchCategoryList: false,
    getInventoryList: REQUEST_STATE.IDLE,
    getInventoryItem: REQUEST_STATE.IDLE,
    addInventoryItem: REQUEST_STATE.IDLE,
    editInventoryItem: REQUEST_STATE.IDLE,
    deleteInventoryItem: REQUEST_STATE.IDLE,
    getCategoryList: REQUEST_STATE.IDLE,
    deleteCategory: REQUEST_STATE.IDLE,
};

const inventorySlice = createSlice({
    name: "inventory",
    initialState: INITIAL_STATE,
    reducers: {},

    // extraReducers is used to handle additional actions dispatched
    // by the async action creators defined in thunk.js.
    extraReducers: (builder) => {
        builder
            .addCase(thunk.getCategoryListAsync.pending, (state) => {
                state.getCategoryList = REQUEST_STATE.PENDING;
                state.error = null;
            })
            .addCase(thunk.getCategoryListAsync.fulfilled, (state, action) => {
                state.getCategoryList = REQUEST_STATE.FULFILLED;
                state.categoryList = action.payload;
            })
            .addCase(thunk.getCategoryListAsync.rejected, (state, action) => {
                state.getCategoryList = REQUEST_STATE.REJECTED;
                state.error = action.error.message;
            })
            .addCase(thunk.deleteCategoryAsync.pending, (state) => {
                state.deleteCategory = REQUEST_STATE.PENDING;
                state.error = null;
            })
            .addCase(thunk.deleteCategoryAsync.fulfilled, (state) => {
                state.deleteCategory = REQUEST_STATE.FULFILLED;
                state.fetchInventoryList = !state.fetchInventoryList;
                state.fetchCategoryList = !state.fetchCategoryList;
            })
            .addCase(thunk.deleteCategoryAsync.rejected, (state, action) => {
                state.deleteCategory = REQUEST_STATE.REJECTED;
                state.error = action.error.message;
            })
            .addCase(thunk.getInventoryListAsync.pending, (state) => {
                state.getInventoryList = REQUEST_STATE.PENDING;
                state.error = null;
            })
            .addCase(thunk.getInventoryListAsync.fulfilled, (state, action) => {
                state.getInventoryList = REQUEST_STATE.FULFILLED;
                state.inventoryList = action.payload;
            })
            .addCase(thunk.getInventoryListAsync.rejected, (state, action) => {
                state.getInventoryList = REQUEST_STATE.REJECTED;
                state.error = action.error.message;
            })
            .addCase(thunk.getInventoryItemAsync.pending, (state) => {
                state.getInventoryItem = REQUEST_STATE.PENDING;
                state.error = null;
                state.currentItem = {};
            })
            .addCase(thunk.getInventoryItemAsync.fulfilled, (state, action) => {
                state.getInventoryItem = REQUEST_STATE.FULFILLED;
                state.currentItem = action.payload;
            })
            .addCase(thunk.getInventoryItemAsync.rejected, (state, action) => {
                state.getInventoryItem = REQUEST_STATE.REJECTED;
                state.error = action.error.message;
            })
            .addCase(thunk.addInventoryItemAsync.pending, (state) => {
                state.addInventoryItem = REQUEST_STATE.PENDING;
                state.error = null;
            })
            .addCase(thunk.addInventoryItemAsync.fulfilled, (state) => {
                state.addInventoryItem = REQUEST_STATE.FULFILLED;
                state.fetchInventoryList = !state.fetchInventoryList;
                state.fetchCategoryList = !state.fetchCategoryList;
            })
            .addCase(thunk.addInventoryItemAsync.rejected, (state, action) => {
                state.addInventoryItem = REQUEST_STATE.REJECTED;
                state.error = action.error.message;
            })
            .addCase(thunk.editInventoryItemAsync.pending, (state) => {
                state.editInventoryItem = REQUEST_STATE.PENDING;
                state.error = null;
            })
            .addCase(thunk.editInventoryItemAsync.fulfilled, (state) => {
                state.editInventoryItem = REQUEST_STATE.FULFILLED;
                state.fetchInventoryList = !state.fetchInventoryList;
                state.fetchCategoryList = !state.fetchCategoryList;
            })
            .addCase(thunk.editInventoryItemAsync.rejected, (state, action) => {
                state.editInventoryItem = REQUEST_STATE.REJECTED;
                state.error = action.error.message;
            })
            .addCase(thunk.deleteInventoryItemAsync.pending, (state) => {
                state.deleteInventoryItem = REQUEST_STATE.PENDING;
                state.error = null;
            })
            .addCase(thunk.deleteInventoryItemAsync.fulfilled, (state) => {
                state.deleteInventoryItem = REQUEST_STATE.FULFILLED;
                state.fetchInventoryList = !state.fetchInventoryList;
            })
            .addCase(thunk.deleteInventoryItemAsync.rejected, (state, action) => {
                state.deleteInventoryItem = REQUEST_STATE.REJECTED;
                state.error = action.error.message;
            });
    },
});

export default inventorySlice.reducer;

