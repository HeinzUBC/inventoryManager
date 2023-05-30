import { clearItems } from "../StateManager/inventoryActions";
import { useDispatch } from "react-redux";
import Navbar from "./NavBar";
import InputForm from "./InputForm";
import InventoryList from "./InventoryList";
import ScrollToTopButton from "./ScrollToTopButton";
import React from "react";

//  The HomePage component sets up the structure and functionality of the
//  home page in the inventory management system, including adding items,
//  displaying the inventory list, and providing a button to delete all items.
const HomePage = () => {
    // The useDispatch hook is used to get the dispatch function
    // from the Redux store. This hook allows the component to dispatch actions to the store.
    const dispatch = useDispatch();

    // This function is called when the "Delete All" button is clicked. It dispatches the
    // clearItems action, which removes all items from the inventory.
    const handleDeleteAll = () => {
        dispatch(clearItems());
    };

    // <ScrollToTopButton /> component: Renders a button to scroll back to the top of the page.
    return (
        <div className="homePageBlock">
            <Navbar />
            <h1>Inventory Management System</h1>
            <InputForm />
            <InventoryList />
            <div className="homePageBottomButtons">
                <button className="delete-all-btn" onClick={handleDeleteAll}>
                    Delete All
                </button>
                <ScrollToTopButton/>
            </div>
        </div>
    );
};

export default HomePage;

