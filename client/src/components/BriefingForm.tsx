// Import necessary hooks and components
import React from 'react';

const BriefingForm = () => {
    return (
        <form>
            {/* Removed required attributes and asterisks from form fields */}
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Project Title" />
            {/* Additional form fields can go here */}
            <button type="submit">Submit</button>
        </form>
    );
};

export default BriefingForm;