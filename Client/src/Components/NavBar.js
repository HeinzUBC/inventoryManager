import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DateComponent from "./DateComponent";
import MailtoButton from "./MailtoButton";

// The Navbar component displays the navigation bar of the application,
// including links to "About" page, the current date, inventory size, and
// a contact button.
const Navbar = () => {
    // The useSelector hook is used to select the inventory state from the
    // inventoryReducer store.
    const { inventoryList } = useSelector(state => state.inventory);

    return (
        <nav className="navbar">
            <Link to="/about" className="aboutButton">About</Link>
            <DateComponent />
            <div className="inventory-counter">Inventory size: {inventoryList.length}</div>
            <MailtoButton label="Contact Me" mailto="mailto:peter62009@gmail.com" />
        </nav>
    );
};

export default Navbar;









