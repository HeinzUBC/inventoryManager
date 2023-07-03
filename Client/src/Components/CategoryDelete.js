import React from 'react';
import {Button, Spinner} from "@material-tailwind/react";
import thunk from "../StateManager/thunk";
import {useDispatch, useSelector} from "react-redux";

const CategoryDelete = ({category, setSelectedCategoryID}) => {
    const { deleteCategory } = useSelector((state) => state.inventory);
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