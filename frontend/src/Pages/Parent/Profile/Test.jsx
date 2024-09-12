// ProfilePage.js
import React, { useState } from 'react';

const Test = () => {
  const [kids, setKids] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleAddKid = (newKid) => {
    setKids([...kids, newKid]);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      {/* Other profile page content */}

      <button
        onClick={handleOpenModal}
        className="bg-[#323232] text-white px-4 py-2 rounded-md"
      >
        Add Kid
      </button>

      {/* Display the list of kids */}
      <div className="flex flex-col max-w-md p-6 dark:text-gray-100">
        <label className="text-sm">Kids Details</label>
        {kids.length > 0 ? (
          kids.map((kid, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <p><strong>Name:</strong> {kid.name}</p>
              <p><strong>Age:</strong> {kid.age}</p>
              <p><strong>Gender:</strong> {kid.gender}</p>
              <p><strong>Date of Birth:</strong> {new Date(kid.dob).toLocaleDateString('en-US')}</p>
            </div>
          ))
        ) : (
          <h2 className="text-xl text-red-500">No kids data available</h2>
        )}
      </div>
    </div>
  );
};

export default Test
