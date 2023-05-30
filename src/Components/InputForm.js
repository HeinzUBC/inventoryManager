import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addItem} from "../StateManager/inventoryActions";

// This component handles the user input for creating a new item in the inventory.
// It validates the input and dispatches the appropriate action to add the item to
// the inventory. Any validation errors are displayed to the user.
const InputForm = () => {
    const dispatch = useDispatch();
    const inventoryList = useSelector(state => state.inventory);

    // The component initializes the necessary state variables using the
    // useState hook: name, unitPrice, description, imageUrl, and error.
    const [name, setName] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');

    const handleAddItem = (e) => {
        // By default, when a form is submitted, the browser reloads the page or performs a
        // full page refresh. Calling e.preventDefault() inside the form submission event
        // handler prevents the default behavior, allowing us to process the submission manually
        e.preventDefault();

        // create copies of state variables and remove left/right whitespace
        const nameVal = name.trim();
        const descriptionVal = description.trim();
        const imgURLVal = imageUrl.trim();

        // Determining whether the price input string is numeric is done by
        // the price input box itself, since it is set to type="number"
        const unitPriceVal = parseFloat(unitPrice.trim());

        // Validate the inputs to ensure none of them are empty. If any of the variables
        // are either "", NaN, null, or undefined, !variable will evaluate to true
        if (!nameVal || !unitPriceVal || !descriptionVal || !imgURLVal) {
            setError('Please fill in all the input fields.');
            return;
        }

        // check to see whether an item in the inventoryReducer store already used nameVal
        let itemsWithSameName = inventoryList.filter(item => (item.name === nameVal));

        // Validate that the item name provided is unique. Item name is treated as a key
        // when it comes to deleting items from inventory.
        if (itemsWithSameName.length > 0) {
            setError('Item name has already been used in the inventory. Enter a unique item name');
            return;
        }

        // Validation of the image URL is done automatically by the URL input box,
        // since it is set to type="url"

        // Create a new item object to add to inventoryReducer store
        const newItem = {
            name: nameVal,
            price: unitPriceVal,
            description: descriptionVal,
            imageURL: imgURLVal
        };

        dispatch(addItem(newItem));

        // Clear the input values and error message
        setName('');
        setUnitPrice('');
        setDescription('');
        setImageUrl('');
        setError('');
    };

    // Clear the input values and error message after clicking the
    // "Clear" button
    const resetFormHandler = () => {
        setName('');
        setUnitPrice('');
        setDescription('');
        setImageUrl('');
        setError('');
    }

    return (
        <form className="input-form" onSubmit={handleAddItem}>
            <label htmlFor="item-name">Item Name:</label>
            <input
                type="text"
                id="item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="unit-price">Unit Price:</label>
            <input
                type="number"
                id="unit-price"
                step="any"
                min={0}
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
            />

            <label htmlFor="description">Description:</label>
            <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <label htmlFor="image-url">Image URL:</label>
            <input
                type="url"
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />

            {error && <p className="error-msg">{error}</p>}

            <div>
                <button type="submit">Add Item</button>
                <button type="reset" id="resetFormButton" onClick={resetFormHandler}>
                    Clear
                </button>
            </div>
        </form>
    );
};

export default InputForm;
