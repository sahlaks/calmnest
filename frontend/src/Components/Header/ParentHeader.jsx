import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../Public/calmnestcrop.png';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../Services/AxiosConfig';
import { parentLogout } from '../../Redux/Slice/authSlice';
import { changeToRead, getNotifications } from '../../utils/parentFunctions';

function ParentHeader() {
  const userId = useSelector(state => state.auth.parentData?._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]); 
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false); 
  const [unreadCount, setUnreadCount] = useState(0);

  
  useEffect(() => {
      fetchNotifications();
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(userId)
      if (response.success) {
        console.log(response.data);
        
        const unread = response.data.filter(notification => !notification.isRead).length;
        setNotifications(response.data);
        console.log(unread);
        
        setUnreadCount(unread);
        console.log(unreadCount);
        
      }
    } catch (error) {
      console.log('Failed to fetch notifications:', error);
    }
  };

  const handleRead = async (notificationId) => {
    try {
     await changeToRead(notificationId);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.log('Failed to mark notification as read:', error);
    }
  };


  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/api/parents/logout', { userId }, { withCredentials: true });
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

  const handleNotificationsOpen = () => {
    setOpenNotificationsModal(true);
  };

  const handleNotificationsClose = () => {
    setOpenNotificationsModal(false);
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

          {/* Nav Items for Desktop */}
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
            <Link onClick={handleNotificationsOpen} style={linkStyle}>
            <Badge badgeContent={unreadCount} color="primary">
              Notifications
            </Badge>
            </Link>
          </div>

          {/* Menu Icons for Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <IconButton onClick={handleMenuOpen} style={{ color: '#323232' }}>
              <MenuIcon />
            </IconButton>
            <IconButton color="inherit" style={{ color: '#323232' }} onClick={handleNotificationsOpen}>
            <Badge badgeContent={unreadCount} color="primary">
              <NotificationsIcon />
            </Badge>
            </IconButton>
          </div>

          {/* Dropdown Menu for Mobile */}
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

      {/* Notification Modal */}
      <Dialog open={openNotificationsModal} onClose={handleNotificationsClose} fullWidth maxWidth="sm">
        <DialogTitle className='text-2xl font-bold'>Notifications</DialogTitle>
        <DialogContent>
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <ListItem key={notification._id}
                onClick={() => handleRead(notification._id)}
                style={{
                  backgroundColor: notification.isRead ? '#FAF5E9' : '#ddd0c8', 
                  cursor: 'pointer',
                  borderBottom: '1px solid #ccc',
                  padding: '16px',
                  marginBottom: '8px'
                }}>
                  <ListItemText primary={notification.message} secondary={new Date(notification.createdAt).toLocaleString()} />
                </ListItem>
              ))
            ) : (
              <p>No notifications available.</p>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ParentHeader;
