import React from 'react';
import About from './AboutPage';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./HomePage";

// This file sets up the application to render different components
// based on the URL path using the React Router library. The HomePage
// component will be rendered for the root path, and the About component
// will be rendered for the "/about" path.
const App = () => {
    // Uses the <Router> component from React Router to provide routing functionality.
    // The <Routes> component is used to define the routes of the application.
    // Route Configuration:
    //     There are two routes defined:
    //         1) The root path ("/") is associated with the HomePage component.
    //         2) The "/about" path is associated with the About component.
    return (
        <Router>
            <>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </>
        </Router>
    );
};

export default App;
