import React from 'react';
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './StateManager/rootReducer';
import App from './Components/App';
import "./index.css";
import "./normalize.css";
import "./Components/App.css";
import {ThemeProvider} from "@material-tailwind/react";

// This file sets up the Redux store and renders the root
// component of the application, making the store accessible to all
// components wrapped within the Provider component

// This sets up the store with the combined reducer.
const store = configureStore({
    reducer: rootReducer,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);
