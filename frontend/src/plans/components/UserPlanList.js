import React from 'react';

import UserPlanItem from './UserPlanItem';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import './PlanList.css';


const UserPlanList = props => {
   if(props.items.length === 0){
      return (
         <div className="place-list center">
            <Card>
               <h2>ไม่พบเเผนท่องเทียว กรุณาสร้างเเผนท่องเที่ยว</h2>
               <Button to="/plans/new">สร้างเเผนท่องเที่ยว</Button>
            </Card>
         </div>
      );
   }
   return (
      <ul className="place-list">
         {props.items.map(plan => ( 
            <UserPlanItem 
               key={plan.id} 
               id={plan.id}
               namePlan={plan.namePlan}
               //totalPrice={plan.totalPrice} 
               datePlan={plan.datePlan} 
               creatorId={plan.creator}
               onDelete={props.onDeletePlan}
               shared={plan.shared} 
            />
         ))}
      </ul>
   )
}


export default UserPlanList;
