import { useDispatch, useSelector } from 'react-redux';
import InventoryItem from './InventoryItem';
import React, {useEffect, useState} from 'react';
import thunk from '../StateManager/thunk';
import {Spinner} from "@material-tailwind/react";

// Renders a list of inventory items based on the inventoryList state from the Redux store.
const InventoryList = ({selectedCategoryID}) => {
    const {inventoryList} = useSelector((state) => state.inventory);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        // selectedCategoryID is passed into getInventoryListAsync()
        // so that when frontend fetches the inventory list from
        // MongoDB database, the database has filtered the list
        // by this category ID
        dispatch(thunk.getInventoryListAsync(selectedCategoryID)).then(() => {
            setLoading(false);
        });
    }, [dispatch, selectedCategoryID]);

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