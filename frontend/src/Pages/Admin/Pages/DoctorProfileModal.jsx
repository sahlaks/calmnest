import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorProfileModal = ({ doctor, onClose, onVerify, onReject }) => {
    const navigate = useNavigate();

    const handleVerify = () => {
        onVerify(); 
        navigate("/admin/doctors");
      };
    
      const handleReject = () => {
        onReject();
        navigate("/admin/doctors");
      };

      
  if (!doctor) return null;
  const documentUrl = doctor.document
    ? `http://localhost:3000/${doctor.document}`
    : null;
  console.log(doctor.document);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-80 p-5 rounded-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Doctor Profile</h2>
        <p>
          <strong>Name:</strong> {doctor.doctorName}
        </p>
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>
        <p>
          <strong>Phone:</strong> {doctor.mobileNumber}
        </p>
        <p>
          <strong>Documents:</strong>
        </p>
        <div className="mb-4">
          {documentUrl ? (
            <>
              <p>
                <strong>Uploaded Document:</strong>
              </p>
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Document
              </a>
            </>
          ) : (
            <p>No document uploaded</p>
          )}
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleReject}
          >
            Reject
          </button>
          <button
            className="bg-[#323232] text-white px-4 py-2 rounded"
            onClick={handleVerify}
            hidden={doctor.isVerified}
          >
            Verify
          </button>
          <button
            className="bg-[#DDD0C8] text-gray-800 px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal;
