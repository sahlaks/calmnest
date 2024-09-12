import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import AdminLayout from "../Layout/AdminLayout";
import {
  blockParent,
  deleteParent,
  fetchParents,
} from "../../../Services/API/AdminAPI";
import { toast } from "react-toastify";
import Loading from "../../../Components/Loading/Loading";
import { TrashIcon, BanIcon, CheckIcon } from "@heroicons/react/solid";

function ParentManagement() {
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState([]);
  const [error, setError] = useState(null);

  const fetchParentData = async () => {
    setLoading(true);
    try {
      const response = await fetchParents();
      if (response.data.success) {
        setParents(response.data.data);
      } else {
        toast.error("Failed to fetch parents");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentData();
  }, []);

  const handleBlock = async (e, id, isBlocked) => {
    e.preventDefault();

    try {
      const res = await blockParent(id);
      if (res.data.success) {
        toast.success(isBlocked ? "Parent unblocked" : "Parent blocked");
        setParents((prevParents) =>
          prevParents.map((parent) =>
            parent._id === id ? { ...parent, isBlocked: !isBlocked } : parent
          )
        );
      }
    } catch (err) {
      console.log("Error blocking/unblocking parent:", err);
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
        const res = await deleteParent(id);
        if (res.data.success) {
          Swal.fire('Deleted!', 'Parent has been deleted.', 'success');
          fetchParentData();
        } else {
          Swal.fire('Error!', 'Failed to delete parent.', 'error');
        }
      }
    } catch (err) {
      console.error("Error during parent deletion", err);
      toast.error("An error occurred while deleting the parent");
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
                  <option value="">Filter by </option>
                  <option value="all">All</option>
                  <option value="blocked">Blocked</option>
                  <option value="non-blocked">Non-Blocked</option>
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
                      Name
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      Email Id
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      Child Name
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
                  {parents.map((parent, index) => (
                    <tr key={parent._id}>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        {parent.parentName}
                      </td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        {parent.email}
                      </td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        {parent.childName}
                      </td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded ${
                            parent.isBlocked
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {parent.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          className="text-[#323232]-500 hover:text-[#323232]-700 ml-4"
                          onClick={(e) =>
                            handleBlock(e, parent._id, parent.isBlocked)
                          }
                        >
                          {parent.isBlocked ? (
                            <CheckIcon className="h-5 w-5 inline-block" />
                          ) : (
                            <BanIcon className="h-5 w-5 inline-block" />
                          )}
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 m-4"
                          onClick={() => handleDelete(parent._id)}
                        >
                          <TrashIcon className="h-5 w-5 inline-block" />{" "}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="md:hidden">
                {parents.map((parent) => (
                  <div
                    key={parent._id}
                    className="border border-[#FAF5E9]-500 shadow-lg p-4 mb-4"
                  >
                    <p>
                      <strong>Name:</strong> {parent.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {parent.email}
                    </p>
                    <p>
                      <strong>Child Name:</strong> {parent.childName}
                    </p>
                    <button
                      className={`bg-${parent.isBlocked ? "green" : "blue"}-500 text-white px-2 py-1 rounded`}
                      onClick={(e) => handleBlock(e, parent._id)}
                    >
                      {parent.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => handleDelete(parent._id)}
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

export default ParentManagement;
