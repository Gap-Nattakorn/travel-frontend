import React,{useEffect, useState, useContext} from 'react';
import {useParams} from 'react-router-dom';


import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import PlaceInPlan from '../components/PlaceInPlan';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import MapPlan from '../../shared/components/UIElements/MapPlan';
import Card from '../../shared/components/UIElements/Card';

import './PlanDetail.css';


const PlanDetail = () => {
   const auth = useContext(AuthContext);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const [loadedPlace, setLoadedPlace] = useState();
   const planId = useParams().planId;
   //const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [namePlan, setNamePlan] = useState();
   const [origin, setOrigin] = useState();
   const [datePlan, setDatePlan] = useState();
   const [distance, setDistance] = useState();

   useEffect(()=>{
      const fetchPlace = async () => {
         try {
            const responseData = await sendRequest(
               `http://localhost:5000/api/plans/places/${planId}`,
               'GET',
               null,
               {
                  Authorization: 'Bearer ' + auth.token
               } 
            );
            setLoadedPlace(responseData.place);
         } catch(err) {}
         
      };
      fetchPlace();

      const fetchPlan = async () => {
         try {
            const responseData = await sendRequest(
               `http://localhost:5000/api/plans/${planId}`,
               'GET',
               null,
               {
                  Authorization: 'Bearer ' + auth.token
               } 
            );
            var day = responseData.plan.datePlan.split('T');
            var date = day[0].split('-');
            setNamePlan(responseData.plan.namePlan);
            setDistance(Math.floor(responseData.plan.distance));
            setOrigin(responseData.plan.origin);
            setDatePlan(date[2]+"/"+date[1]+"/"+date[0]);

         } catch(err) {}
         
      };
      fetchPlan();  
   },[sendRequest, planId, auth.token])

   if(isLoading || !loadedPlace) {
      return (
         <div className="center">
           <LoadingSpinner asOverlay /> 
         </div>
      );
   }

   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />
         <div className="tm-page-wrap mx-auto">

            {!isLoading && loadedPlace &&(
               <Card>
                  <h2 className="center">ชื่อเเผนท่องเที่ยว: {namePlan}</h2>
                  <h2 className="center">วันที่จะไป: {datePlan}</h2>
                  <h2 className="center">ระยะทางรวม: {distance} กิโลเมตร</h2>
                  <div className="center" style={{margin:'5px'}}>
                     {loadedPlace.map((place, i) => (
                           (loadedPlace.length-1) === i ?
                           (<Card style={{margin:'5px'}}>{place.title}</Card>)
                           :(<><Card style={{margin:'5px'}}>{place.title}</Card></>)
                     ))}
                  </div>
               </Card>  
            )}
            {!isLoading && loadedPlace && <PlaceInPlan place={loadedPlace}/>}
            {!isLoading && loadedPlace && loadedPlace.length > 0 &&
               <div className="place-detail mx-auto">
                  <header className="map-header">
                     <h2>เเผนที่เเผนท่องเที่ยว</h2>
                  </header>
                  <div className="map-content">
                     <div className="map-container">
                        <MapPlan location={loadedPlace} origin={origin}/>
                     </div>
                  </div>
               </div>
            }
         </div>
      </React.Fragment>
      
   )
}

export default PlanDetail;
