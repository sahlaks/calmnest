import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../../Components/Loading/Loading";
import HeaderSwitcher from "../../../Components/Header/HeadSwitcher";
import "./DoctorLists.css";
import Footer from "../../../Components/Footer/Footer";
import Pagination from "../../../Components/Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllDoctors } from "../../../utils/parentFunctions";
import defaultImage from "../../../assets/images/image.jpg";

function DoctorLists() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchDoctors = async (page = 1, search= '') => {
    try {
      const response = await fetchAllDoctors(page,search);

      if (response.success) {
        setDoctors(response.data.doctors);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleViewProfile = (doctorId) => {
    navigate(`/doctor-details/${doctorId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDoctors(page);
  };

  return (
    <div>
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <HeaderSwitcher />
        {loading ? (
          <Loading />
        ) : (
          <div className="mt-8">
            
            <div className="flex justify-center mt-5">
              <input
                type="text"
                placeholder="Search by doctor's name"
                className="search-input px-4 py-2 border rounded-lg w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="doctor-list">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="doctor-card">
                  <img src={doctor.image || defaultImage} alt={doctor.doctorName} className="doctor-image" />
                  <h3 className="text-xl font-bold">Dr. {doctor.doctorName}</h3>
                  <button 
                    className="appointment-btn" 
                    onClick={() => handleViewProfile(doctor._id)}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
            <Pagination 
              currentPage={currentPage} 
              totalPages={pagination.totalPages || 1} 
              onPageChange={handlePageChange} 
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default DoctorLists;
