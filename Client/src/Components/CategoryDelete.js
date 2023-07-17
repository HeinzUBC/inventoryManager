import React from 'react';
import {Button, Spinner} from "@material-tailwind/react";
import thunk from "../StateManager/thunk";
import {useDispatch, useSelector} from "react-redux";

// Renders a delete button for a specific category. When the delete
// button is clicked, it dispatches the deleteCategoryAsync thunk action
// to delete the category from the server. If the deletion is successful,
// it calls the setSelectedCategoryID function to clear the selected category.
const CategoryDelete = ({category, setSelectedCategoryID}) => {
    const {deleteCategory} = useSelector((state) => state.inventory);
    const dispatch = useDispatch();

    const handleDelete = async () => {
        const success = await dispatch(thunk.deleteCategoryAsync(category._id));
        if (success) {
            setSelectedCategoryID("");
        }
    };

    return (
        <>
            {deleteCategory === 'PENDING' && <Spinner className="h-10 w-10" />}
            <Button color="red" size="sm" onClick={handleDelete}>
                Delete
            </Button>
        </>
    );
};

export default CategoryDelete;