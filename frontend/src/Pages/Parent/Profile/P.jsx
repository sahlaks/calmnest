import React, { useState } from 'react';
import DoctorChangePassword from '../../Doctor/ChnangePassword/ChangePassword'; // Make sure this path is correct

const YourComponent = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <p className="text-xl text-gray-600">
        Want to change your password?{" "}
        <button
          className="text-blue-500 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            handleClickOpen(); // Correct way to call the function
          }}
        >
          Click here
        </button>
      </p>
      <DoctorChangePassword open={open} onClose={handleClose} />
    </div>
  );
};

export default YourComponent;
//  <button
// onClick={handleUpdateEmailClick}
// className="text-sm text-blue-500 mt-1 absolute right-4 top-1/2 transform -translate-y-1/2 underline"
// >
// Update Email
// </button>