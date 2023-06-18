import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {updateDate} from "../StateManager/dateReducer";

// This component utilizes React Redux hooks (useSelector and useDispatch)
// to interact with the Redux store. It selects the date state from the store
// and updates it every second using the updateDate action. The current date is
// then displayed in the component.
const DateComponent = () => {
    // The useSelector hook is used to select the date state from the dateReducer store.
    // The currentDate variable holds the selected state value.
    const { date } = useSelector(state => state.date);

    // The useDispatch hook is used to get the dateReducer store's dispatch function.
    // The dispatch variable holds the dispatch function reference.
    const dispatch = useDispatch();

    // The useEffect hook is used to set up a timer that updates the
    // date in the dateReducer store every second.
    useEffect(() => {

        // the interval variable serves as a REFERENCE to the timer created by setInterval,
        // allowing you to control and clear the timer when it's no longer needed.
        const interval = setInterval(() => {
            // The setInterval function dispatches the updateDate action every second
            // (1000 ms) with the new date obtained using new Date().toLocaleString().
            const newDate = new Date().toLocaleString();
            dispatch(updateDate(newDate));
        }, 1000);

        // By calling clearInterval and passing in the timer reference,
        // we ensure that the timer is stopped and the resources associated with
        // it are released when the component is unmounted.
        return () => {
            clearInterval(interval);
        };
    }, [dispatch]);

    return (
        <div className="date-component">
            Date: {date}
        </div>
    );
};

export default DateComponent;

