import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom'; 


import UserPlanList from '../components/UserPlanList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';


const UserPlans = () => {
   const auth = useContext(AuthContext);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const userId = useParams().userId;
   const [loadedPlans, setLoadedPlans] = useState();

   useEffect(() => {
      const fetchPlans = async () => {
         try{
            const responseData = await sendRequest(
               `http://localhost:5000/api/plans/user/${userId}`,
               'GET',
               null,
               {
                  Authorization: 'Bearer ' + auth.token
               } 
            );

            setLoadedPlans(responseData.plans);
   
         }catch(err){}
      }

      fetchPlans();

   }, [sendRequest, userId, auth.token]);

   const planDeletedHandler = (deletedPlanId) => {
      setLoadedPlans(prevPlaces => 
         prevPlaces.filter(place => place.id !== deletedPlanId)
      );
   };

   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />
         {isLoading && (
            <div className="center">
               <LoadingSpinner asOverlay />
            </div>
         )} 
         {!isLoading && loadedPlans && (
            <div>
               <h2 className="title-page">เเผนท่องเที่ยวของฉัน</h2>
               <UserPlanList items={loadedPlans} onDeletePlan={planDeletedHandler} />
            </div>
         )}
      </React.Fragment>
   );
}

export default UserPlans;
