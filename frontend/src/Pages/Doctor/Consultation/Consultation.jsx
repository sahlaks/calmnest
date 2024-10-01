import React, { useEffect, useState } from "react";
import Footer from "../../../Components/Footer/Footer";
import DoctorHeader from "../../../Components/Header/DoctorHeader";
import Loading from "../../../Components/Loading/Loading";
import { toast } from "react-toastify";
import { changeStatus, getAppointments } from "../../../Services/API/DoctorAPI";
import CustomPopup from "../../../Components/CustomPopUp/CustomPopup";

function Consultation() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [appointmentList, setAppointmentList] = useState([]);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getAppointments();
        if (res.success) {
          setAppointments(res.data);
          setAppointmentList(res.data);
          toast.success(res.message, { className: "custom-toast" });
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Error fetching appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const updatedAppointments = appointmentList.map((appointment) =>
        appointment._id === appointmentId
          ? { ...appointment, appointmentStatus: newStatus }
          : appointment
      );
      setAppointmentList(updatedAppointments);
      setAppointments(updatedAppointments);
      const response = await changeStatus(appointmentId, newStatus);
      if (response.success) {
        toast.success(`Appointment status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update the appointment status");
        setAppointmentList(appointments);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Error updating appointment status");
      setAppointmentList(appointments);
    }
  };

  const handleCancel = (appointmentId) => {
    setAppointmentToCancel(appointmentId);
    setShowCancelPopup(true);
  };

  const confirmCancel = async () => {
    if (appointmentToCancel) {
      await updateAppointmentStatus(appointmentToCancel, "Cancelled");
      setAppointmentToCancel(null);
      setShowCancelPopup(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-800";
      case "Scheduled":
        return "text-blue-800";
      case "Completed":
        return "text-green-800";
      case "Cancelled":
        return "text-red-800";
      default:
        return "";
    }
  };

  return (
    <>
      <DoctorHeader />
      <div className="min-h-screen flex flex-col">
        {loading ? (
          <Loading />
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-5 text-center mt-20">
              Appointments Details
            </h1>

            {/* Table view for large screens */}
            <div className="hidden lg:block w-full md:w-3/4 lg:w-2/3 mx-auto">
              {appointmentList.length === 0 ? (
                <p className="text-center text-xl font-bold">
                  No Appointments created yet!
                </p>
              ) : (
                <table className="table-auto border-collapse border border-black-300 w-full bg-[#DDD0C8]">
                  <thead>
                    <tr className="border-b border-black-300 bg-[white]">
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        No.
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        Date
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        Start Time
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        End Time
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        Child
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        Parent
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        Status
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentList.map((appointment, index) => (
                      <tr key={appointment._id}>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {appointment.date}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {appointment.startTime}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {appointment.endTime}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {appointment.name}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {appointment.parentName}
                        </td>
                        <td
                          className={`border-r border-black-300 px-4 py-2 text-center ${getStatusClass(
                            appointment.appointmentStatus
                          )}`}
                        >
                          {appointment.appointmentStatus}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {appointment.appointmentStatus === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment._id,
                                    "Scheduled"
                                  )
                                }
                                className="bg-[#323232] hover:bg-gray-700 text-white py-1 px-4 rounded"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleCancel(appointment._id)}
                                className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded ml-2"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {appointment.appointmentStatus === "Scheduled" && (
                            <button
                              onClick={() => handleCancel(appointment._id)}
                              className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded"
                            >
                              Cancel
                            </button>
                          )}
                          {appointment.appointmentStatus === "Cancelled" && (
                            <span>No actions available</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Card view for medium and small screens */}
            <div className="block lg:hidden w-full px-4 md:w-3/4 lg:w-2/3 mx-auto mb-10">
              {appointmentList.length === 0 ? (
                <p className="text-center text-xl font-bold">
                  No Appointments created yet!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appointmentList.map((appointment, index) => (
                    <div
                      key={appointment._id}
                      className="bg-[#DDD0C8] p-4 rounded-sm shadow-md border border-gray-300"
                    >
                      <div className="mb-4">
                        <span className="font-semibold">No: </span>
                        {index + 1}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Date: </span>
                        {appointment.date}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Start Time: </span>
                        {appointment.startTime}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">End Time: </span>
                        {appointment.endTime}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Child: </span>
                        {appointment.name}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Parent: </span>
                        {appointment.parentName}
                      </div>
                      <div
                        className={`mb-4 ${getStatusClass(
                          appointment.appointmentStatus
                        )}`}
                      >
                        <span className="font-semibold">Status: </span>
                        {appointment.appointmentStatus}
                      </div>
                      <div className="flex justify-between">
                        {appointment.appointmentStatus === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment._id,
                                  "Scheduled"
                                )
                              }
                              className="bg-[#323232] hover:bg-gray-700 text-white py-1 px-2 rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleCancel(appointment._id)}
                              className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.appointmentStatus === "Scheduled" && (
                          <button
                            onClick={() => handleCancel(appointment._id)}
                            className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                          >
                            Cancel
                          </button>
                        )}
                        {appointment.appointmentStatus === "Cancelled" && (
                          <span>No actions available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />

      {/* Custom Popup for confirming cancellation */}
      {showCancelPopup && (
        <CustomPopup
          title="Confirm Cancellation"
          message="Are you sure you want to cancel this appointment?"
          onConfirm={confirmCancel}
          onCancel={() => setShowCancelPopup(false)}
        />
      )}
    </>
  );
}

export default Consultation;
