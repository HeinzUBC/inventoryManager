import React, { useEffect, useState } from "react";
import {Option, Select, Spinner} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import thunk from "../StateManager/thunk";
import CategoryDelete from "./CategoryDelete";

// CategoryToggle provides a dropdown menu for selecting a specific category to filter
// inventory items by category. setSelectedCategoryID uses the toggle
// selection as the inventory list filter criteria in the MongoDB database.
function CategoryToggle({setSelectedCategoryID}) {
    const { categoryList, fetchCategoryList } = useSelector(
        (state) => state.inventory
    );

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // updates category list in redux store from server whenever list is
    // updated
    useEffect(() => {
        setLoading(true);
        dispatch(thunk.getCategoryListAsync()).then(() => {
            setLoading(false);
        });
    }, [dispatch, fetchCategoryList]);

    return (
        <div className="toggleBox">
            {loading && <Spinner className="h-10 w-10" />}
            <Select id="categoryFilter" label="Search by Category" onChange={setSelectedCategoryID}>
                <Option value="">All Categories</Option>
                {categoryList.map((category) => (
                    <Option key={category._id} value={category._id} className="categoryOption">
                        {category.category}
                        <CategoryDelete category={category} setSelectedCategoryID={setSelectedCategoryID}/>
                    </Option>
                ))}
            </Select>
        </div>
    );
}

export default CategoryToggle;