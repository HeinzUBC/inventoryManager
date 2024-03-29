import {createSlice} from "@reduxjs/toolkit";

// The dateString constant is set to an empty string, representing the
// initial value of the date in the Redux store.
const dateString = {date: ''};

const dateSlice = createSlice({
    name: "dateString",
    initialState: dateString,
    reducers: {
        // The updateDate reducer is responsible for updating the date string
        updateDate: (state, action) => {
            state.date = action.payload;
        },
    },
});

// Exports the action creators generated by the createSlice function as named exports.
// These action creators can be used to dispatch actions to modify the date string state.
export const {
    updateDate,
} = dateSlice.actions;

// The dateSlice.reducer is exported as the default export, representing the reducer
// function for this slice.
export default dateSlice.reducer;
