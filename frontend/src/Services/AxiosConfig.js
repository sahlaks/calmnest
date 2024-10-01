import axios from 'axios'
import { toast } from 'react-toastify';
import store from '../Redux/Store';
import { parentLogout } from '../Redux/Slice/authSlice';
import {generateAccessToken, handleLogout} from '../utils/parentFunctions'
import { generateDoctorAccessToken, handleLogoutDoctor } from './API/DoctorAPI';

/*.............................................parent.............................................*/
const axiosInstance = axios.create({
    baseURL:'http://localhost:5000',
    headers:{
        'Content-Type':'application/json'
    },
})


axiosInstance.interceptors.response.use((response) => {
    console.log('Response Interceptor:', response);
    return response;
},        
    async (error) => {
        console.error('Response Error:', error);
        const originalRequest = error.config;
        if(error.response){
            const status = error.response.status;
            if (status === 401) {
                if (error.response.data.message === 'Refresh Token Expired') {
                    toast.error('Please login to access this page')
                    await handleLogout()
                }  else if (error.response.data.message === 'Access Token Expired' && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        await generateAccessToken()
                        return axiosInstance(originalRequest)
                    } catch (refreshError) {
                        toast.error('Unable to refresh access token. Please log in again.');
                        return Promise.reject(refreshError);
                    }
                } 
            } else if (status === 403) {
                toast.error('Access denied. Please log in.');
                await handleLogout()
            } else if (status === 500) {
                toast.error('Internal server error. Please try again later.');
            }
        } else {
            toast.error('Network error. Please check your connection.');  
        } 
         return Promise.reject(error)
    }
)


/*................................................doctor......................................................*/
const axiosInstanceDoctor = axios.create({
    baseURL:'http://localhost:5000',
    headers:{
        'Content-Type':'application/json'
    }
})

axiosInstanceDoctor.interceptors.response.use((response) => {
    console.log('Response Interceptor:', response);
    return response;
},        
    async (error) => {
        console.error('Response Error:', error);
        const originalRequest = error.config;
        if(error.response){
            const status = error.response.status;
            if (status === 401) {
                if (error.response.data.message === 'Refresh Token Expired') {
                    toast.error('Refresh Token Expired')
                    await handleLogoutDoctor()
                }  else if (error.response.data.message === 'Access Token Expired' && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        await generateDoctorAccessToken()
                        return axiosInstanceDoctor(originalRequest)
                    } catch (refreshError) {
                        toast.error('Unable to refresh access token. Please log in again.');
                        return Promise.reject(refreshError);
                    }
                } 
            } else if (status === 403) {
                toast.error('Access denied. Please log in.');
                await handleLogoutDoctor()
            } else if (status === 500) {
                toast.error('Internal server error. Please try again later.');
            } else if(status===400 && error.response.data.message === 'Id is not there'){
               toast.error('Access denied. Please log in!') 
            }
        } else {
            toast.error('Network error. Please check your connection.');  
        } 
         return Promise.reject(error)
    }
)


/*.............................................admin.............................................*/
const axiosInstanceAdmin = axios.create({
    baseURL:'http://localhost:5000',
    headers:{
        'Content-Type':'application/json'
    }
})

axiosInstanceAdmin.interceptors.response.use((response) => {
    if (response.data && response.data.message) {
        toast.success(response.data.message)
    }
    return response;
},        
    async (error) => {
        console.error('Response Error:', error);
        if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message); 
          } else {
            toast.error('An unexpected error occurred.'); 
          }
        return Promise.reject(error)
   }
)



export {axiosInstance,axiosInstanceDoctor,axiosInstanceAdmin}