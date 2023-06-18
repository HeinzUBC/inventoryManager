import { useDispatch, useSelector } from 'react-redux';
import InventoryItem from './InventoryItem';
import React, {useEffect, useState} from 'react';
import thunk from '../StateManager/thunk';
import {Spinner} from "@material-tailwind/react";

const InventoryList = () => {
    const { inventoryList, fetchInventoryList } = useSelector((state) => state.inventory);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        dispatch(thunk.getInventoryListAsync()).then(() => {
            setLoading(false);
        });
    }, [dispatch, fetchInventoryList]);

    return (
        <>
            {loading && <Spinner className="h-10 w-10" />}
            <div className="inventory-list">
                {inventoryList.map((item) => (
                    <InventoryItem key={item.id} item={item} />
                ))}
            </div>
        </>
    );
};

export default InventoryList;