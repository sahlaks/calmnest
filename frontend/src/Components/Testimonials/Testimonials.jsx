import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material';
import './Testimonials.css'
import { fetchTestimonials } from '../../Services/API/CommonAPI';


function Testimonials() {
    const [testimonial, setTestimonials] = useState([]);
    
    useEffect(() => {
      const getTestimonials = async () => {
        try {
          const res = await fetchTestimonials();
          if(res.success)
            setTestimonials(res.data)
        } catch (error) {
          console.error('Failed to load testimonials:', error);
        }
      };
      getTestimonials();
    }, []); 

    const testimonials = [
        {
          review: "“You helped change (our son’s) life and ours; we will always be indebted to you!”",
          parent: "DS-Dad"
        },
        {
          review: "“Your support has made a world of difference in our family’s life. Thank you!”",
          parent: "JS-Mom"
        },
        {
          review: "“We couldn’t have done it without you. Your help has been invaluable.”",
          parent: "MS-Dad"
        },
        {
          review: "“The progress we've seen is incredible, all thanks to your guidance.”",
          parent: "KS-Mom"
        }
      ];


  return (
    <>
        <div className='flex flex-col bg-[#DDD0C8]'>
            <div className='flex flex-wrap justify-evenly gap-5 p-5'>
            {testimonial.map((feedback) => (
            <div key={feedback._id} className='max-w-xs rounded-lg shadow-lg overflow-hidden p-4 bg-[#FAF5E9]'>
                <TextField
                value={feedback.message}
                size='small'
                fullWidth
                multiline
                className='testimonial'
                InputProps={{
                    readOnly: true,
                    style: { fontStyle: 'italic' }
                }}
                />
                <h4 className='text-2xl mt-2 text-center'>- {feedback.parentId?.parentName}</h4>
            </div>
            ))}
            </div>
        </div> 

    </>
  )
}

export default Testimonials