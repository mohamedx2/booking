// YourComponent.js
import React from 'react';
import { Carousel } from 'antd';
import CommonHeading from '../common/CommonHeading';

const YourComponent = () => {
  const images = [
    require('../../Slides/image 1.jpg'),
    require('../../Slides/image 2.jpg'),
    require('../../Slides/image 3.jpg'),
    require('../../Slides/image 4.jpg'),
    require('../../Slides/image 5.jpg'),
    require('../../Slides/image 6.jpg'),
    require('../../Slides/image 7.jpg'),
    require('../../Slides/image 8.jpg'),
  ];

  return (
    <div className="container-xxl py-5">
      <CommonHeading
              heading="Our Gallery"
              title="Gallery"
              subtitle="Explore Our"
            />
      <Carousel autoplaySpeed={2000} autoplay infinite={true}  >
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Image ${index + 1}`} style={{ width: '100%', height: '50vh', objectFit: 'cover',borderRadius:'20px' }} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default YourComponent;
