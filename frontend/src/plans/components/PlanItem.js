import React, {useState, useContext, useEffect} from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
//import Modal from '../../shared/components/UIElements/Modal';
//import Map from '../../shared/components/UIElements/Map';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {AuthContext} from '../../shared/context/auth-context';
import {useHttpClient} from '../../shared/hooks/http-hook';
import  './PlanItem.css';
import ImagePlan from './ImagePlan';

const UserPlanItem = (props) => {
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const auth = useContext(AuthContext);
   const planId = props.id;
   //const [showMap, setShowMap] = useState(false);
   //const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [loadedPlace, setLoadedPlace] = useState(false);

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
         } catch(err) {

         }
         
      };
      fetchPlace(); 
   },[sendRequest, planId])

   const plans = (!isLoading && loadedPlace) ? 
                  (
                     <li className="place-item">
                        <Card className="place-item__content">
                           <ImagePlan image={loadedPlace} />
                           <div className="place-item__info">
                              <h2>{props.namePlan}</h2>
                              <h3>{props.totalPrice}</h3>
                              <p>{props.datePlan.split("T")[0]}</p>
                           </div>
                           <div className="place-item__actions">
                              <Button to={`/planDetail/${planId}`}>View</Button> 
                           </div>
                        </Card> 
                     </li>
                  )   
                  : 
                   (
                     <div className="center" style={{marginTop:'200px'}}>
                        <LoadingSpinner/>
                      </div>
                   );

   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />
         {/* {!isLoading && loadedPlace && (<li className="place-item">
            <Card className="place-item__content">
               <ImagePlan image={loadedPlace} />
               <div className="place-item__info">
                  <h2>{props.namePlan}</h2>
                  <h3>{props.totalPrice}</h3>
                  <p>{props.datePlan.split("T")[0]}</p>
               </div>
               <div className="place-item__actions">
                  <Button to={`/planDetail/${planId}`}>View</Button> 
               </div>
            </Card> 
         </li>)} */}
         {plans}
      </React.Fragment>
      
   );
}

export default UserPlanItem;
