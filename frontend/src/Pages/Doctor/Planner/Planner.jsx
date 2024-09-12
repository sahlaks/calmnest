import React, { useEffect, useState } from "react";
import HeaderSwitcher from "../../../Components/Header/HeadSwitcher";
import Loading from "../../../Components/Loading/Loading";
import { fetchSlotsFromDB } from "../../../Services/API/DoctorAPI";
import { useNavigate } from "react-router-dom";
import Footer from "../../../Components/Footer/Footer";

function Planner() {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const response = await fetchSlotsFromDB();
        console.log(response);
        setSlots(response.slots);
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleCreateSlots = () => {
    navigate('/timeslotform')
  }

  const handleAvailability = (slotId, isAvailable) => {
    
  };

  return (
    <>
      <HeaderSwitcher />
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="hidden md:flex flex-col items-center justify-center mt-20 mb-10">
            <h1 className="text-2xl font-bold mb-5">Selected Time Slots</h1>

            {slots.length === 0 ? (
                <div className="text-center">
                <p className="text-xl font-bold text-gray-700">No slots created yet!</p>
                <button
                  className="mt-4 bg-[#323232] text-white px-4 py-2 rounded"
                  onClick={handleCreateSlots}
                >
                  Create New Slots
                </button>
              </div>

            ) : (

            <div className="w-full md:w-3/4 lg:w-2/3">
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-300">
                    <th className="border-r border-gray-300 px-4 py-2 text-center">No.</th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">Date</th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">Start Time</th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">End Time</th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">Status</th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot, index) => (
                    <tr key={slot._id}>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">{slot.date}</td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">{slot.startTime}</td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">{slot.endTime}</td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        <span  className={`px-2 py-1 rounded ${
                            slot.isAvailable
                            ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}>

                        {slot.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="border-r border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleAvailability(slot._id, slot.isAvailable)}
                          className={`px-1 py-1 rounded bg-[#323232] text-white`}
                        >
                          {slot.isAvailable ? "Make Unavailable" : "Make Available"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            <div className="mt-8 text-center">
                  <button
                    className="bg-[#323232] text-white px-4 py-2 rounded"
                    onClick={handleCreateSlots}
                  >
                    Create More Slots
                  </button>
                </div>
            </div>
            )}
          </div>

            
        
          <div className="md:hidden flex flex-col items-center justify-center mt-20 p-5">
            <h1 className="text-2xl font-bold mb-5">Selected Time Slots</h1>
            <div className="w-full md:w-3/4 lg:w-2/3">
              {slots.map((slot, index) => (
                <div key={slot._id} className="border border-gray-300 shadow-lg p-4 mb-4">
                  <p><strong>Slot {index + 1}</strong></p>
                  <p><strong>Date:</strong> {slot.date}</p>
                  <p><strong>Start Time:</strong> {slot.startTime}</p>
                  <p><strong>End Time:</strong> {slot.endTime}</p>
                  <p><strong>Status:</strong> {slot.isAvailable ? "Available" : "Unavailable"}</p>
                  <button
                    onClick={() => handleAvailability(slot._id, slot.isAvailable)}
                    className={`mt-2 px-4 py-2 bg-[#323232] text-white rounded`}
                  >
                    {slot.isAvailable ? "Make Unavailable" : "Make Available"}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                className="bg-[#323232] text-white px-4 py-2 rounded"
                onClick={handleCreateSlots}
              >
                Create More Slots
              </button>
            </div>
          </div>
            
        </>
      )}
      <Footer/>
    </>
  );
}

export default Planner;
