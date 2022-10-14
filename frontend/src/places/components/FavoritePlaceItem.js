import React, {useContext, useState} from 'react';
// import ReactStars from "react-stars";

import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';

import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';

import './FavoritePlaceList.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const FavoritePlaceItem = (props) => {
   const auth = useContext(AuthContext);
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const placeId = props.id;
   

   const showDeleteWarningHandler = () => {
      setShowConfirmModal(true);
   };
   
   const cancelDeleteHandler = () => {
      setShowConfirmModal(false);
   };

   const confirmDeleteHandler = async () => {
      // alert(props.id);
      setShowConfirmModal(false);
      try {
         await sendRequest(
            `http://localhost:5000/api/places/deleteFavoritePlace/${auth.userId}`,
            'DELETE',
            JSON.stringify({placeId}),
            {
               'Content-Type': 'application/json'
            } 
         );
         props.onDelete(placeId);
      } catch(err) {}
      
   };

   if(isLoading) {
      return (
         <div className="center">
           <LoadingSpinner /> 
         </div>
      );
   }

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
            <p>คุณต้องการลบสถานที่ท่องเที่ยวนี้ออกจากสถานที่ท่องเที่ยวที่ชื่นชอบหรือไม่?</p>
         </Modal>
         <div className="courses-container">
	        <div className="course" key={props.id}>
		        <div className="course-preview">
                <img src={`http://localhost:5000/${props.imagePlace}`} alt="ImagePlace" />
		        </div>
		        <div className="course-info">
			        <h5>{props.title}</h5>
                 <div style={{display:'inline-block'}}>
                     <Button danger onClick={showDeleteWarningHandler}>ลบ</Button>
                     <Button done to={`/placeDetail/${props.id}`}>ดู</Button>
                     
                 </div>
		        </div>
	        </div>
         </div>
      </React.Fragment>
   )
}

export default FavoritePlaceItem;
