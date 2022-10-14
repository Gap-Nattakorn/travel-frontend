import React,{useState, useContext} from 'react';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingIndicator from '../../shared/components/UIElements/LoadingIndicator';

import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import Button from '../../shared/components/FormElements/Button';
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// import { PaginationLink } from 'reactstrap';


const ButtonFavorite = (props) => {
   const auth = useContext(AuthContext);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const [isFavorite, setIsFavorite] = useState(props.isFav);
   const placeId = props.placeId;
   //const [favoritePlaces, setFavoritePlaces] = useState([]);
   const [isLoadFav, setIsLoadFav] = useState(false);
   // console.log(props.favoritePlaces)
   const favoriteHandler = async () => {
      if(!isFavorite){
         try {
            setIsLoadFav(true);
            await sendRequest(
               `http://localhost:5000/api/places/addFavoritePlace/${auth.userId}`,
               'POST',
               JSON.stringify({placeId}),
               {
                  'Content-Type': 'application/json'
               } 
            );
            setIsFavorite(true);
            setIsLoadFav(false);

         } catch(err) {}
      }else {
         try {
            setIsLoadFav(true);
            await sendRequest(
               `http://localhost:5000/api/places/deleteFavoritePlace/${auth.userId}`,
               'DELETE',
               JSON.stringify({placeId}),
               {
                  'Content-Type': 'application/json'
               }
            );
            setIsFavorite(false);
            setIsLoadFav(false);

         }catch(err) {}
      }
   }
   let button;
   if(isFavorite){
      button = (
         <Button placeDetail onClick={favoriteHandler}>
            ชอบ
         </Button>
      );
   }else {
      button = (
         <Button inversePlaceDetail  onClick={favoriteHandler}>
            เพิ่มสถานที่ท่องเที่ยวที่ชื่นชอบ
         </Button>
      );
   }
 

   return (
         <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
           {isLoading && isLoadFav && 
               <LoadingIndicator/>
           }
            {!isLoading && button}
         </React.Fragment>
         
   )
}

export default ButtonFavorite;
