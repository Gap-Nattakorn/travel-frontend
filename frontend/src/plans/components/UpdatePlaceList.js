
import React from 'react';

import UpdatePlaceItem from './UpdatePlaceItem';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import './PlanList.css';


const PlaceList = props => {
   if(props.items.length === 0){
      return (
         <div className="place-list center">
            <Card>
               <h2>ไม่พบสถานที่ท่องเที่ยว กรุณาเพิ่มสถานที่ท่องเที่ยว</h2>
               <Button to="/places">เพิ่มสถานที่ท่องเที่ยว</Button>
            </Card>
         </div>
      );
   }
   return (
      <ul className="place-list">
         {props.items.map((place,index) => ( 
            <UpdatePlaceItem 
               key={place.id}
               number={index} 
               planId={props.planId} 
               id={place.id} 
               title={place.title}
               imagePlace={place.image} 
               onDelete={props.onDelete}
            />
         ))}
      </ul>
   )
}


export default PlaceList;
