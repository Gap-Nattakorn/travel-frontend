import React from 'react';

import FavoritePlaceItem from './FavoritePlaceItem';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import './FavoritePlaceList.css';

const FavoritePlaceList = (props) => {
   if(props.items.length === 0){
      return (
         <div className="place-list center">
            <Card>
               <h2>ไม่พบเสถานที่ท่องเที่ยวที่ชื่นชอบ</h2>
               <Button to="/places">เพิ่มสถานที่ท่องเที่ยว</Button>
            </Card>
         </div>
      );
   }
   return (
      <ul className="place-list">
         {props.items.map(place => ( 
            <FavoritePlaceItem 
               key={place.id} 
               id={place.id} 
               title={place.title}
               imagePlace={place.image} 
               onDelete={props.onDelete}
            />
         ))}
      </ul>
   )
}

export default FavoritePlaceList;
