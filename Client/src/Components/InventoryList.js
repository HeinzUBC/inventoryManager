import { useDispatch, useSelector } from 'react-redux';
import InventoryItem from './InventoryItem';
import { useEffect } from 'react';
import thunk from '../StateManager/thunk';

const InventoryList = () => {
    const { inventoryList, fetchInventoryList } = useSelector((state) => state.inventory);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunk.getInventoryListAsync());
    }, [dispatch, fetchInventoryList]);

    return (
        <div className="inventory-list">
            {inventoryList.map((item) => (
                <InventoryItem key={item.id} item={item} />
            ))}
        </div>
    );
};

export default InventoryList;