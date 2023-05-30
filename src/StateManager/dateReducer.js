import { UPDATE_DATE } from './dateActions';

// This file provides the reducer function that handles the
// UPDATE_DATE action type and updates the date state in the
// Redux store accordingly.

// The initialState constant is set to an empty string, representing the
// initial value of the date in the Redux store.
const initialState = '';

// It takes two parameters: state (representing the current state) and
// action (representing the dispatched action).
const dateReducer = (state = initialState, action) => {
    switch (action.type) {
        // When the action type is UPDATE_DATE, the reducer returns the
        // payload property of the action, which represents the new date value.
        case UPDATE_DATE:
            return action.payload;
        default:
            return state;
    }
};

export default dateReducer;
