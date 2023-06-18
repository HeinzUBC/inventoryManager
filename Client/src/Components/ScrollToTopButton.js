import React from 'react';

// The ScrollToTopButton component renders a button with the text "Scroll to Top."
// When the button is clicked, it scrolls the window to the top with a smooth scrolling behavior.
function ScrollToTopButton() {

    const scrollToTop = () =>{
        window.scrollTo({
            // denote destination height of 0px (top of viewing window)
            top: 0,

            // Set so that window scrolls smoothly
            behavior: 'smooth'
        });
    };

    return (
        <button className="scroll-to-top" onClick={scrollToTop}>
            Scroll to Top
        </button>
    );
}

export default ScrollToTopButton;