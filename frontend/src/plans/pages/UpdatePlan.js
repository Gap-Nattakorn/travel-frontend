import React, {useContext, useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
//import Modal from '../../shared/components/UIElements/Modal';
import Input from '../../shared/components/FormElements/Input';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import UpdatePlaceList from '../components/UpdatePlaceList';
import {
   VALIDATOR_REQUIRE,
   VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import {useForm} from '../../shared/hooks/form-hook';
import './PlanForm.css';


const UpdatePlan = () => {
   const auth = useContext(AuthContext);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const [loadedPlan, setLoadedPlan] = useState();
   const [loadedPlace, setLoadedPlace] = useState();
   const planId = useParams().planId;
   const history = useHistory();
 
   const [formState, inputHandler, setFormData] = useForm(
      {
         namePlan: {
           value:'',
           isValid: false
         },
         datePlan: {
           value:'',
           isValid: false
         }
       }, 
       false
    );

    useEffect(()=>{
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
            setLoadedPlan(responseData.plan);
            setFormData(
               {
                  namePlan: {
                     value: responseData.plan.namePlan,
                     isValid: true
                  },
                  datePlan: {
                     value: responseData.plan.datePlan.split("T")[0],
                     isValid: true
                  },
               },
               true
            );
         } catch(err) {

         }
         
      };
      fetchPlan(); 
   },[])

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
   },[])

   if(isLoading) {
      return (
         <div className="center">
           <LoadingSpinner asOverlay /> 
         </div>
      );
   }

   const planUpdateSubmitHandler = async event => {
      event.preventDefault();
      try {
         const formData = new FormData();
         formData.append('namePlan', formState.inputs.namePlan.value);
         formData.append('datePlan', formState.inputs.datePlan.value);
         await sendRequest(
            `http://localhost:5000/api/plans/${planId}`,
            'PATCH',
            formData,
            {
               Authorization: 'Bearer ' + auth.token 
            }
         );

         history.push('/' + auth.userId + '/plans');
      } catch(err) {

      }
      
   };

   const placeDeletedHandler = (deletedPlaceId) => {
      setLoadedPlace(prevPlaces => 
         prevPlaces.filter(place => place.id !== deletedPlaceId)
      );
   };

   const getBestPathHandler = async () => {
      const formData = new FormData();
      formData.append('planId', planId);
      try {
         await sendRequest(
            `http://localhost:5000/api/plans/autoPlan/plans/bestPath`,
            'POST',
            formData,
            {
               Authorization: 'Bearer ' + auth.token
            } 
         );
         history.push('/' + auth.userId + '/plans');
      } catch(err) {}

   };


   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />

         {!isLoading && loadedPlan && <form className="plan-form" onSubmit={planUpdateSubmitHandler}>
         <Input
            id="namePlan"
            element="input" 
            type="text" 
            label="ชื่อเเผนท่องเที่ยว" 
            validators={[VALIDATOR_REQUIRE()]} 
            errorText="กรุณากรอกชื่อเเผนท่องเที่ยว" 
            onInput={inputHandler}
            initialValue={loadedPlan.namePlan}
            initialValid={true} 
         />
            <Input
            id="datePlan"
            element="date" 
            type="date" 
            label="วันที่จะไป" 
            validators={[VALIDATOR_MINLENGTH(5)]} 
            errorText="กรุณากรอกวันที่จะไป" 
            onInput={inputHandler}
            initialValue={loadedPlan.datePlan.split("T")[0]}
            initialValid={true} 
         />
         <Button type="submit" disabled={!formState.isValid}>เเก้ไขเเผนท่องเที่ยว</Button>
         </form>}
         <div className="plan-form" style={{marginTop:"40px"}}>
            <h2 className="center">สถานที่ท่องเที่ยว</h2>
            {(!isLoading && loadedPlace) ? ( 
                  <UpdatePlaceList 
                     items={loadedPlace} 
                     planId={planId} 
                     onDelete={placeDeletedHandler}
                  />
               ) :
               (
                  <div className="center" style={{marginTop:"20px"}}>
                     <LoadingSpinner/>
                  </div>
               )
            }
            {!isLoading && loadedPlace && loadedPlace.length > 1 && 
               <div className="center">
                  <Button onClick={getBestPathHandler}>หาระยะทางที่ดีที่สุด</Button> 
               </div>
            }
         </div>
         
    </React.Fragment>
   )
}

export default UpdatePlan
