import React from 'react';
import Slider from "react-slick";

import  './PlanItem.css';


const ImagePlan = (props) => {
   const places = (
      props.image.map(place => ( 
         <div key={place.id} className="place-item__image">
            <img  src={`http://localhost:5000/${place.image}`} alt={place.title}/>
         </div>
      ))
   )
   
   var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      pauseOnHover: false
    };
    return (
      <div>
        <Slider {...settings}>
          {places}
        </Slider>
      </div>
    );
  
}


export default ImagePlan;
