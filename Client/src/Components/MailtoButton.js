import React from "react";
import {Link} from "react-router-dom";

// The MailtoButton component creates a button that, when clicked,
// opens the default email client with a pre-filled email. It uses the
// Link component from React Router to handle the click event and control
// the link behavior.
const MailtoButton = ({mailto, label}) => {

    // When MailtoButton is clicked, this onClickHandler performs the
    // following:
    //     1) Sets the window.location.href to the provided "mailto" value.
    //     This opens the default email client with a pre-filled email based on
    //     the "mailto" address.
    //     2) Calls e.preventDefault() to prevent the default behavior of the link,
    //     which would navigate to a new page or refresh the current page.
    const onClickHandler = (e) => {
        window.location.href = mailto;
        e.preventDefault();
    }

    // The component returns JSX markup representing the button.
    // It uses the Link component from React Router to create a clickable link.
    // The to prop of the Link component is set to '#', which is a placeholder
    // value since the actual destination is controlled by the onClick event.
    return (
        // The content of the button is determined by the "label" prop.
        <Link className="mailtoButton" to='#' onClick={onClickHandler}>
            {label}
        </Link>
    );
};

export default MailtoButton;