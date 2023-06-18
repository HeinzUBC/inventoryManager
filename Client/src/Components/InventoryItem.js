import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import thunk from '../StateManager/thunk';
import ItemCardDetailPopUp from './ItemCardDetailPopUp';
import { Spinner } from '@material-tailwind/react';

const InventoryItem = ({ item }) => {
    const dispatch = useDispatch();
    const { deleteInventoryItem } = useSelector((state) => state.inventory);

    const handleDelete = () => {
        dispatch(thunk.deleteInventoryItemAsync(item.id));
    };

    return (
        <div className="inventory-item">
            <img src={item.imageURL} alt={item.name} />
            <p>{item.name}</p>
            <button id="deleteAnItemButton" onClick={handleDelete}>
                Delete
            </button>
            {deleteInventoryItem === 'PENDING' && <Spinner className="h-10 w-10" />}
            <ItemCardDetailPopUp item={item} />
        </div>
    );
};

export default InventoryItem;

