import React, {useState, useContext, useEffect} from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
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
   // const [showConfirmShared, setShowConfirmShared] = useState(false);
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [loadedPlace, setLoadedPlace] = useState(false);
   const date = props.datePlan.split("T")[0];
   const dayPlan = date.split('-')
   const datePlan = dayPlan[2]+"/"+dayPlan[1]+"/"+dayPlan[0];
   useEffect(()=>{
      const fetchPlace = async () => {
         try {
            const responseData = await sendRequest(
               `http://localhost:5000/api/plans/places/${props.id}`,
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
   },[sendRequest, props.id, auth.token])

   // const openConfirmSharedHandler = () => setShowConfirmShared(true);
   
   // const closConfirmSharedHandler = () => setShowConfirmShared(false);

   const showDeleteWarningHandler = () => {
      setShowConfirmModal(true);
   };
   
   const cancelDeleteHandler = () => {
      setShowConfirmModal(false);
   };

   const confirmDeleteHandler = async () => {
      setShowConfirmModal(false);
      try {
         await sendRequest(
            `http://localhost:5000/api/plans/${props.id}`,
            'DELETE',
            null,
            {
               Authorization: 'Bearer ' + auth.token
            } 
         );
         props.onDelete(props.id);
      } catch(err) {

      }
      
   };

   // const confirmSharedPlan = async () => {
   //    setShowConfirmShared(false);
   //    try {
   //       await sendRequest(
   //          `http://localhost:5000/api/plans/sharedPlans/${props.id}`,
   //          'POST',
   //          null,
   //          {
   //             Authorization: 'Bearer ' + auth.token
   //          } 
   //       );
   //       // props.onDelete(props.id);
   //    } catch(err) {

   //    }
   // }

   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />
         <Modal
            show={showConfirmModal}
            onCancel={cancelDeleteHandler}
            header="คุณเเน่ใจ?"
            footerClass="place-item__modal-actions"
            footer={
               <React.Fragment>
                  <Button inverse onClick={cancelDeleteHandler}>ไม่</Button>
                  <Button danger onClick={confirmDeleteHandler}>ใช่</Button>
               </React.Fragment>
            }
         >
            <p>คุณต้องการลบเเผนท่องเที่ยวนี้หรือไม่</p>
         </Modal>
         <li className="place-item">
            <Card className="place-item__content">
               {isLoading && <LoadingSpinner asOverlay/>}
               {/* <div className="place-item__image"> */}
                  {/* <img src={`http://localhost:5000/${props.image}`} alt={props.title}/> */}
                  {loadedPlace && <ImagePlan image={loadedPlace} />}
               {/* </div> */}
               <div className="place-item__info">
                  <h2>{props.namePlan}</h2>
                  <h3>{props.totalPrice}</h3>
                  <p>{datePlan}</p>
               </div>
               <div className="place-item__actions">
                  <Button done to={`/planDetail/${props.id}`}>ดู</Button> 
                  {auth.userId === props.creatorId && (
                     <Button to={`/plans/${props.id}`}>เเก้ไข</Button> 
                  )}
                  {auth.userId === props.creatorId && (
                     <Button danger onClick={showDeleteWarningHandler}>
                        ลบ
                     </Button>
                  )}  
               </div>
            </Card> 
         </li>
      </React.Fragment>
      
   );
}

export default UserPlanItem;
