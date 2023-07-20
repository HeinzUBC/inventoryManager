import { useDispatch, useSelector } from 'react-redux';
import InventoryItem from './InventoryItem';
import React, {useEffect, useState} from 'react';
import thunk from '../StateManager/thunk';
import {Spinner} from "@material-tailwind/react";

// Renders a list of inventory items based on the inventoryList state from the Redux store.
const InventoryList = ({selectedCategoryID}) => {
    const {inventoryList, fetchInventoryList} = useSelector((state) => state.inventory);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // fetchInventoryList flag added as dependency to useEffect hook
    // so that whenever the inventory collection in database updates,
    // React component updates the Redux store with getInventoryListAsync()
    useEffect(() => {
        setLoading(true);
        // selectedCategoryID is passed into getInventoryListAsync()
        // so that when frontend fetches the inventory list from
        // MongoDB database, the database has filtered the list
        // by this category ID
        dispatch(thunk.getInventoryListAsync(selectedCategoryID)).then(() => {
            setLoading(false);
        });
    }, [dispatch, fetchInventoryList, selectedCategoryID]);

    return (
        <>
            {loading && <Spinner className="h-10 w-10" />}
            <div className="inventory-list">
                {inventoryList.map((item) => (
                    <InventoryItem key={item._id} item={item} />
                ))}
            </div>
        </>
    );
};

export default InventoryList;