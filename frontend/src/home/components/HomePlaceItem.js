import React from 'react';
import ReactStars from "react-stars";
import Slider from "react-slick";


import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {useHttpClient} from '../../shared/hooks/http-hook';
import  './HomePlaceItem.css';
import './HomePlaceList.css';


const HomePlaceItem = (props) => {
   const {isLoading, error, clearError} = useHttpClient();

   const places = (
      props.items.map(place => (
      <div key={place.id} className="place-list">
         <li className="place-item" style={{margin:'20px'}}>
         <Card className="place-item__content">
               {isLoading && <LoadingSpinner asOverlay/>}
               <div className="place-item__image">
                  <img src={`http://localhost:5000/${place.image}`} alt={place.title}/>
               </div>
               <div className="place-item__info">
                  <h2>{place.title}</h2>
                  <div className="center">
                     <ReactStars 
                        size={30}
                        value={place.rating}
                        edit={false}
                        isHalf={true}
                        a11y={true}
                     />
                  </div>
               </div>
               <div className="place-item__actions">
                  <Button done to={`/placeDetail/${place.id}`} >ดู</Button> 
               </div>
         </Card> 
      </li>
      </div> 
      ))
   )

   var settings = {
      dots: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      pauseOnHover: true,
      className: "center",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };

   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />
         <div className="title-page">
            สถานที่ท่องเที่ยวยอดนิยม
         </div>
         <div style={{margin:'50px'}}>
            <Slider {...settings}>
               {places}
            </Slider>
         </div>
      </React.Fragment>
      
   );
}

export default HomePlaceItem;
