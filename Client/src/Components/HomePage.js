import Navbar from "./NavBar";
import InputForm from "./InputForm";
import InventoryList from "./InventoryList";
import ScrollToTopButton from "./ScrollToTopButton";
import React from "react";

//  The HomePage component sets up the structure and functionality of the
//  home page in the inventory management system, including adding items,
//  displaying the inventory list, and providing a button to delete all items.
const HomePage = () => {
    return (
        <div className="homePageBlock">
            <Navbar />
            <h1>Inventory Management System</h1>
            <InputForm />
            <InventoryList />
            <div className="homePageBottomButtons">
                <ScrollToTopButton/>
            </div>
        </div>
    );
};

export default HomePage;

