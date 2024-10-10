import React, { useEffect, useState } from "react";
import Loading from "../../../Components/Loading/Loading";
import { getAppointments } from "../../../utils/parentFunctions";
import ParentHeader from "../../../Components/Header/ParentHeader";
import Footer from "../../../Components/Footer/Footer";
import Pagination from "../../../Components/Pagination/Pagination";
import FeedbackButton from "../../../Components/Feedback/FeedbackButton";


function ShowAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const fetchAppointments = async (page = 1, limit = 6) => {
    try {
      const response = await getAppointments(page, limit);
      if (response.success) {
        setAppointments(response.data);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
      } else {
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchAppointments(page);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
      <ParentHeader />
      <div className="min-h-screen flex flex-col">
        {loading ? (
          <Loading />
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-5 text-center mt-20">
              Appointments Details
            </h1>

            {/* Table layout for large screens */}
            <div className="hidden md:flex flex-col items-center justify-center mt-2 mb-10">
              {appointments.length === 0 ? (
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-700">
                    No Appointments created yet!
                  </p>
                </div>
              ) : (
                <div className="w-full md:w-3/4 lg:w-2/3">
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
                          Doctor
                        </th>
                        <th className="border-r border-black-300 px-4 py-2 text-center">
                          Fees
                        </th>
                        <th className="border-r border-black-300 px-4 py-2 text-center">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment, index) => (
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
                            {appointment.doctorName}
                          </td>
                          <td className="border-r border-black-300 px-4 py-2 text-center">
                            {appointment.fees}
                          </td>
                          <td
                            className={`border-r border-black-300 px-4 py-2 text-center ${getStatusClass(appointment.appointmentStatus)}`}
                          >
                            {appointment.appointmentStatus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Card layout for small and medium screens */}
            <div className="md:hidden p-4">
              {appointments.length === 0 ? (
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-700">
                    No Appointments created yet!
                  </p>
                </div>
              ) : (
                appointments.map((appointment, index) => (
                  <div
                    key={appointment._id}
                    className="border border-[#FAF5E9]-500 shadow-lg p-4 mb-4 bg-[#DDD0C8]"
                  >
                    <p>
                      <strong>No:</strong> {index + 1}
                    </p>
                    <p>
                      <strong>Date:</strong> {appointment.date}
                    </p>
                    <p>
                      <strong>Start Time:</strong> {appointment.startTime}
                    </p>
                    <p>
                      <strong>End Time:</strong> {appointment.endTime}
                    </p>
                    <p>
                      <strong>Doctor:</strong> {appointment.doctorName}
                    </p>
                    <p>
                      <strong>Fees:</strong> {appointment.fees}
                    </p>
                    <p
                      className={getStatusClass(appointment.appointmentStatus)}
                    >
                      <strong>Status:</strong> {appointment.appointmentStatus}
                    </p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
        <FeedbackButton/>
        <Footer />
      </div>
    </>
  );
}

export default ShowAppointments;
