import React from "react";

// the ItemCardDetailPopUp component provides a reusable component for
// displaying additional details of an item in a POPUP, allowing the user
// to view more information about the item and close the popup when desired.
const ItemCardDetailPopUp = ({ item, onClose }) => {
    // ItemCardDetailPopUp receives two props:
    //     1) "item" is the object whose extra details we want to display in the popup.
    //     2) "onClose" is a function that is called when the "Close" button is clicked,
    //     allowing the popup to be closed.
    return (
        <div className="popup-content">
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Price: $</strong> {item.price}</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default ItemCardDetailPopUp;
