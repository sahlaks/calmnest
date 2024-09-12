import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../Public/calmnestcrop.png';
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../Services/AxiosConfig';
import { parentLogout } from '../../Redux/Slice/authSlice';

function ParentHeader() {
  const userId = useSelector(state => state.auth.parentDate?._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/api/parents/logout', { userId }, { withCredentials: true });
      console.log(response);
      if (response.data.success) {
        dispatch(parentLogout());
        navigate('/');
      }
    } catch (error) {
      console.log('Logout failed:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const linkStyle = { color: '#323232', textDecoration: 'none' };

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Find Doctor', path: '/find-doctor' },
    { text: 'Appointments', path: '/appointments' },
    { text: 'Chat', path: '/chat' },
    { text: 'My Profile', path: '/myprofile' },
    { text: 'Logout', path: '#', action: handleLogout }, 
  ];

  return (
    <div>
      <AppBar position="fixed" style={{ backgroundColor: '#FAF5E9', borderRadius: '5px' }}>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          {/* Logo Section */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt="CalmNest Logo" style={{ height: '60px', width: 'auto', marginRight: '16px' }} />
          </div>

          
          <div className='hidden md:flex space-x-4'>
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

          {/* Menu Icons */}
          <div className="md:hidden flex items-center space-x-2">
            <IconButton onClick={handleMenuOpen} style={{ color: '#323232' }}>
              <MenuIcon />
            </IconButton>
            <IconButton color="inherit" style={{ color: '#323232' }}>
              <NotificationsIcon />
            </IconButton>
          </div>

          {/* Dropdown Menu */}
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
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default ParentHeader;
