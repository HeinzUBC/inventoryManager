import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteItem } from "../StateManager/inventoryActions";
import ItemCardDetailPopUp from "./ItemCardDetailPopUp";

// the InventoryItem component represents an item in the inventory list,
// provides functionality to delete an item, and handles the display of
// a popup for more detailed information about the item.

// The component receives the item prop, which contains the details of
// the item to be rendered.
const InventoryItem = ({ item }) => {
    // The dispatch function is obtained using the useDispatch hook from react-redux.
    // It allows us to dispatch actions to the inventoryReducer store.
    const dispatch = useDispatch();

    // The useState hook is used to manage the state of the popup.
    // The isPopupOpen state variable is initialized as false, and the
    // setPopupOpen function is used to update its value.
    const [isPopupOpen, setPopupOpen] = useState(false);

    // The handleDelete function is called when the "Delete" button is clicked.
    // It dispatches the deleteItem action with the item.name as the payload.
    // This action is responsible for deleting the item from the inventory.
    const handleDelete = () => {
        dispatch(deleteItem(item.name));
    };

    // The handlePopupOpen function is called when the "More Info" button is clicked.
    // It sets the isPopupOpen state to true, which triggers the rendering of the
    // ItemCardDetailPopUp component.
    const handlePopupOpen = () => {
        setPopupOpen(true);
    };

    // The handlePopupClose function is called when the popup is closed. It sets the
    // isPopupOpen state to false, which hides the ItemCardDetailPopUp component.
    const handlePopupClose = () => {
        setPopupOpen(false);
    };

    return (
        <div className="inventory-item">
            <img src={item.imageURL} alt={item.name} />
            <p>{item.name}</p>
            <button onClick={handlePopupOpen}>More Info</button>
            <button id="deleteAnItemButton" onClick={handleDelete}>Delete</button>
            {isPopupOpen && (
                <ItemCardDetailPopUp item={item} onClose={handlePopupClose} />
            )}
        </div>
    );
};

export default InventoryItem;

