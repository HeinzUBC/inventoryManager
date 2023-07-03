import React from "react";
import AddInventoryItem from "./AddInventoryItem";
import CategoryToggle from "./CategoryToggle";

// ControlPanel component provides functionalities for adding new inventory items
// and filtering inventory items by category.
const ControlPanel = ({setSelectedCategoryID}) => {
    return (
        <div className="controlPanel">
            <CategoryToggle setSelectedCategoryID={setSelectedCategoryID} />
            <AddInventoryItem />
        </div>
    );
};

export default ControlPanel;