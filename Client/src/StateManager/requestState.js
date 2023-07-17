// Defines different states for handling asynchronous requests in the
// frontend application. These request states can be used in the inventoryReducer Redux
// state to track the status of asynchronous operations.
export const REQUEST_STATE = {
    IDLE: 'IDLE',
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED'
};