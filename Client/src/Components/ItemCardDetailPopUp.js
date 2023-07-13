import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Dialog, Input, Spinner, Textarea } from '@material-tailwind/react';
import thunk from '../StateManager/thunk';
import { REQUEST_STATE } from '../StateManager/requestState';

const ItemCardDetailPopUp = ({ item }) => {
    const { categoryList, getInventoryItem, currentItem, error } = useSelector((state) => state.inventory);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    // formData state variable is used to store the values entered in the form.
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        imageURL: "",
        category: "",
    });

    const handleOpen = async () => {
        setLoading(true);
        const success = await dispatch(thunk.getInventoryItemAsync(item._id));
        setLoading(false);
        if (success) {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setErrMessage('');
        setOpen(false);
    };

    // Function to handle the input changes for all attributes
    const handleInputChange = (e) => {
        // e.target.name is referring to the "name" value of each Input component
        // in the form below
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const { name, price, description, imageURL, category } = formData;

        // Check if any of the input fields are empty
        if (!name || !price || !description || !imageURL || !category) {
            setErrMessage("Please fill in all fields.");
            return;
        }

        const updatedItem = {
            name: name,
            price: price,
            description: description,
            imageURL: imageURL,
            category: category
        };

        setLoading(true);
        const success = await dispatch(thunk.editInventoryItemAsync( {
            itemID: item._id,
            item: updatedItem
        }));
        setLoading(false);

        if (success) {
            setOpen(false);
        }
    };

    const resetFormHandler = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            imageURL: "",
            category: "",
        });
        setErrMessage('');
    };

    useEffect(() => {
        if (getInventoryItem === REQUEST_STATE.FULFILLED && currentItem) {
            setFormData({
                name: currentItem.name,
                description: currentItem.description,
                price: currentItem.price,
                imageURL: currentItem.imageURL,

                // currentItem only stores a reference to a Category
                // object. The actual Category object has its value
                // stored within the "category" field. To access the
                // Category value we do currentItem.category.category
                category: currentItem.category.category,
            });
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
                            <Input value={formData.name}
                                   label="Name"
                                   name="name"
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="inputField">
                            <Input
                                type="number"
                                step="any"
                                min={0}
                                value={formData.price}
                                label="Price"
                                name="price"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="inputField">
                            <Textarea
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="inputField">
                            <Input type="url"
                                   value={formData.imageURL}
                                   label="Image URL"
                                   name="imageURL"
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="inputField">
                            <Input
                                value={formData.category}
                                list="categoryOptions"
                                label="Category"
                                name="category"
                                onChange={handleInputChange}
                            />
                            <datalist id="categoryOptions">
                                {categoryList.map((category) => (
                                    <option key={category._id} value={category.category}></option>
                                ))}
                            </datalist>
                        </div>

                        {loading && <Spinner className="h-10 w-10" />}
                        {errMessage && <p className="error-msg">{errMessage}</p>}

                        <div className="DialogButtons">
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
