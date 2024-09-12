import React, { useEffect, useState } from "react";
import HeaderSwitcher from "../../../Components/Header/HeadSwitcher";
import Loading from "../../../Components/Loading/Loading";
import { useLocation } from "react-router-dom";
import { ChildDetails } from "../../../utils/parentFunctions";
import { toast } from "react-toastify";
import Footer from "../../../Components/Footer/Footer";

function ConfirmAppointment() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const appointment = location.state?.appointment;
  const doctor = location.state?.details;
  const [children, setChildren] = useState([]);

  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        setLoading(true);
        const response = await ChildDetails();
        if (response.data.success) {
          setChildren(response.data.child);
          setLoading(false);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch child details:", error);
        toast.error("Failed to load child details");
      } finally {
        setLoading(false);
      }
    };

    fetchChildDetails();
  }, []);

  const [newChild, setNewChild] = useState({
    name: "",
    age: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChild((prevChild) => ({
      ...prevChild,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <HeaderSwitcher />
      <div className="flex flex-row mt-10 md:mt-10">
        {loading ? (
          <Loading />
        ) : (
          <div className="text-center bg-[#DDD0C8] shadow-lg rounded-lg p-5 mt-10">
            <h1 className="text-3xl font-bold mb-5">
              Appointment Confirmation
            </h1>
            {appointment && doctor ? (
              <div className="space-y-1">
                <p className="text-xl font-bold">
                  Doctor Name:{" "}
                  <span className="font-normal">Dr. {doctor.doctorName}</span>
                </p>
                <p className="text-xl font-bold">
                  Specialization:{" "}
                  <span className="font-normal">{doctor.specialization}</span>
                </p>
                <p className="text-xl font-bold">
                  Fees: <span className="font-normal">{doctor.fees}</span>
                </p>
                <div className="bg-white shadow-lg rounded-lg p-4">
                  <p className="text-xl font-bold">
                    Date:{" "}
                    <span className="font-normal">{appointment.date}</span>
                  </p>
                  <p className="text-xl font-bold">
                    Time:{" "}
                    <span className="font-normal">
                      {appointment.startTime} - {appointment.endTime}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <p>No appointment details available.</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 bg-[#DDD0C8] shadow-lg rounded-lg p-6 text-left mb-5">
        <h2 className="text-2xl font-semibold mb-4">Appointment for Child</h2>
        {children && children.length > 0 ? (
          <div>
            {children.length > 1 ? (
              <div className="mb-4">
                <label htmlFor="child" className="text-xl font-bold">
                  Select Child:
                </label>
                <select
                  id="child"
                  className="w-full mt-2 p-2 border rounded-md"
                >
                  {children.map((child) => (
                    <option key={child._id} value={child._id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-xl font-bold mb-4">
                Child: <span className="font-normal">{children[0]?.name}</span>
              </p>
            )}

            <div className="mb-4">
              <label htmlFor="age" className="text-xl font-bold">
                Child's Age:
              </label>
              <input
                id="age"
                type="number"
                defaultValue={children.length === 1 ? children[0]?.age : ""}
                className="w-full mt-2 p-2 border rounded-md"
                placeholder="Enter age"
              />
            </div>
          </div>
        ) : (
          <div className="mb-5">
            <p>
              No child data available. Please enter the child details below:
            </p>

            <div className="mt-4">
              <label htmlFor="childName" className="text-xl font-bold">
                Child's Name:
              </label>
              <input
                id="childName"
                name="name"
                type="text"
                value={newChild.name}
                onChange={handleInputChange}
                className="w-full mt-2 p-2 border rounded-md"
                placeholder="Enter child's name"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="childAge" className="text-xl font-bold">
                Child's Age:
              </label>
              <input
                id="childAge"
                name="age"
                type="number"
                value={newChild.age}
                onChange={handleInputChange}
                className="w-full mt-2 p-2 border rounded-md"
                placeholder="Enter child's age"
              />
            </div>
          </div>
        )}
      </div>
      <button className="bg-[#323232] text-white px-6 py-3 rounded-lg mb-5">Proceed To Payment</button>
      <Footer />
    </div>
  );
}

export default ConfirmAppointment;
