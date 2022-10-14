import React from 'react';

import PlanItem from './PlanItem';
import Card from '../../shared/components/UIElements/Card';
//import Button from '../../shared/components/FormElements/Button';
import './PlanList.css';


const PlanList = props => {
   if(props.items.length === 0){
      return (
         <div className="place-list center">
            <Card>
               <h2>No plans found.</h2>
            </Card>
         </div>
      );
   }
   return (
      <ul className="place-list">
         {props.items.map(plan => ( 
            <PlanItem 
               key={plan.id} 
               id={plan.id}
               namePlan={plan.namePlan}
               totalPrice={plan.totalPrice} 
               datePlan={plan.datePlan} 
               creatorId={plan.creator}
               onDelete={props.onDeletePlan} 
            />
         ))}
      </ul>
   )
}


export default PlanList;
