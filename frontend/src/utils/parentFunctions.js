
import {axiosInstance} from '../Services/AxiosConfig';

export async function handleLogout() {

  try {
    const response = await axiosInstance.post('/api/parents/logout',{},{withCredentials:true});
    if (response.status === 200) {
        window.localStorage.removeItem('parentData');
        window.localStorage.removeItem('isLoggin');
        window.localStorage.removeItem('role');
      window.location.href = '/';
    }
  } catch (error) {
    console.error('An error occurred during logout:', error);
  }
}

/*................................refresh access token...............................*/
export async function generateAccessToken(){
  try{
    console.log('generateaccess token');
    
    const response = await axiosInstance.post('/api/parents/refreshToken',{},{withCredentials: true})
    console.log(response)
    
  }catch(error){

  }
}

/*..............................remove kid with id...........................................*/
export async function removeKidWithId(kidId){
  console.log(kidId,'in funct');
  try{
    const response = await axiosInstance.delete(`api/parents/remove-kid/${kidId}`,{withCredentials: true})
    return response
  }catch(error){
     console.error('Error removing kid:', error);
    throw error; 
  }
  
}

/*......................................................all doctors.........................................................*/
export const fetchAllDoctors = async (page = 1, search = '') => {
  try {
    const res = await axiosInstance.get('/api/fetch-doctors', {
      params: {
        page,
        limit: 6,
        search
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error; 
  }
};

/*................................................doctor details....................................................*/
export const doctorDetails = async (docId) => {
  try{
    const res = await axiosInstance.get(`/api/parents/details/${docId}/doctor`,{withCredentials: true})
    console.log(res);
    return res;
    
  }catch(error){
    console.error("Error fetching doctor details:", error);
    throw error; 
  }
}

/*..............................................................child details...............................................*/
export const ChildDetails = async () => {
  try{
    const res = await axiosInstance.get('/api/parents/child-details',{withCredentials: true})
    console.log(res);
    return res

  }catch(error){
    console.error("Error fetching child details:", error);
    throw error; 
  }
  
}

/*......................................three doctors per page.........................................*/
export const displayDoctors = async (page = 1) => {
  try {
    const res = await axiosInstance.get('/api/fetch-doctors', {
      params: {
        page,
        limit: 3
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error; 
  }
};

/*................................stripe route...................................*/
export const stripeCall = async (paymentData, details) => {
  const requestBody = {
    ...paymentData,
    ...details,
  };
  const response = await axiosInstance.post("/api/parents/create-checkout-session", requestBody,
    {withCredentials: true}
  );
  return response
}

/*............................................success update.......................................*/
export const fetchAppointmentDetails = async (sessionId) => {
  try {
      const response = await axiosInstance.post(`/api/parents/success/${sessionId}`, {}, { withCredentials: true });
      return response.data;
  } catch (error) {
      console.error('Error fetching appointment details:', error);
      throw error;
  }
}

/*.................................................update failure..........................................*/
export const updateFailure = async (sessionId) => {
  try{
    const response = await axiosInstance.post(`/api/parents/failure/${sessionId}`,{}, {withCredentials: true})
    console.log((response));
    return response.data
  } catch(error) {
      console.error('Error in cancelling appointment', error);
      throw error;
  }
}

/*...............................................get appointments.......................................*/
export const getAppointments =  async() => {
  try{
    const result = await axiosInstance.get('/api/parents/getappointments', { withCredentials: true });
    return result.data
  }catch(error){
    console.error('Error in fetching appointments', error);
    throw error;
  }
}

/*.............................................notifications.................................................*/
export const getNotifications = async (userId) =>{
  try{
    const result = await axiosInstance.get(`/api/parents/notifications/${userId}`,{withCredentials: true});
    return result.data
  }catch(error){
    console.error('Error in fetching notifications', error);
    throw error;
}
}

/*.....................................read or unread.........................................*/
export const changeToRead = async (notificationId) => {
  console.log(notificationId);
  
  const res = await axiosInstance.post('/api/parents/mark-notification-read', { notificationId }, {withCredentials: true});
  console.log(res);
}