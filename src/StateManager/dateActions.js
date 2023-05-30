// This file provides the necessary action type and action creator to
// update the date in the Redux store.

// This constant represents the action type for updating the date.
export const UPDATE_DATE = 'UPDATE_DATE';

// It takes newDate as a parameter, representing the new date value to be updated.
// Inside the function, an action object is created and returned.
export const updateDate = (newDate) => ({
    // The action object has a type property set to the UPDATE_DATE constant, indicating
    // the type of the action.
    type: UPDATE_DATE,
    // The payload property is set to the newDate parameter, representing
    // the data associated with the action.
    payload: newDate,
});
