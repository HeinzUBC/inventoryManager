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
    const { categoryList, error, addInventoryItem } = useSelector((state) => state.inventory);

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
        category: "",
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

        const { name, price, description, imageURL, category } = formData;

        if (!name || !price || !description || !imageURL || !category) {
            setErrMessage("Please provide all required fields.");
            return;
        }

        const newItem = {
            name: name,
            price: price,
            description: description,
            imageURL: imageURL,
            category: category
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
            category: "",
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
                className="mt-4"
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
                <Card className="m-4">
                    <h2 className="flex flex-row justify-center">Add Inventory Item</h2>
                    <form
                        className="flex flex-col justify-evenly h-[30rem] overflow-y-auto"
                        onSubmit={handleSubmit}>
                        <div className="inputField">
                            <Input
                                value={formData.name}
                                label="Name"
                                name="name"
                                onChange={handleInputChange}
                            />
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
                            <Input
                                type="url"
                                value={formData.imageURL}
                                label="Image URL"
                                name="imageURL"
                                onChange={handleInputChange}
                            />
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