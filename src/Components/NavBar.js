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
    // inventoryReducer store. The inventorySize variable holds the length
    // of the inventory array.
    const inventorySize = useSelector(state => state.inventory.length);

    // 1) The <Link> component is used to create a link to the
    // About page with the text "About" and the class name "aboutButton".
    // 2) The <DateComponent> component is rendered, which displays the current date.
    // 3) A <div> element with the class name "inventory-counter" displays the
    // inventory size.
    // 4) Clicking the <MailtoButton> component opens the user's default email client
    // with a new email to the "mailto" address.
    return (
        <nav className="navbar">
            <Link to="/about" className="aboutButton">About</Link>
            <DateComponent />
            <div className="inventory-counter">Inventory size: {inventorySize}</div>
            <MailtoButton label="Contact Me" mailto="mailto:peter62009@gmail.com" />
        </nav>
    );
};

export default Navbar;









