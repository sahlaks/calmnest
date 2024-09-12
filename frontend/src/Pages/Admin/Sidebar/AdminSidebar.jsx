import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, CssBaseline, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../../Redux/Slice/authSlice';

const drawerWidth = 240;

const AdminSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const handleAdminLogout = async () => {
      dispatch(adminLogout())
      navigate('/admin')
    }

        return (
            <div className="w-30 h-screen bg-[#323232] text-white p-4 flex flex-col">
              <div className=" mb-4 mt-16 flex flex-row justify-around">
                <div>
                <Link to="/admin/dashboard" className="hover:text-gray-400">
                Dashboard 
                </Link>
                </div>
                <div>
                <Link to="/admin/dashboard" className="hover:text-gray-400">
                <DashboardIcon />
                </Link>
                </div>
              </div >

              <div className="mb-4 flex flex-row justify-around">
                <div>
                <Link to="/admin/parents" className="hover:text-gray-400">
                Parents 
                </Link>
                </div>
                <div>
                <Link to="/admin/parents" className="hover:text-gray-400">
                <PeopleIcon />
                </Link>
                </div>
              </div>

              <div className="mb-4 flex flex-row justify-around">
              <div>
                <Link to="/admin/doctors" className="hover:text-gray-400">
                Doctors 
                </Link>
                </div>
                <div>
                <Link to="/admin/doctors" className="hover:text-gray-400">
                <LocalHospitalIcon />
                </Link>
                </div>
              </div>

              <div className="mb-4 flex flex-row justify-around" onClick={handleAdminLogout}>
              <div>
                <Link to="#" className="hover:text-gray-400" onClick={e => e.preventDefault()}>
                Logout
                </Link>
                </div>
                <div>
                <Link to="#" className="hover:text-gray-400"onClick={e => e.preventDefault()}>
                <LogoutIcon/>
                </Link>
                </div>
              </div>
          </div>      
          );
};

export default AdminSidebar

