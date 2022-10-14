import React,{useEffect, useState, useContext} from 'react';
import {useParams} from 'react-router-dom';

import Comment from '../components/Comment';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
// import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import './PlaceDetail.css';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import AddPlace from '../../plans/components/AddPlace';
// import CompleteModal from '../../shared/components/UIElements/CompleteModal';
// import LoadingIndicator from '../../shared/components/UIElements/LoadingIndicator';
import ButtonFavorite from '../components/ButtonFavorite';
import { Card } from 'reactstrap';
// import FavoritePlaces from './FavoritePlaces';


const PlaceDetail = () => {
   const auth = useContext(AuthContext);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const [loadedPlace, setLoadedPlace] = useState();
   const [title, setTitle] = useState();
   const [description, setDescription] = useState();
   const [address, setAddress] = useState();
   const [location, setLocation] = useState();
   const [placeImage, setplaceImage] = useState();
   const placeId = useParams().placeId;
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   //const [isFavorite, setIsFavorite] = useState(false);
   const [favoritePlaces, setFavoritePlaces] = useState();
   const [opening, setOpening] = useState();
   //const [isLoadFav, setIsLoadFav] = useState(false);
   // const [done, setDone] = useState(false);

   

   useEffect(()=>{
      const fetchFavoritePlaces = async () => {
         try {
            const responseData = await sendRequest(
               `http://localhost:5000/api/places/favorite/${auth.userId}`
            );
         setFavoritePlaces(responseData.favoritePlaces.favoritePlaces);
         // if(responseData.favoritePlaces.favoritePlaces.includes(placeId)){
         //    console.log(responseData.favoritePlaces.favoritePlaces.includes(placeId));
         //    setIsFavorite(true);
         // }
         } catch(err) {}
         
      };

      fetchFavoritePlaces();  
      const fetchPlace = async () => {
         try {
            const responseData = await sendRequest(
               `http://localhost:5000/api/places/${placeId}`
            );
            setLoadedPlace(responseData.place);
            setTitle(responseData.place.title);
            setDescription(responseData.place.description);
            setAddress(responseData.place.address);
            setLocation(responseData.place.location);
            setplaceImage(responseData.place.image);
            setOpening(responseData.place.opening.join(', '));
   
         } catch(err) {

         }
         
      };
      fetchPlace();

      
   },[sendRequest, placeId, auth.userId])

   if(isLoading && !favoritePlaces && !loadedPlace ) {
      return (
         <div className="center">
           <LoadingSpinner /> 
         </div>
      );
   }



   const showDeleteWarningHandler = () => {
      setShowConfirmModal(true);
   };
   
   const cancelDeleteHandler = () => {
      setShowConfirmModal(false);
   };

   // console.log(favoritePlaces);
   // console.log(opening);
  
   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} header="" />
         <Modal
            show={showConfirmModal}
            onCancel={cancelDeleteHandler}
            header="เพิ่มสถานที่ท่องเที่ยวในเเผนท่องเที่ยว"
            footerClass="place-item__modal-actions"
            footer={
               <React.Fragment>
                  <Button inverse onClick={cancelDeleteHandler}>ปิด</Button>
               </React.Fragment>
            }
         >
            <AddPlace place={placeId} uid={auth.userId} onCancel={cancelDeleteHandler} />
         </Modal>
         
         {!isLoading && loadedPlace && favoritePlaces && (
         <div>
            <Card style={{width:'fit-content',margin:'auto',backgroundColor:'#E9F9E1'}}>
            <div className="tm-page-wrap mx-auto">
               <div className="tm-container-outer" id="tm-section-2">
                  <section className="tm-slideshow-section">
                     <div className="tm-slideshow">
                           <img src={`http://localhost:5000/${placeImage}`} alt="ImagePlace" />
                     </div>
                     <div className="tm-slideshow-description tm-bg-primary">
                        <h2 className="">{title}</h2>
                        <p>{description}</p>
                        <p>
                           <b>วันที่เปิด: </b>{opening}
                        </p>
                        <p>
                           <Button placeDetail  onClick={showDeleteWarningHandler}>
                              เพิ่มสถานที่ท่องเที่ยวในเเผนท่องเที่ยว
                           </Button>
                        </p>   
                        {!isLoading && favoritePlaces && 
                           <p>
                              <ButtonFavorite placeId={placeId} favoritePlaces={favoritePlaces} isFav={favoritePlaces.includes(placeId)}/>
                           </p>
                        }
                     </div>
                  </section>    
               </div>        
            </div>
            </Card>
            <div className="place-detail mx-auto">
               <header className="map-header">
                  <h2>{address}</h2>
               </header>
               <div className="map-content">
                  <div className="map-container">
                     <Map center={location} zoom={16} />
                  </div>
               </div>
            </div>
            <div className="mx-auto">
               <Comment place={placeId}/>
            </div>
         </div>)}
      </React.Fragment>
      
      
      
      
   );
}

export default PlaceDetail;
