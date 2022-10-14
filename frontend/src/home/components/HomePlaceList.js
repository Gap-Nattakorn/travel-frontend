import React from 'react'
import HomePlaceItem from './HomePlaceItem';

import './HomePlaceList.css';

const HomePlaceList = (props) => {
   return (
      <ul className="place-list">
         {props.items.map(place => ( 
            <HomePlaceItem
               key={place.id} 
               id={place.id}
               image={place.image}
               title={place.title} 
               description={place.description} 
               rating={place.rating} 
               address={place.address} 
               creatorId={place.creator}
               coordinates={place.location}
               onDelete={props.onDeletePlace} 
            />
         ))}
      </ul>
   )
}

export default HomePlaceList;
