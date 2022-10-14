import React,{useState} from 'react';

// import NewPlace from '../../places/pages/NewPlace';
// import Button from '../../shared/components/FormElements/Button';
// import Input from '../../shared/components/FormElements/Input';
// import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import MapPlan from '../../shared/components/UIElements/MapPlan';
import {useHttpClient} from '../../shared/hooks/http-hook';
import './Plan.css'

const Plans = () => {
   //const [showModal, setShowModal] = useState(false);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   
   //const openModal = () => {setShowModal(true)};

   //const closeModal = () => {setShowModal(false)};

   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />
         {/* <Modal 
            show={showModal} 
            onCancel={closeModal} 
            header={"sdfsdfsdf"} 
            contentClass="place-item__modal-content"
            footerClass="place-item__modal-actions"
            footer={<Button onClick={closeModal}>CLOSE</Button>}
         > */}
            <div className="map-container">
               {/* <MapPlan center={{ lat: 13.6785858, lng: 100.6500525 }} zoom={14} /> */}
               <MapPlan/>
            </div>
         {/* </Modal>
         <Button onClick={openModal}>
            OPEN
         </Button> */}
      </React.Fragment>
   )
}

export default Plans;
