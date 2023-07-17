import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import thunk from '../StateManager/thunk';
import ItemCardDetailPopUp from './ItemCardDetailPopUp';
import {Spinner} from '@material-tailwind/react';

// It renders an individual inventory item card with its image, name,
// and two buttons: "Delete" and "More Info".
const InventoryItem = ({item}) => {
    const dispatch = useDispatch();
    const {deleteInventoryItem} = useSelector((state) => state.inventory);

    const handleDelete = () => {
        dispatch(thunk.deleteInventoryItemAsync(item._id));
    };

    return (
        <div className="inventory-item flex flex-col
        items-center max-w-[200px]">
            <img src={item.imageURL} alt={item.name}/>
            <p>{item.name}</p>
            {deleteInventoryItem === 'PENDING' && <Spinner className="h-10 w-10"/>}
            <div className="flex flex-row justify-evenly flex-wrap">
                <button id="deleteAnItemButton" onClick={handleDelete}>
                    Delete
                </button>
                <ItemCardDetailPopUp item={item}/>
            </div>
        </div>
    );
};

export default InventoryItem;

