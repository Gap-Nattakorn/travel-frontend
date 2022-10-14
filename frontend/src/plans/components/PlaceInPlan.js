import React from "react";
// import { Link } from 'react-router-dom';

import Slider from "react-slick";

// import './Stick.css';
import './PlaceInPlan.css';
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";



const PlaceInPlan = (props) =>  {

  if(props.place.length === 0){
    return (
       <div className="place-list center">
          <Card>
             <h2>ไม่พบสถานที่ท่องเที่ยว กรุณาเพิ่มสถานที่ท่องเที่ยว</h2>
             <Button to="/places">เพิ่มสถานที่ท่องเที่ยว</Button>
          </Card>
       </div>
    );
 }


   const places = (
      props.place.map(place => ( 
        <div key={place.id} className="place-list">
        <div className="place-item">
          <Card className="place-item__content">
              <div className="place-item__image">
                <img src={`http://localhost:5000/${place.image}`} alt="ImagePlace" />
              </div>
                <div className="place-item__info">
                  <h2>{place.title}</h2>
                  {/* <h3>{props.totalPrice}</h3> */}
                  {/* <p>{props.datePlan.split("T")[0]}</p> */}
                </div>
                <div className="place-item__actions">
                  <Button done to={`/placeDetail/${place.id}`}>ดู</Button> 
                </div>
          </Card> 
        </div>
        </div>    
      ))
   )
   var settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: true,
      className: "center",
      // appendDots: dots => (
      //   <div
      //     style={{
      //       //backgroundColor: "#ddd",
      //       padding: "10px"
      //     }}
      //   >
      //     <ul style={{ margin: "0px" }}> {dots} </ul>
      //   </div>
      // ),
      // customPaging: i => (
      //   <div
      //     style={{
      //       backgroundColor:'red',
      //       width: "30px",
      //       color: "blue",
      //       border: "1px blue solid",
      //       borderRadius: "3px",

      //     }}
      //   >
      //     {i + 1}
      //   </div>
      // ),
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
      <div>
        <Slider {...settings}>
          {places}
        </Slider>
      </div>
    );
  
}

export default PlaceInPlan;