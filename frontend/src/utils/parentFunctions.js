
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