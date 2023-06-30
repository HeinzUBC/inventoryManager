import React from "react";
import AddInventoryItem from "./AddInventoryItem";
import CategoryToggle from "./CategoryToggle";

// ControlPanel component provides functionalities for adding new TODOItems
// and filtering inventory items by category.
const ControlPanel = () => {
    return (
        <div className="controlPanel">
            <AddInventoryItem />
            <CategoryToggle />
        </div>
    );
};

export default ControlPanel;