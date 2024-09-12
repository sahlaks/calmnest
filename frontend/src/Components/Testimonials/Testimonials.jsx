import React from 'react'
import { TextField } from '@mui/material';
import './Testimonials.css'

function Testimonials() {

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
            {testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className='max-w-xs rounded-lg shadow-lg overflow-hidden p-4 bg-[#FAF5E9]'>
                <TextField
                value={testimonial.review}
                size='small'
                fullWidth
                multiline
                className='testimonial'
                InputProps={{
                    readOnly: true,
                    style: { fontStyle: 'italic' }
                }}
                />
                <h4 className='text-2xl mt-2 text-center'>{testimonial.parent}</h4>
            </div>
            ))}
            </div>
        </div> 

    </>
  )
}

export default Testimonials