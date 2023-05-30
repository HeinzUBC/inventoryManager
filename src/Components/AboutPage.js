import React from 'react';
import { Link } from 'react-router-dom';
import ScrollToTopButton from "./ScrollToTopButton";
import DateComponent from "./DateComponent";
import MailtoButton from "./MailtoButton";

// This component provides the content for the "About" webpage,
// including information about the inventory management system and
// the author. It includes a navigation link to go back to the
// main application. There is also a "contact me" link that allows
// user to reach me by email
const About = () => {
    return (
        <div className="AboutBlock">
            <nav className="navbar">
                <Link to="/" className="backToAppButton">Back to App</Link>
                <DateComponent/>
                <MailtoButton label="Contact Me" mailto="mailto:peter62009@gmail.com" />
            </nav>
            <section className="about-website">
                <h1>About Inventory Management System</h1>
                <p className="about-website-detail">
                    This is a simple implementation of an inventory management system.<br/>
                    You can perform the following operations here:
                </p>
                <p className="about-website-detail">
                    1. You can add new items to the inventory<br/>
                    2. You can remove individual items from the inventory<br/>
                    3. You can remove all items from the inventory at once<br/>
                    4. Each item must contain a description, price, image URL, and a UNIQUE name<br/>
                    5. Each item card displays the image and name by default. To access<br/>
                       additional details about the item, click the "More Info" button
                </p>
                <p className="about-website-detail">
                    The item input form is designed to handle erroneous input.<br/>
                    <br/>
                    The unique identifier for each item in the inventory is its name.<br/>
                    So, if the user inputs a duplicated name for a new item entry, this new<br/>
                    item will not be created. If the user inputs values of the wrong data type,<br/>
                    the item will not be created. If the user misses some or all of the input<br/>
                    fields in the input form, the item will also not be created.
                </p>
            </section>
            <section className="about-author">
                <h1>About the Author</h1>
                <p className="about-author-detail">
                    Peter is a 4th-year student in the combined CS/Statistics program<br/>
                    at the University of British Columbia. Peter has completed 16 months of co-op<br/>
                    experience at Transoft Solutions (a civil engineering software company) and<br/>
                    Kardium (a remote-guided cardiac ablation catheter company).
                </p>
            </section>
            <ScrollToTopButton/>
        </div>
    );
};

export default About;


