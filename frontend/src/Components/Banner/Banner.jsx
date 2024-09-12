import React from 'react';
import { Button, Container } from '@mui/material';
import BannerImage from '../../Public/kid.jpg';
import { useNavigate } from 'react-router-dom';

function Banner() {
  const navigate = useNavigate()
  return (
    <div style={{ marginTop: '70px' }}>
      <Container maxWidth="lg" style={{ padding: '0', position: 'relative', }}>
        <img
          src={BannerImage}
          alt="Banner"
          style={{
            opacity: 0.9,
            borderRadius: '20px',
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            marginBottom: '20px',
          }}
          className='banner'
        />
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          color: '#FAF5E9',
          textAlign: 'left',
        }}>
          <h1 className='text-xl md:text-6xl'>"Nurturing a Calmer, Happier Family Life"</h1>
          <h3 className='text-sm md:text-xl'>Expert counseling and educational resources for children and parents</h3>
          <Button
            variant="contained"
            size='large'
            className="responsive-button "
            sx={{
              backgroundColor: '#323232',
              color: '#FAF5E9',
              marginTop: '10px',
              
              padding: { xs: '4px 8px', md: '8px 16px' },
              fontSize: { xs: '0.6rem', md: '1rem' },
              '&:hover': {
              backgroundColor: '#4A4A4A',
              },
            }}
            onClick={()=>navigate('/about')}
          >
            More About Us
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Banner;
