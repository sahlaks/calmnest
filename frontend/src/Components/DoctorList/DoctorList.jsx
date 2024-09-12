import React, { useEffect } from 'react'
import doc from '../../Public/doc5.jpg';
import { Button } from '@mui/material';
import { displayDoctors } from '../../utils/parentFunctions';
function DoctorList() {
  
  useEffect(()=>{
    const fetchDoctors = async () => {
        const response = await displayDoctors()
        console.log(response);
        

    }
    fetchDoctors()
  },[])

    const doctors = [
        {
          name: 'Dr. Sarah Johnson',
          image: doc, 
        },
        {
          name: 'Dr. Michael Smith',
          image: doc, 
        },
        {
          name: 'Dr. Emily Davis',
          image: doc, 
        },
      ];

  return (
    <>
        <div className='flex flex-col justify-center items-center text-center'>
            <h2 className='text-6xl font-bold'>Meet our consultant exparts</h2>
            <div className="flex flex-wrap justify-center gap-8 p-8">
                {doctors.map((doctor, index) => (
                <div key={index} className="max-w-xs rounded-lg shadow-lg overflow-hidden bg-white">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-48 object-cover"
                />
                    <div className="p-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">{doctor.name}</h2>
                    </div>
                <Button className="hover:bg-gray-200 px-4 py-2 rounded-lg shadow-md " size='small' style={{color:'#FAF5E9',backgroundColor:'#323232',marginBottom:'15px'}}>
                Make Appointment
                </Button>
                </div>
                ))}
            </div>
        </div>

    </>
  )
}

export default DoctorList