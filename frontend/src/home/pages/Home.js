import React, {useEffect, useState} from 'react';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import {useHttpClient} from '../../shared/hooks/http-hook';
import HomePlaceItem from '../components/HomePlaceItem';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import './Home.css';


const Home = () => {
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const [places, setPlaces] = useState();

   useEffect(()=>{
      const fetchPlaces = async () => {
         try {
            const responseData = await sendRequest(
               `http://localhost:5000/api/places/popular/places`
            );
            setPlaces(responseData.places);

         } catch(err) {}

      };

      fetchPlaces();
   },[sendRequest])

   if(isLoading) {
      return (
         <div className="center">
           <LoadingSpinner asOverlay />
         </div>
      );
   }

   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />
         <div className="header">
            <div className="text-box">
                <h1 className="heading-primary">
                    <span className="heading-primary-main">TRAVELPLANNER</span>
                </h1>
            </div>
        </div>
         {!isLoading && places && <HomePlaceItem items={places}/>}
      </React.Fragment>
   )
}

export default Home;
