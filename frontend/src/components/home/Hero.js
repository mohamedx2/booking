import React, { useState } from "react";
import styled from "styled-components";
import { useEffect } from "react";
import axios from "axios";
import CountUp from 'react-countup';
const HeroSectionContainer = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #333;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  position: relative;
  padding-top: 80px; /* Adjust this value to match your navbar height */

  @media (max-width: 768px) {
    padding-top: 80px; /* Adjust this value if your navbar height changes on smaller screens */
  }
`;



const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
`;

const Heading = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 1rem;
  position: relative;
  text-align: left;

  span {
    color: #007bff;
    position: relative;
    white-space: nowrap; /* Prevent line break */
    z-index: 1;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      bottom: 0;
      background: rgba(0, 123, 255, 0.3);
      z-index: -1;
      transform: skewY(-3deg);
    }
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    text-align: center;
    
  }
`;

const LeadParagraph = styled.p`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const StatBox = styled.div`
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  padding: 1rem;
  text-align: center;
  background: #fff;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const StatCount = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const StatText = styled.p`
  font-size: 1.1rem;
  margin: 0;
`;

const Image = styled.img`
  border-radius: 0.25rem;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

const Button = styled.a`
  display: inline-block;
  padding: 1rem 2rem;
  margin-top: 2rem;
  color: #fff;
  background-color: #007bff;
  border: 1px solid #007bff;
  border-radius: 0.25rem;
  text-decoration: none;
  font-size: 1.25rem;
  transition: background-color 0.3s, border-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #0056b3;
    border-color: #004085;
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

export default function HeroSection() {
const [countUsers,setCountUsers]=useState(0)
const [countAdmin,setCountAdmin]=useState(0)
const [countEtab,setCountEtab]=useState(0)

  useEffect(() => {

    fetchDataUser();
    fetchDataEtab();
    fetchDataAdmin();
  }, []);
  const fetchDataUser = async () => {
    try {
      
      const response = await axios.get(
        `http://localhost:5000/api/auth/countUser`,
      
        
      );
      setCountUsers(response.data)
    } catch (error) {
      console.error('Error fetching data:');
    }
  };


  const fetchDataAdmin = async () => {
    try {
      
      const response = await axios.get(
        `http://localhost:5000/api/auth/countAdmin`,
      
        
      );
      setCountAdmin(response.data)
    } catch (error) {
      console.error('Error fetching data:');
    }
  };
  const fetchDataEtab = async () => {
    try {
      
      const response = await axios.get(
        `http://localhost:5000/api/etablissements/countEtablisement`,
      
        
      );
      setCountEtab(response.data)
    } catch (error) {
      console.error('Error fetching data:');
    }
  };
  




  
const about = [
  {
    icon: <i class="fa fa-hotel fa-2x text-primary mb-2"></i>,
    text: "Etablissement",
    count: countEtab,
  },
  {
    icon: <i class="fa fa-users fa-2x text-primary mb-2"></i>,
    text: "Admin",
    count: countAdmin,
  },
  {
    icon: <i class="fa fa-users-cog fa-2x text-primary mb-2"></i>,
    text: "Clients",
    count: countUsers,
  },
];

  return (
    <HeroSectionContainer>
      <ContentWrapper>
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 col-md-12">
            <Heading>
              Welcome to <span>SCH</span>
            </Heading>
            <LeadParagraph>
              Experience luxury and comfort at its finest. Discover exquisite
              accommodations, world-class amenities, and unparalleled service at
              Hotelier.
            </LeadParagraph>
            <div className="row g-3 pb-4">
              {about.map((item, key) => (
                <div className="col-sm-4 col-6 wow fadeIn" data-wow-delay="0.1s" key={key}>
                  <StatBox>
                    <StatIcon>{item.icon}</StatIcon>
                    <StatCount data-toggle="counter-up"><CountUp end={item.count} duration={2} /></StatCount>
                    <StatText>{item.text}</StatText>
                  </StatBox>
                </div>
              ))}
            </div>
            <Button href="#explore">Explore More</Button>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="row g-3">
              <div className="col-6 text-end">
                <Image
                  className="img-fluid w-75 wow zoomIn"
                  data-wow-delay="0.1s"
                  src="/assets/img/about-1.jpg"
                  style={{ marginTop: "25%" }}
                  alt="About Image 1"
                />
              </div>
              <div className="col-6 text-start">
                <Image
                  className="img-fluid w-100 wow zoomIn"
                  data-wow-delay="0.3s"
                  src="/assets/img/about-2.jpg"
                  alt="About Image 2"
                />
              </div>
              <div className="col-6 text-end">
                <Image
                  className="img-fluid w-50 wow zoomIn"
                  data-wow-delay="0.5s"
                  src="/assets/img/about-3.jpg"
                  alt="About Image 3"
                />
              </div>
              <div className="col-6 text-start">
                <Image
                  className="img-fluid w-75 wow zoomIn"
                  data-wow-delay="0.7s"
                  src="/assets/img/about-4.jpg"
                  alt="About Image 4"
                />
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </HeroSectionContainer>
  );
}
