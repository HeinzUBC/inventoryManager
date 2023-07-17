import React, {useEffect, useState} from "react";
import AddInventoryItem from "./AddInventoryItem";
import CategoryToggle from "./CategoryToggle";
import {REQUEST_STATE} from "../StateManager/requestState";
import {useSelector} from "react-redux";

// Renders the control panel component that provides functionalities for
// adding new inventory items and filtering inventory items by category.
const ControlPanel = ({setSelectedCategoryID}) => {
    const {error, deleteCategory} = useSelector((state) => state.inventory);
    const [errMessage, setErrMessage] = useState("");

    useEffect(() => {
        if (deleteCategory === REQUEST_STATE.REJECTED && error) {
            setErrMessage(error);
        }
    }, [error, deleteCategory]);

    return (
        <>
            <div className="controlPanel">
                {errMessage && (
                    <p className="error-msg flex flex-row justify-center">
                        {errMessage}
                    </p>
                )}
                <CategoryToggle setSelectedCategoryID={setSelectedCategoryID}
                                setErrMessage={setErrMessage}/>
                <AddInventoryItem/>
            </div>
        </>
    );
};

export default ControlPanel;