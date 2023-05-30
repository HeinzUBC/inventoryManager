import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './StateManager/rootReducer';
import App from './Components/App';
import "./index.css";
import "./normalize.css";
import "./Components/App.css";

// This file sets up the Redux store and renders the root
// component of the application, making the store accessible to all
// components wrapped within the Provider component

// This sets up the store with the combined reducer.
const store = configureStore({
    reducer: rootReducer,
});

// called to render the app
ReactDOM.render(
    // The <Provider> component wraps the <App /> component, providing access to the
    // Redux store through the store prop.
    <Provider store={store}>
        <App />
    </Provider>,

    // The rendered output is inserted into the HTML element with the ID 'root'
    document.getElementById('root')
);
