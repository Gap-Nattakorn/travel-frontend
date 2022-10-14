import React, {useContext, useEffect, useState} from 'react';

import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import Option from '../../shared/components/FormElements/Option';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
//import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import CompleteModal from '../../shared/components/UIElements/CompleteModal';

import './AddPlace.css';
import Button from '../../shared/components/FormElements/Button';
// import Card from '../../shared/components/UIElements/Card';


const AddPlace = (props) => {
   const auth = useContext(AuthContext);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const [loadedPlans,setLoadedPlans] = useState();
   const [plan, setPlan] = useState('');
   const [done, setDone] = useState(false);


   useEffect(() => {
      const fetchPlans = async () => {
         try{
            const responseData = await sendRequest(
               `http://localhost:5000/api/plans/user/${auth.userId}`,
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
   }, [sendRequest, auth.userId, auth.token])

   if(isLoading) {
      return (
         <div className="center">
           <LoadingSpinner /> 
         </div>
      );
   }


   const addPlaceHandler = async () => {
      if(plan && plan !== "none"){
         const formData = new FormData();
         formData.append('userId', props.uid);
         formData.append('placeId', props.place);
         formData.append('planId', plan);
        
         try {
            await sendRequest(
               `http://localhost:5000/api/plans/addPlace`,
               'POST',
               formData,
               {
                  Authorization: 'Bearer ' + auth.token
               } 
            );
            setDone(true);   
         } catch(err) {}
         
         
      }else {
         alert("กรุณาเลือกเเผนท่องเที่ยว");
      }
   }

   let plans;
   if(!isLoading && loadedPlans){
      if(loadedPlans.length !== 0){
         plans = (
            <div className="form-control">
               <label>กรุณาเลือกเผนท่องเที่ยว</label>
               <select className="form-control" value={plan} onChange={(event)=>{setPlan(event.target.value)}}>
                  <option value="none">เลือกเเผนท่องเที่ยวของคุณ</option>
                     {loadedPlans.map(province => (
                        <Option
                           key={province.id}
                           id={province.id}
                           name={province.namePlan}
                        />
                     ))}
               </select>
               <Button done  onClick={addPlaceHandler}>เพิ่ม</Button>
            </div>
         );
      }else{
         plans = (
            <div>
               <h2>ไม่พบเเผนท่องเที่ยว กรุณาสร้างเเผนท่องเที่ยว</h2>
               <Button to="/plans/new">สร้างเเผนท่องเที่ยว</Button>
            </div>
         )
      }
   }

   const closeDone = () => {
      setDone(false);
   }


   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />
         <CompleteModal done={done} onClear={closeDone} text="เพิ่มสำเร็จ" />
         {loadedPlans && 
         // (
         //    <div className="form-control">
         //       <label>กรุณาเลือกเผนท่องเที่ยว</label>
         //       <select className="form-control" value={plan} onChange={(event)=>{setPlan(event.target.value)}}>
         //          <option value="none">เลือกเเผนท่องเที่ยวของคุณ</option>
         //             {loadedPlans.map(province => (
         //                <Option
         //                   key={province.id}
         //                   id={province.id}
         //                   name={province.namePlan}
         //                />
         //             ))}
         //       </select>
         //       <Button done  onClick={addPlaceHandler}>เพิ่ม</Button>
         //    </div>
         //    )
         plans
         }
      </React.Fragment>
      
     
      
   )
}

export default AddPlace;
