import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import thunk from '../StateManager/thunk';
import { REQUEST_STATE } from '../StateManager/requestState';
import { Spinner } from '@material-tailwind/react';

const InputForm = () => {
    const { error, addInventoryItem } = useSelector((state) => state.inventory);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [errMessage, setErrMessage] = useState(error);

    const handleAddItem = (e) => {
        e.preventDefault();

        // Check if any of the input fields are empty
        if (!name || !unitPrice || !description || !imageUrl) {
            setErrMessage("Please fill in all fields.");
            return;
        }

        const newItem = {
            name: name,
            price: unitPrice,
            description: description,
            imageURL: imageUrl,
        };

        setLoading(true);
        dispatch(thunk.addInventoryItemAsync(newItem)).then(() => {
            setLoading(false);
            setErrMessage(error);
            if (addInventoryItem === REQUEST_STATE.FULFILLED) {
                setName('');
                setUnitPrice('');
                setDescription('');
                setImageUrl('');
            }
        });
    };

    const resetFormHandler = () => {
        setName('');
        setUnitPrice('');
        setDescription('');
        setImageUrl('');
        setErrMessage('');
    };

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

            {loading && <Spinner className="h-10 w-10" />}
            {errMessage && <p className="error-msg">{errMessage}</p>}

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
