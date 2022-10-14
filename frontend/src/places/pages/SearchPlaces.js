import React, {useEffect, useState} from 'react';

import PlaceList from '../components/PlaceList';
//import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
// import LoadingIndicator from '../../shared/components/UIElements/LoadingIndicator';
// import Card from '../../shared/components/UIElements/Card';
// import {
//    VALIDATOR_NO_REQUIRE
// } from '../../shared/util/validators';


//import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
// import {AuthContext} from '../../shared/context/auth-context';
import './SearchPlace.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Option from '../../shared/components/FormElements/Option';
import PaginationPage from '../../shared/components/UIElements/PaginationPage';

const SearchPlaces = (props) => {
   // const auth = useContext(AuthContext);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const [loadedPlaces, setLoadedPlaces] = useState();
   const [loadedProvinces, setLoadedProvinces] = useState();
   const [loadedTypePlaces, setLoadedTypePlaces] = useState();
   const [province, setProvince] = useState('all');
   const [typePlace, setTypePlace] = useState('all');
   const [numberOfPages, setNumberOfPages] = useState(0);
   const [currentPage, setCurrentPage] = useState(0);
   const [count, setCount] = useState();
   //const [isSearch, setIsSearch] = useState(false);
   let responsePlaces;
   // const [formState, inputHandler] = useForm({
   //    provinceName: {
   //       value: '',
   //       isValid: false
   //    }
   // }, false);

   const nextpage = (pageNumber) => {
      setCurrentPage(pageNumber);
      getPlaces(pageNumber);
    }

   
   const getPlaces = async (currentPage) => {
      // console.log("COUNT "+ count);
      if(province === 'all' && typePlace === 'all'){
         try{
            responsePlaces = await sendRequest(
               `http://localhost:5000/api/places/places/all`,
               'POST',
               JSON.stringify({
                  pageNumber: currentPage,
                  pagination: 3
               }),
               {
                  'Content-Type': 'application/json'
               }
            );
            setLoadedPlaces(responsePlaces.places);
         }catch(err){}
      } else if (typePlace === 'all') {
         try{
            responsePlaces = await sendRequest(
               `http://localhost:5000/api/places/search/serachPlacesByProvince`,
               'POST',
               JSON.stringify({
                  provinceName: province,
                  pageNumber: currentPage,
                  pagination: 3
               }),
               {
                  'Content-Type': 'application/json'
               }
            );
            setLoadedPlaces(responsePlaces.places);
         }catch(err){}
      } else if (province === 'all') {
         try{
            responsePlaces = await sendRequest(
               `http://localhost:5000/api/places/search/serachPlacesByTypePlace`,
               'POST',
               JSON.stringify({
                  typePlace: typePlace,
                  pageNumber: currentPage,
                  pagination: 3
               }),
               {
                  'Content-Type': 'application/json'
               }
            );
            setLoadedPlaces(responsePlaces.places);
         }catch(err){}
      } else {
         try{
            responsePlaces = await sendRequest(
               `http://localhost:5000/api/places/search/searchPlacesByProvinceAndTypePlace`,
               'POST',
               JSON.stringify({
                  provinceName: province,
                  typePlace: typePlace,
                  pageNumber: currentPage,
                  pagination: 3
               }),
               {
                  'Content-Type': 'application/json'
               }
            );
            setLoadedPlaces(responsePlaces.places);
         }catch(err){}
      }
      
   }

   
   useEffect(() => {
      const fetchProvinces = async () => {
         try{
            const responseProvinces = await sendRequest(
               `http://localhost:5000/api/places/province/places`
            );
            setLoadedProvinces(responseProvinces.provinces);
         }catch(err){}
      }

      fetchProvinces();

      const fetchTypePlaces = async () => {
         try{
            const responseTypePlaces = await sendRequest(
               `http://localhost:5000/api/places/typePlace/places`
            );
            setLoadedTypePlaces(responseTypePlaces.typePlaces);
         }catch(err){}
      }

      fetchTypePlaces();

      // const fetchPlaces = async () => {
      //    try{
      //       responsePlaces = await sendRequest(
      //          `http://localhost:5000/api/places/places/all`,
      //          'POST',
      //          JSON.stringify({
      //             pageNumber: 1,
      //             pagination: 3
      //          }),
      //          {
      //             'Content-Type': 'application/json'
      //          }
      //       );
      //       setLoadedPlaces(responsePlaces.places);
      //    }catch(err){}
      // }
      
      // fetchPlaces();

      const countPlaces = async () => {
         try{
            const responseCountPlaces = await sendRequest(
               `http://localhost:5000/api/places/countPlaces/all`
            );

            setCount(responseCountPlaces.countPlaces);

            if (responseCountPlaces.countPlaces % 3 === 0){
               // console.log(responseCountPlaces.countPlaces);
   
               setNumberOfPages(Math.floor(responseCountPlaces.countPlaces / 3));
            }
            else {
               setNumberOfPages(Math.floor(responseCountPlaces.countPlaces / 3) + 1);
            }
   
            getPlaces(1);
         }catch(err){}
      }

      countPlaces();
   }, [sendRequest]);

   const searchPlaceSubmitHandler = async event => {
      event.preventDefault();

      // setLoadedPlaces();
      if(province === 'all' && typePlace === 'all'){
         try{
            const responseCountPlaces = await sendRequest(
               `http://localhost:5000/api/places/countPlaces/all`
            );
               setCount(responseCountPlaces.countPlaces);

            if (responseCountPlaces.countPlaces % 3 === 0){
               // console.log(responseCountPlaces.countPlaces);
   
               setNumberOfPages(Math.floor(responseCountPlaces.countPlaces / 3));
            }
            else {
               setNumberOfPages(Math.floor(responseCountPlaces.countPlaces / 3) + 1);
            }
            setCurrentPage(1);
            getPlaces(1);
         }catch(err){}
      } else if (typePlace === 'all') {
         try{
            const responseCountPlaces = await sendRequest(
               `http://localhost:5000/api/places/countPlaces/searchPlacesByProvince`,
               'POST',
               JSON.stringify({
                  provinceName: province,
               }),
               {
                  'Content-Type': 'application/json'
               }
            );
            setCount(responseCountPlaces.countPlaces);

            if (responseCountPlaces.countPlaces % 3 === 0){
               // console.log(responseCountPlaces.countPlaces);
   
               setNumberOfPages(Math.floor(responseCountPlaces.countPlaces / 3));
            }
            else {
               setNumberOfPages(Math.floor(responseCountPlaces.countPlaces / 3) + 1);
            }
            setCurrentPage(1);
            getPlaces(1);
         }catch(err){}
      } else if (province === 'all') {
         try{
            const responseCountPlaces = await sendRequest(
               `http://localhost:5000/api/places/countPlaces/searchPlacesByTypePlace`,
               'POST',
               JSON.stringify({
                  typePlace: typePlace,
               }),
               {
                  'Content-Type': 'application/json'
               }
            );
            setCount(responseCountPlaces.countPlaces);

            if (responseCountPlaces.countPlaces % 3 === 0){
               // console.log(responseCountPlaces.countPlaces);
   
               setNumberOfPages(Math.floor(responseCountPlaces.countPlaces / 3));
            }
            else {
               setNumberOfPages(Math.floor(responseCountPlaces.countPlaces / 3) + 1);
            }
            setCurrentPage(1);
            getPlaces(1);
         }catch(err){}
      } else {
         try{
            const responseCountPlaces = await sendRequest(
               `http://localhost:5000/api/places/countPlaces/searchPlacesByProvinceAndTypePlace`,
               'POST',
               JSON.stringify({
                  provinceName: province,
                  typePlace: typePlace
               }),
               {
                  'Content-Type': 'application/json'
               }
            );
            setCount(responseCountPlaces.countPlaces);

            if (responseCountPlaces.countPlaces % 3 === 0){
               // console.log(responseCountPlaces.countPlaces);
   
               setNumberOfPages(Math.floor(responseCountPlaces.countPlaces / 3));
            }
            else {
               setNumberOfPages(Math.floor(responseCountPlaces.countPlaces / 3) + 1);
            }
            setCurrentPage(1);
            getPlaces(1);
         }catch(err){}
      }
      
      
   };


   const selectProvinceHandler = event => {
      setProvince(event.target.value);
   }

   const selectTypePlaceHandler = event => {
      setTypePlace(event.target.value);
   }

   if(isLoading && !loadedProvinces && !loadedTypePlaces) {
      return (
         <div className="center">
           <LoadingSpinner asOverlay /> 
         </div>
      );
   }

   const places = (!isLoading && loadedPlaces) ? 
                     (<PlaceList items={loadedPlaces}/>) 
                  : 
                   (<div className="center" style={{marginTop:'200px'}}>
                      <LoadingSpinner/>
                      </div>
                   );

   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />
         {loadedTypePlaces && loadedProvinces && <form className="place-form" onSubmit={searchPlaceSubmitHandler} >
            <div className={`form-control`}>
               <label htmlFor="provinces">จังหวัด</label>
               <select className={`form-control`} value={province} onChange={selectProvinceHandler} >
                  <option value={'all'}>เลือกจังหวัด</option>
                  {loadedProvinces.map(province => (
                     <Option
                        key={province.id}
                        id={province.id}
                        name={province.name}
                     />
                  ))}
               </select>
            </div>
            <div className={`form-control`}>
               <label htmlFor="typePlaces">ประเภทสถานที่ท่องเที่ยว</label>
               <select value={typePlace} onChange={selectTypePlaceHandler} >
                  <option value={'all'}>เลือกประเภทสถานที่ท่องเที่ยว</option>
                  {loadedTypePlaces.map(typePlace => (
                     <Option
                        key={typePlace.id}
                        id={typePlace.id}
                        name={typePlace.typeName}
                     />
                  ))}
               </select>
            </div>
            <Button done type="submit" >
               ค้นหา
            </Button>
         </form>}
         
         {places}
         {!isLoading && loadedPlaces && count && count > 3 && (
            <PaginationPage
               pages={numberOfPages}
               nextPage={nextpage}
               currentPage={currentPage}
            />
            )
          }
      </React.Fragment>
   )
}

export default SearchPlaces;
