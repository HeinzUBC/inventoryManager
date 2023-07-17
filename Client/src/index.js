import React from 'react';
import ReactDOM from "react-dom/client";
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './StateManager/rootReducer';
import App from './Components/App';
import "./index.css";
import "./normalize.css";
import "./Components/App.css";
import {ThemeProvider} from "@material-tailwind/react";

// The entry point of the React application. Overall, the code sets up the Redux store,
// renders the root component, and provides the necessary providers to enable Redux and
// the Material Tailwind theme in the application.

// This sets up the Redux store with the combined reducer.
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
