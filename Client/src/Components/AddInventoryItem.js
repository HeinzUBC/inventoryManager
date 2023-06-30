import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Card,
    Dialog,
    Input,
    Spinner,
    Textarea,
} from "@material-tailwind/react";
import thunk from "../StateManager/thunk";
import {REQUEST_STATE} from "../StateManager/requestState";

// AddInventoryItem component provides a form to add new inventory Items
const AddInventoryItem = () => {
    const dispatch = useDispatch();
    const { error, addInventoryItem } = useSelector((state) => state.inventory);

    // openAddItem is used to control the visibility of the AddInventoryItem dialog popup.
    const [openAddItem, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    // formData state variable is used to store the values entered in the form.
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        imageURL: "",
    });

    const handleOpen = () => {
        setOpen(!openAddItem);
        resetFormHandler();
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

    // The handleSubmit function is called when the form is submitted.
    // It performs validation on the input fields to ensure that the required
    // fields are not empty. If any of the required fields are empty, an error
    // message is set in the error state variable.
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, price, description, imageURL } = formData;

        if (!name || !price || !description || !imageURL) {
            setErrMessage("Please provide all required fields.");
            return;
        }

        const newItem = {
            name: name,
            price: price,
            description: description,
            imageURL: imageURL,
        };

        setLoading(true);
        const success = await dispatch(thunk.addInventoryItemAsync(newItem));
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
        });
        setErrMessage("");
    };

    useEffect(() => {
        if (addInventoryItem === REQUEST_STATE.FULFILLED) {
            resetFormHandler();
        }

        if (addInventoryItem === REQUEST_STATE.REJECTED && error) {
            setErrMessage(error);
        }
    }, [addInventoryItem, error]);

    return (
        <>
            <Button
                color="red"
                id="AddNewItemButton"
                size="md"
                onClick={handleOpen}
            >
                Add New Item
            </Button>
            <Dialog
                size="lg"
                open={openAddItem}
                handler={handleOpen}
                className="shadow-none"
            >
                <Card className="addItemForm">
                    <h2>Add Inventory Item</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="inputField">
                            <label htmlFor="item-name">Name:</label>
                            <Input
                                id="item-name"
                                value={formData.name}
                                label="name"
                                name="name"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="inputField">
                            <label htmlFor="item-price">Price:</label>
                            <Input
                                id="item-price"
                                type="number"
                                step="any"
                                min={0}
                                value={formData.price}
                                label="price"
                                name="price"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="inputField">
                            <label htmlFor="add-description">Description:</label>
                            <Textarea
                                id="add-description"
                                label="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="inputField">
                            <label htmlFor="image-URL">Image URL:</label>
                            <Input
                                id="image-URL"
                                type="url"
                                value={formData.imageURL}
                                label="image URL"
                                name="imageURL"
                                onChange={handleInputChange}
                            />
                        </div>

                        {loading && <Spinner className="h-10 w-10" />}
                        {errMessage && <p className="error-msg">{errMessage}</p>}

                        <div className="DialogButtons">
                            <Button color="light-blue" size="sm" type="submit">
                                Confirm
                            </Button>
                            <Button
                                color="gray"
                                size="sm"
                                type="reset"
                                onClick={resetFormHandler}
                            >
                                Clear
                            </Button>
                            <Button color="red" size="sm" type="button" onClick={handleOpen}>
                                Close
                            </Button>
                        </div>
                    </form>
                </Card>
            </Dialog>
        </>
    );
};

export default AddInventoryItem;