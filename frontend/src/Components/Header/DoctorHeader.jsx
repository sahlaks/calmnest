import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../Public/calmnestcrop.png';
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { axiosInstanceDoctor } from '../../Services/AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { doctorLogout } from '../../Redux/Slice/authSlice';

function DoctorHeader() {
  const doctorId = useSelector((state) => state.auth.doctorData?._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstanceDoctor.post('/api/doctor/logout', { doctorId }, { withCredentials: true });
      if (response.data.success) {
        dispatch(doctorLogout());
        navigate('/');
      }
    } catch (error) {
      console.log('Logout failed:', error);
    }
  };

  const linkStyle = { color: '#323232', textDecoration: 'none' };

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Planner', path: '/planner' },
    { text: 'Consultations', path: '/consultation' },
    { text: 'Chat', path: '/chat' },
    { text: 'My Profile', path: '/doctor-profile' },
    { text: 'Logout', path: '#', action: handleLogout },
  ];

  return (
    <>
      <AppBar position="fixed" style={{ backgroundColor: '#FAF5E9', borderRadius: '5px' }}>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          {/* Logo Section */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt="CalmNest Logo" style={{ height: '60px', width: 'auto', marginRight: '16px' }} />
          </div>

          {/* Navigation Links for Medium and Larger Screens */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) =>
              item.action ? (
                <Link key={item.text} to={item.path} onClick={item.action} style={linkStyle}>
                  {item.text}
                </Link>
              ) : (
                <Link key={item.text} to={item.path} style={linkStyle}>
                  {item.text}
                </Link>
              )
            )}
             <Link style={linkStyle}>Notifications</Link>
          </div>

          {/* Menu Icon and Notification Icon for Smaller Screens */}
          <div className="md:hidden flex items-center space-x-2">
            <IconButton onClick={handleMenuOpen} style={{ color: '#323232' }}>
              <MenuIcon />
            </IconButton>
            <IconButton style={{ color: '#323232' }}>
              <NotificationsIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Dropdown Menu for Smaller Screens */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            backgroundColor: '#FAF5E9',
            color: '#323232',
            borderRadius: '5px',
          },
        }}
      >
        {navItems.map((item) => (
          <MenuItem key={item.text} onClick={item.action || handleMenuClose}>
            <Link to={item.path} style={linkStyle}>
              {item.text}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default DoctorHeader;
