import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { saveTimeSlots } from "../../Services/API/DoctorAPI";
import HeaderSwitcher from "../Header/HeadSwitcher";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";


function TimeSlotForm() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState({});
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [openSlots, setOpenSlots] = useState({});
  const [savedSlots, setSavedSlots] = useState([]);
  const [showSavedSlots, setShowSavedSlots] = useState(false);
  const navigate = useNavigate()
  
  const handleDateChange = (date) => {
    const alreadySelected = selectedDates.some(
      (selectedDate) => selectedDate.getTime() === date.getTime()
    );
    if (alreadySelected) {
      setSelectedDates(
        selectedDates.filter((d) => d.getTime() !== date.getTime())
      );
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  
  const toggleSlotChooser = (date) => {
    const dateString = date.toDateString();
    setOpenSlots((prevOpenSlots) => ({
      ...prevOpenSlots,
      [dateString]: !prevOpenSlots[dateString],
    }));
  };

  
  const addTimeSlot = (e, date) => {
    e.preventDefault();
    const dateString = date.toDateString();
    const slot = { start: startTime, end: endTime };

    // Validate 
    if (!startTime || !endTime) {
      toast.error("Please select both start time and end time.");
      return;
    }
    if (startTime >= endTime) {
      toast.error("Start time must be earlier than the end time.");
      return;
    }

    setTimeSlots((prevTimeSlots) => ({
      ...prevTimeSlots,
      [dateString]: prevTimeSlots[dateString]
        ? [...prevTimeSlots[dateString], slot]
        : [slot],
    }));

    setStartTime("");
    setEndTime("");
  };

  
  const removeSlot = (dateString, slotIndex) => {
    setTimeSlots((prevTimeSlots) => {
      const updatedSlots = [...prevTimeSlots[dateString]];
      updatedSlots.splice(slotIndex, 1);
      return {
        ...prevTimeSlots,
        [dateString]: updatedSlots,
      };
    });
  };

  
  const handleSaveSlots = () => {
    const slotsArray = Object.entries(timeSlots).map(([date, slots]) => ({
      date,
      slots,
    }));
    if(slotsArray.length === 0){
      toast.error('Select some time slots')
      return
    }
    setSavedSlots(slotsArray);
    setShowSavedSlots(true)
  };

  
  const handleEditSlot = (dateIndex, slotIndex, startOrEnd, value) => {
    const updatedSavedSlots = [...savedSlots];
    updatedSavedSlots[dateIndex].slots[slotIndex][startOrEnd] = value;
    setSavedSlots(updatedSavedSlots);
  };

  const handleSave = async () =>{
    const slotsArray = Object.entries(timeSlots).map(([date, slots]) => ({
      date,
      slots,
    }));
    console.log(slotsArray);
    try{
      const result = await saveTimeSlots(slotsArray);
    if (result.success) {
      toast.success('Time slots saved successfully');
      navigate('/planner')
    } else {
      toast.error('Failed to save time slots');
    }
    }catch(err){
      console.log(err);
      
    }
    
  }

  return (
    <>
    <HeaderSwitcher/>
    <div className="flex flex-col md:flex-row justify-center justify-around mt-20 mb-10">
      
      <div className="flex flex-col items-center p-8 border shadow ">
        <h2 className="text-2xl font-bold mb-7 text-center text-gray-800">
          Generate Time Slots for Multiple Dates
        </h2>

        <form>
          <DatePicker
            selected={null}
            onChange={handleDateChange}
            highlightDates={selectedDates}
            inline
            shouldCloseOnSelect={false}
          />

          <div className="mt-4 text-center">
            <p className="text-xl font-bold">Selected Dates:</p>
            <ul>
              {selectedDates.map((date, index) => {
                const dateString = date.toDateString();
                return (
                  <li key={index}>
                    <div>
                      <strong>{dateString}</strong>
                      <button
                        className="ml-2 text-blue-500"
                        type="button"
                        onClick={() => toggleSlotChooser(date)}
                      >
                        {openSlots[dateString] ? "Close" : "Add Slots"}
                      </button>
                    </div>

                    {openSlots[dateString] && (
                      <div className="mt-2 flex flex-col">
                        <label className="mb-1">Start Time:</label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="border border-gray-300 px-2 py-1 rounded"
                        />

                        <label className="mt-2 mb-1">End Time:</label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="border border-gray-300 px-2 py-1 rounded"
                        />

                        <button
                          className="mt-4 bg-[#323232] text-white px-4 py-2 rounded"
                          onClick={(e) => addTimeSlot(e, date)}
                        >
                          Add Time Slot
                        </button>
                      </div>
                    )}

                    {timeSlots[dateString] && (
                      <ul className="mt-2">
                        {timeSlots[dateString].map((slot, idx) => (
                          <li key={idx} className="flex items-center">
                            <span>
                              {slot.start} - {slot.end}
                            </span>
                            <button
                              type="button"
                              className="ml-2 text-red-500"
                              onClick={() => removeSlot(dateString, idx)}
                            >
                              ✖
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleSaveSlots}
              className="bg-[#323232] text-white px-4 py-2 rounded"
            >
              Save Time Slots
            </button>
          </div>
        </form>
      </div>

      {/* Saved Slots Section */}
      {showSavedSlots && (
        <div className="flex flex-col p-8 mb-10">
          <h2 className="text-2xl font-bold mb-7 text-center text-gray-800">
            Saved Time Slots
          </h2>
            {savedSlots.map((slotData, dateIndex) => (
              <div key={dateIndex} className="mb-4">
                <h3 className="text-lg font-bold">{slotData.date}</h3>
                <ul>
                  {slotData.slots.map((slot, slotIndex) => (
                    <li key={slotIndex} className="mt-2">
                      <label>Start Time: </label>
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) =>
                          handleEditSlot(
                            dateIndex,
                            slotIndex,
                            "start",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 px-2 py-1 rounded"
                      />
                      <label className="ml-2">End Time: </label>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) =>
                          handleEditSlot(
                            dateIndex,
                            slotIndex,
                            "end",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 px-2 py-1 rounded"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          

          <button className="bg-[#323232] text-white px-4 py-2 rounded mt-4" onClick={handleSave}>
            Final Save
          </button>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
}

export default TimeSlotForm;
