import React, {useState} from "react";
import ControlPanel from "./ControlPanel";
import InventoryList from "./InventoryList";

// The user interface of the inventory management application
const InventoryInterface = () => {

    // The selectedCategoryID state variable keeps track of the currently selected
    // category's _id from the category toggle in ControlPanel component.
    const [selectedCategoryID, setSelectedCategoryID] = useState("");

    return (
        <div className="InventoryInterface">
            <InventoryList selectedCategoryID={selectedCategoryID} />
            <ControlPanel setSelectedCategoryID={setSelectedCategoryID} />
        </div>
    );
};

export default InventoryInterface;