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