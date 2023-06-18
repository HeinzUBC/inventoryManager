import { combineReducers } from 'redux';
import inventoryReducer from "./inventoryReducer";
import dateReducer from "./dateReducer";

// By using combineReducers from Redux, we create a single rootReducer
// that manages different slices of the overall app state. The inventoryReducer
// is combined as the "inventory" portion of the state. The dateReducer is combined
// as the "date" portion of the state.
const rootReducer = combineReducers({
    // keys represent what "portion" of state is managed
    // by the associated reducer.
    inventory: inventoryReducer,
    date:dateReducer
});

export default rootReducer;
