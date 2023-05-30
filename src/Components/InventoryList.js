// InventoryList component
import {useSelector} from "react-redux";
import InventoryItem from "./InventoryItem";

const InventoryList = () => {
    // The InventoryList component retrieves the inventory state from the
    // inventoryReducer store using the useSelector hook.
    const inventory = useSelector((state) => state.inventory);

    // It then maps over the inventory array and renders each item using
    // the InventoryItem component, passing the item as a prop.
    return (
        <div className="inventory-list">
            {inventory.map((item) => (
                <InventoryItem item={item} />
            ))}
        </div>
    );
};

export default InventoryList;