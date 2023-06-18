import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Dialog, Input, Spinner, Textarea } from '@material-tailwind/react';
import thunk from '../StateManager/thunk';
import { REQUEST_STATE } from '../StateManager/requestState';

const ItemCardDetailPopUp = ({ item }) => {
    const { getInventoryItem, currentItem, error } = useSelector((state) => state.inventory);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageURL, setImageURL] = useState('');

    const [errMessage, setErrMessage] = useState('');

    const handleOpen = () => {
        setLoading(true);
        dispatch(thunk.getInventoryItemAsync(item.id));
        setLoading(false);
        setOpen(true);
    };

    const handleClose = () => {
        setErrMessage('');
        setOpen(false);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleImageURLChange = (e) => {
        setImageURL(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Check if any of the input fields are empty
        if (!name || !price || !description || !imageURL) {
            setErrMessage("Please fill in all fields.");
            return;
        }

        const updatedItem = {
            name: name,
            price: price,
            description: description,
            imageURL: imageURL,
        };

        setLoading(true);
        const success = await dispatch(thunk.editInventoryItemAsync( {
            itemID: currentItem.id,
            item: updatedItem
        }));
        setLoading(false);

        if (success) {
            setOpen(false);
        }
    };

    const resetFormHandler = () => {
        setName('');
        setPrice('');
        setDescription('');
        setImageURL('');
        setErrMessage('');
    };

    useEffect(() => {
        if (getInventoryItem === REQUEST_STATE.FULFILLED && currentItem) {
            setName(currentItem.name);
            setDescription(currentItem.description);
            setPrice(currentItem.price);
            setImageURL(currentItem.imageURL);
        }

        if (getInventoryItem === REQUEST_STATE.REJECTED && error) {
            setErrMessage(error);
        }
    }, [getInventoryItem, currentItem, error]);

    return (
        <>
            <Button onClick={handleOpen} className="bg-indigo-300">
                Details
            </Button>
            <Dialog size="lg" open={open} handler={handleOpen} className="shadow-none">
                <Card className="editItemForm">
                    <h2>Edit Inventory Item</h2>
                    <form className="ItemForm" onSubmit={handleFormSubmit}>
                        <div className="inputField">
                            <label htmlFor="edit-name">name:</label>
                            <Input id="edit-name" value={name} label="name" onChange={handleNameChange} />
                        </div>
                        <div className="inputField">
                            <label htmlFor="edit-price">price:</label>
                            <Input
                                id="edit-price"
                                type="number"
                                step="any"
                                min={0}
                                value={price}
                                label="price"
                                onChange={handlePriceChange}
                            />
                        </div>
                        <div className="inputField">
                            <label htmlFor="edit-description">Description:</label>
                            <Textarea
                                id="edit-description"
                                label="description"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </div>
                        <div className="inputField">
                            <label htmlFor="edit-imageURL">image URL:</label>
                            <Input id="edit-imageURL" type="url" value={imageURL} label="image URL" onChange={handleImageURLChange} />
                        </div>

                        {loading && <Spinner className="h-10 w-10" />}
                        {errMessage && <p className="error-msg">{errMessage}</p>}

                        <div className="EditItemButtons">
                            <Button color="light-blue" size="sm" type="submit">
                                Confirm
                            </Button>
                            <Button color="gray" size="sm" onClick={resetFormHandler}>
                                Clear
                            </Button>
                            <Button color="red" size="sm" onClick={handleClose}>
                                Close
                            </Button>
                        </div>
                    </form>
                </Card>
            </Dialog>
        </>
    );
};

export default ItemCardDetailPopUp;
