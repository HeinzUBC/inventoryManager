import Navbar from "./NavBar";
import ScrollToTopButton from "./ScrollToTopButton";
import React from "react";
import InventoryInterface from "./InventoryInterface";

//  The HomePage component sets up the structure and functionality of the
//  home page in the inventory management system, including adding items,
//  displaying the inventory list, and providing a button to delete all items.
const HomePage = () => {
    return (
        <div className="homePageBlock">
            <Navbar />
            <h1>Inventory Management System</h1>
            <InventoryInterface />
            <div className="homePageBottomButtons">
                <ScrollToTopButton/>
            </div>
        </div>
    );
};

export default HomePage;

