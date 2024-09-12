import React from 'react';
import './HomePage.css';

import Banner from '../../Components/Banner/Banner';
import SectionOne from '../../Components/SectionOne/SectionOne';
import SectionTwo from '../../Components/SectionTwo/SectionTwo';
import SectionThree from '../../Components/SectionThree/SectionThree';
import DoctorList from '../../Components/DoctorList/DoctorList';
import Testimonials from '../../Components/Testimonials/Testimonials';
import Footer from '../../Components/Footer/Footer';
import HeaderSwitcher from '../../Components/Header/HeadSwitcher';


const HomePage = () => {
 
  return (
    <>
      <HeaderSwitcher/>
      <Banner/>
      <SectionOne/>
      <SectionTwo/>
      <SectionThree/>
      <DoctorList/>
      <Testimonials/>
      <Footer/>
    </>
  );
};

export default HomePage;
