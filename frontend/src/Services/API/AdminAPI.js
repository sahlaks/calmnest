import { axiosInstanceAdmin, axiosInstanceDoctor } from "../AxiosConfig"

export const fetchParents = async () => {
    const res = await axiosInstanceAdmin.get('/api/admin/fetch-parents',{withCredentials: true})
    console.log(res);
    return res
    
}

export const blockParent = async (parentId) => {
    try {
      const res = await axiosInstanceAdmin.put(`/api/admin/block-parent/${parentId}`, {}, { withCredentials: true });
      return res;
    } catch (err) {
      console.error('Error blocking/unblocking parent:', err);
      throw err; 
    }
  };


export const deleteParent = async (parentId) => {
    try{
        const res = axiosInstanceAdmin.delete(`/api/admin/delete-parent/${parentId}`,{},{withCredentials: true});
        console.log(res);
        
        return res;
    }catch(err){
        console.error('Error blocking/unblocking parent:', err);
      throw err;
    }
}

export const fetchDoctors = async () => {
    const res = await axiosInstanceAdmin.get('/api/admin/fetch-doctors',{withCredentials: true})
    console.log(res);
    return res
}

export const blockDoctor = async (id) => {
    try {
        const response = await axiosInstanceAdmin.put(`/api/admin/doctor/${id}/block`,{},{withCredentials: true});
        return response.data;
      } catch (error) {
        console.error('Error blocking doctor:', error);
        throw error;
      }
}

export const verifyDoctor = async (id) => {
    try {
        const response = await axiosInstanceAdmin.post(`/api/admin/doctor/${id}/verify`,{},{withCredentials: true});
        return response.data;
      } catch (error) {
        console.error('Error verifying doctor:', error);
        throw error;
      }
}

export const deleteDoctor = async (id) => {
    try {
        const response = await axiosInstanceAdmin.delete(`/api/admin/doctor/${id}/delete`,{},{withCredentials: true});
        return response.data;
      } catch (error) {
        console.error('Error deleting doctor:', error);
        throw error;
      }
}

