import React, {useState, useContext} from 'react';
import ReactStars from "react-stars";

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
// import Map from '../../shared/components/UIElements/Map';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {AuthContext} from '../../shared/context/auth-context';
import {useHttpClient} from '../../shared/hooks/http-hook';
import  './PlaceItem.css';

const PlaceItem = (props) => {
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const auth = useContext(AuthContext);
   // const [showMap, setShowMap] = useState(false);
   const [showConfirmModal, setShowConfirmModal] = useState(false);

   const firstExample = {
      size: 30,
      value: props.rating ,
      edit: false,
      isHalf: true,
      a11y: true
    };

   // const openMapHandler = () => setShowMap(true);
   
   // const closeMapHandler = () => setShowMap(false);

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
            `http://localhost:5000/api/places/${props.id}`,
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
            <p>คุณต้องการลบสถานที่ท่องเที่ยวนี้หรือไม่</p>
         </Modal>
         <li className="place-item">
            <Card className="place-item__content">
               {isLoading && <LoadingSpinner asOverlay/>}
               <div className="place-item__image">
                  <img src={`http://localhost:5000/${props.image}`} alt={props.title}/>
               </div>
               <div className="place-item__info">
                  <h2>{props.title}</h2>
                  {/* <h3>{props.address}</h3> */}
                  <div className="center"><ReactStars {...firstExample} /></div>
               </div>
               <div className="place-item__actions">
                  {/* <Button inverse onClick={openMapHandler}>
                     VIEW ON MAP
                  </Button> */}
                  <Button done to={`/placeDetail/${props.id}`} >ดู</Button> 
                  {auth.userId === props.creatorId && (
                     <Button to={`/places/${props.id}`}>เเก้ไข</Button> 
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

export default PlaceItem;
