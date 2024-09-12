import React from 'react'
import { Button,TextField,InputAdornment} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SpaIcon from '@mui/icons-material/Spa';
import { useNavigate } from 'react-router-dom';


function SectionTwo() {
  const navigate = useNavigate()
  return (
    <>
    <div className="flex flex-col md:flex-row p-8">
        <div className="flex flex-col md:w-1/2 p-8">
            <h1 className="text-6xl font-bold">How CalmNest Works?</h1>
            <h2 className="text-2xl mt-1">
            We offer a supportive environment that helps children and parents navigate challenges with confidence and care.
            </h2>
            <h2 className="text-2xl mt-2">
            Introducing CalmNest, your dedicated 
            online health platform designed to prioritize your kid’s emotional well-being. 
            With a user-centered approach, our platform offers a seamless 3-step process.
            </h2>
        </div>
  
        <div className="flex flex-col md:w-1/2 p-10 justify-center items-center">
            <TextField className='thirdsection' 
                value={'Search Therapist'} 
                size='large' 
                InputProps={{
            startAdornment: (
            <InputAdornment position="start" style={{color:'#FAF5E9'}}>
              <SearchIcon />
            </InputAdornment>
            ),
            style: { color: '#FAF5E9', backgroundColor: '#323232' ,marginBottom:'50px'},
            }}/>

            <TextField value={'Schedule Time'} 
                size='large' 
                className='thirdsection'
                InputProps={{
            startAdornment: (
            <InputAdornment position="start" style={{color:'#FAF5E9'}}>
              <CalendarTodayIcon />
            </InputAdornment>
            ),
            style: { color: '#FAF5E9', backgroundColor: '#323232' ,marginBottom:'50px'},
            }}/>

            <TextField value={'Start Therapy'} 
                size='large'
                className='thirdsection' 
                InputProps={{
            startAdornment: (
            <InputAdornment position="start" style={{color:'#FAF5E9'}}>
               <SpaIcon />
            </InputAdornment>
            ),
            style: { color: '#FAF5E9', backgroundColor: '#323232' ,marginBottom:'40px'},
            }}/>
        
            <Button className="hover:bg-gray-200 px-4 py-2 rounded-md shadow-md" style={{color:'#FAF5E9',backgroundColor:'#323232'}} onClick={()=>navigate('/find-doctor')}>
            Book Now
            </Button>
        </div>
    </div>

    </>
  )
}

export default SectionTwo