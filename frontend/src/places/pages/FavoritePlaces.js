import React,{ useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import FavoritePlaceList from '../components/FavoritePlaceList'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {useHttpClient} from '../../shared/hooks/http-hook';
import './PlaceForm.css';


const FavoritePlaces = () => {
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const userId = useParams().userId;
   const [favoritePlaces, setFavoritePlaces] = useState();

   useEffect(()=>{
         const fetchFavoritePlaces = async () => {
            try {
               const responseData = await sendRequest(
                  `http://localhost:5000/api/places/favoritePlace/${userId}`,
               );
               setFavoritePlaces(responseData.places);
            } catch(err) {

            }
            
         };
         fetchFavoritePlaces();
   },[sendRequest, userId])
   
   if(isLoading) {
      return (
         <div className="center">
           <LoadingSpinner asOverlay /> 
         </div>
      );
   }

   const placeDeletedHandler = (deletedPlaceId) => {
      setFavoritePlaces(prevPlaces => 
         prevPlaces.filter(place => place.id !== deletedPlaceId)
      );
   };

   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} header="" />
         <div className="place-form" style={{marginTop:"40px"}}>
            <h2 className="center">สถานที่ท่องเที่ยวที่ชื่นชอบ</h2>
            {!isLoading && favoritePlaces &&  
                  <FavoritePlaceList 
                     items={favoritePlaces}  
                     onDelete={placeDeletedHandler}
                  /> 
            }
         </div>
      </React.Fragment>
   )
}

export default FavoritePlaces;
