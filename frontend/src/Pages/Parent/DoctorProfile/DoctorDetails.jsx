import React, { useEffect, useState } from "react";
import Footer from "../../../Components/Footer/Footer";
import HeaderSwitcher from "../../../Components/Header/HeadSwitcher";
import Loading from "../../../Components/Loading/Loading";
import { Link, useNavigate, useParams } from "react-router-dom";
import { bookAppointment, doctorDetails } from "../../../utils/parentFunctions";
import { toast } from "react-toastify";
import defaultImage from "../../../assets/images/image.jpg";

function DoctorDetails() {
  const { doctorId } = useParams();
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const response = await doctorDetails(doctorId);
        if (response.data.success) {
          setDoctor(response.data.doctor);
          setSlots(response.data.slots);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch doctor details:", error);
        toast.error("Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  
  const handleSlotSelect = (slot) => {
    setSelectedSlot((prevSelectedSlot) =>
      prevSelectedSlot?._id === slot._id ? null : slot
    );
  };

  const handleAppointment = () => {
    if(selectedSlot && doctor){
      console.log('booking slot',selectedSlot)
      toast.success(`Appointment booked for ${selectedSlot.date} at ${selectedSlot.startTime}`, {
        className : 'custom-toast',
      });
      navigate('/confirm-appointment',{
        state: { appointment: selectedSlot,
                  details: doctor
         }
      })
    }else{
      toast.error("Please select a slot before booking.");
    }
  }

  return (
    <>
      <HeaderSwitcher />

      <div className="flex justify-center items-center min-h-screen mt-10 md:mt-15">
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col md:flex-row max-w-6xl w-full items-center justify-center">
            {/*Doctor Details */}
            <div className=" flex flex-col bg-[#DDD0C8] shadow-lg rounded-lg items-center p-6 m-5">
            <h2 className="text-2xl font-semibold text-center">
                Details of Selected Doctor
              </h2>
              <img
                className="w-64 h-64 object-cover rounded-lg mt-4"
                src={doctor?.image || defaultImage}
                alt={doctor?.doctorName || ""}
              />

              {/* Doctor details centered */}
              <div className="text-center">
                <h2 className="text-3xl font-bold">Dr. {doctor?.doctorName}</h2>
                <p className="text-gray-600 mt-2">{doctor?.specialization}</p>
                <p className="mt-4">{doctor?.bio}</p>
              </div>
            </div>

            {/* Right side: Available Slots */}
            <div className=" flex flex-col p-6 bg-[#DDD0C8] shadow-lg rounded-lg items-center">
              <h2 className="text-2xl font-semibold text-center">
                Choose an Appointment Slot
              </h2>
              <div className="mt-5">
                {slots.length > 0 ? (
                  slots.map((slot) => (
                    <label
                      key={slot._id}
                      className={`flex items-center p-4 rounded-lg shadow-md cursor-pointer mb-5`}
                      onClick={() => handleSlotSelect(slot)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSlot?._id === slot._id}
                        readOnly
                        className="form-checkbox text-blue-500"
                      />
                      <div className="ml-4 flex flex-row justify-between w-full">
                        <div className="block font-semibold">{slot.date}</div>
                        <div className="font-bold text-[#323232]">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <p>No available slots.</p>
                )}
              </div>

              <div className="mt-6 text-center">
                <button className="bg-[#323232] text-white px-6 py-3 rounded-lg hover:bg-[#323232]-800" onClick={handleAppointment}>
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    
        <Link to="/find-doctor" className="text-center">
          <p className="text-xl text-blue-500 hover:underline">Back to results</p>
        </Link>
      <Footer />
    </>
  );
}

export default DoctorDetails;
