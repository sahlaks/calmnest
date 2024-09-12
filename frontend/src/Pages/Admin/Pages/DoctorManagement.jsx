import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../Layout/AdminLayout';
import { blockDoctor, deleteDoctor, fetchDoctors, verifyDoctor } from '../../../Services/API/AdminAPI';
import { toast } from 'react-toastify';
import Loading from '../../../Components/Loading/Loading';
import { TrashIcon, BanIcon, CheckCircleIcon, XCircleIcon, CheckIcon, XIcon } from '@heroicons/react/solid';

function DoctorManagement() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const response = await fetchDoctors();
      if (response.data.success) {
        setDoctors(response.data.data);
      } else {
        toast.error("Failed to fetch doctors");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const handleBlock = async (e, id, isBlocked) => {
    e.preventDefault();

    try {
      const res = await blockDoctor(id);
      if (res.success) {
        toast.success(isBlocked ? "Doctor unblocked" : "Doctor blocked");
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor._id === id ? { ...doctor, isBlocked: !isBlocked } : doctor
          )
        );
      }
    } catch (err) {
      console.log("Error blocking/unblocking doctor:", err);
    }
  };

  const handleVerify = async (e, id, isVerified) => {
    e.preventDefault();
    if (isVerified) return;

    try {
      const res = await verifyDoctor(id);
      if (res.success) {
        toast.success(isVerified ? "Doctor unverified" : "Doctor verified");
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor._id === id ? { ...doctor, isVerified: !isVerified } : doctor
          )
        );
      }
    } catch (err) {
      console.log("Error verifying/unverifying doctor:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
      if (result.isConfirmed) {
        const res = await deleteDoctor(id);
        if (res.success) {
          Swal.fire('Deleted!', 'Doctor has been deleted.', 'success');
          fetchDoctorData();
        } else {
          Swal.fire('Error!', 'Failed to delete doctor.', 'error');
        }
      }
    } catch (err) {
      console.error("Error during doctor deletion", err);
      toast.error("An error occurred while deleting the doctor");
    }
  };

  return (
    <div>
      <AdminLayout>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-2 md:mb-0">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-4 py-2 w-full focus:outline-none"
                />
                <button className="bg-[#323232] text-white px-4 py-2 hover:bg-[#323232]">
                  Search
                </button>
              </div>

              <div>
                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none">
                  <option value="">Filter by</option>
                  <option value="all">All</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                  <option value="blocked">Blocked</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>

            <div>
              <table className="table-auto border-collapse border border-gray-300 w-full hidden md:table">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-300">
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      No.
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      Image
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      Name
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      Email Id
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      Verified
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      Status
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {doctors.map((doctor, index) => (
                    <tr key={doctor._id}>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        <img
                          src={doctor.image}
                          alt={doctor.doctorName}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      </td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        {doctor.doctorName}
                      </td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        {doctor.email}
                      </td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded ${
                            doctor.isVerified
                              ? "bg-blue-100 text-blue-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {doctor.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded ${
                            doctor.isBlocked
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {doctor.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        <button
                          className={`text-${doctor.isVerified ? 'red' : 'blue'}-600 hover:text-${doctor.isVerified ? 'red' : 'blue'}-800 ml-4`}
                          onClick={(e) =>
                            handleVerify(e, doctor._id, doctor.isVerified)
                          }
                        >
                          {doctor.isVerified ? (
                            <XCircleIcon className="h-5 w-5 inline-block" />
                          ) : (
                            <CheckCircleIcon className="h-5 w-5 inline-block" />
                          )}
                        </button>
                        <button
                          className={`text-${doctor.isBlocked ? 'green' : 'red'}-600 hover:text-${doctor.isBlocked ? 'green' : 'red'}-800 ml-4`}
                          onClick={(e) =>
                            handleBlock(e, doctor._id, doctor.isBlocked)
                          }
                        >
                          {doctor.isBlocked ? (
                            <CheckIcon className="h-5 w-5 inline-block" />
                          ) : (
                            <XIcon className="h-5 w-5 inline-block" />
                          )}
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 m-4"
                          onClick={() => handleDelete(doctor._id)}
                        >
                          <TrashIcon className="h-5 w-5 inline-block" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="md:hidden">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="border border-[#FAF5E9]-500 shadow-lg p-4 mb-4"
                  >
                    <p>
                      <strong>Name:</strong> {doctor.doctorName}
                    </p>
                    <p>
                      <strong>Email:</strong> {doctor.email}
                    </p>
                    <p>
                      <strong>Verified:</strong> {doctor.isVerified ? 'Yes' : 'No'}
                    </p>
                    <p>
                      <strong>Block Status:</strong> {doctor.isBlocked ? 'Blocked' : 'Active'}
                    </p>
                    <button
                      className={`bg-${doctor.isBlocked ? 'green' : 'blue'}-500 text-white px-2 py-1 rounded`}
                      onClick={(e) => handleBlock(e, doctor._id, doctor.isBlocked)}
                    >
                      {doctor.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className={`bg-${doctor.isVerified ? 'red' : 'blue'}-500 text-white px-2 py-1 rounded ml-2`}
                      onClick={(e) => handleVerify(e, doctor._id, doctor.isVerified)}
                    >
                      {doctor.isVerified ? "Unverify" : "Verify"}
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => handleDelete(doctor._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </AdminLayout>
    </div>
  );
}

export default DoctorManagement;
