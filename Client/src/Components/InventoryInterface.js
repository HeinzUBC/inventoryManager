import React from "react";
import ControlPanel from "./ControlPanel";
import InventoryList from "./InventoryList";

// The user interface of the inventory management application
const InventoryInterface = () => {
    return (
        <div className="InventoryInterface">
            <InventoryList />
            <ControlPanel />
        </div>
    );
};

export default InventoryInterface;