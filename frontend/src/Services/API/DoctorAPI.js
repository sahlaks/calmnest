import { axiosInstanceDoctor } from "../AxiosConfig";

export const handleLogoutDoctor = async() => {
    try {
        const response = await axiosInstanceDoctor.post('/api/doctor/logout',{},{withCredentials:true});
        if (response.status === 200) {
            window.localStorage.removeItem('doctorData');
            window.localStorage.removeItem('isLoggin');
            window.localStorage.removeItem('role');
          window.location.href = '/';
        }
      } catch (error) {
        console.error('An error occurred during logout:', error);
      }
}

export async function generateDoctorAccessToken(){
    try{
      console.log('generateaccess token');
      
      const response = await axiosInstanceDoctor.post('/api/doctor/refreshToken',{},{withCredentials: true})
      console.log(response)
      
    }catch(error){
  
    }
  }

  export const saveTimeSlots = async (slotsArray) => {
    try {
        console.log('api',slotsArray);
        
      const response = await axiosInstanceDoctor.post(`/api/doctor/slots`, {slots: slotsArray}, { withCredentials: true });

      return response.data;
    } catch (error) {
      console.error('Error saving time slots:', error);
      throw error;
    }
  };

  export const fetchSlotsFromDB = async () => {
    try {
    const res = await axiosInstanceDoctor.get('/api/doctor/fetchslots', { withCredentials: true });
    return res.data
  } catch (error) {
    console.error('Error saving time slots:', error);
    throw error;
  }
}

export const updateSlotAvailability = async (slotId, isAvailable) => {
  const res = await axiosInstanceDoctor.put(`/api/doctor/${slotId}/availability`, { isAvailable }, {withCredentials: true})
  return res;
}

export const deleteSlot = async (slotId) => {
  const res = await axiosInstanceDoctor.delete(`/api/doctor/${slotId}/delete`,{withCredentials: true});
  return res;
}

export const getAppointments = async () => {
  const res = await axiosInstanceDoctor.get('/api/doctor/getappointments',{withCredentials: true})
  return res.data;
}

export const changeStatus = async (appointmentId, newStatus) => {
  const response = await axiosInstanceDoctor.put(`/api/doctor/${appointmentId}/status`, { status: newStatus }, {withCredentials: true});
  return response.data
}

export const getNotifications = async (doctorId) => {
  try{
    const result = await axiosInstanceDoctor.get(`/api/doctor/notifications/${doctorId}`,{withCredentials: true});
    return result.data
  }catch(error){
    console.error('Error in fetching notifications', error);
    throw error;
}
}

/*.....................................read or unread.........................................*/
export const changeToRead = async (notificationId) => {
  console.log(notificationId);
  const res = await axiosInstanceDoctor.post('/api/doctor/mark-notification-read', { notificationId }, {withCredentials: true});
  console.log(res);
}