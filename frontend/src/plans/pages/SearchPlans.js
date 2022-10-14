import React, {useEffect, useState} from 'react';

import PlanList from '../components/PlanList';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
// import LoadingIndicator from '../../shared/components/UIElements/LoadingIndicator';
// import Card from '../../shared/components/UIElements/Card';
import {
   VALIDATOR_NO_REQUIRE
} from '../../shared/util/validators';


import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
// import {AuthContext} from '../../shared/context/auth-context';
import './SearchPlans.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
//import Option from '../../shared/components/FormElements/Option';
import PaginationPage from '../../shared/components/UIElements/PaginationPage';


const SearchPlans = () => {
   // const auth = useContext(AuthContext);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const [loadedPlans, setLoadedPlans] = useState();
   // const [loadedProvinces, setLoadedProvinces] = useState();
   // const [loadedTypePlaces, setLoadedTypePlaces] = useState();
   // const [province, setProvince] = useState('all');
   const [isSearch, setIsSearch] = useState(false);
   const [numberOfPages, setNumberOfPages] = useState(0);
   const [currentPage, setCurrentPage] = useState(0);
   const [count, setCount] = useState();
   //const [isShow, setIsShow] = useState();
   let responsePlans;
   const [formState, inputHandler] = useForm({
      searchPlan: {
         value: '',
         isValid: false
      }
   }, false);

   const nextpage = (pageNumber) => {
      setCurrentPage(pageNumber);
      getPlans(pageNumber);
    }

   
   const getPlans = async (currentPage) => {
      if(isSearch){
         try {
            responsePlans = await sendRequest(
               `http://localhost:5000/api/plans/search/searchPlans/plans`,
               'POST',
               JSON.stringify({
                  searchPlans:formState.inputs.searchPlan.value,
                  pageNumber: currentPage,
                  pagination: 1
               }),
               {
                  'Content-Type': 'application/json'
               }
            );
            setLoadedPlans(responsePlans.plans);
         }catch(err){}
      }else {
         try {
            responsePlans = await sendRequest(
               `http://localhost:5000/api/plans/plans/all/plans`,
               'POST',
               JSON.stringify({
                  pageNumber: currentPage,
                  pagination: 1
               }),
               {
                  'Content-Type': 'application/json'
               }
            );
            setLoadedPlans(responsePlans.plans);
         }catch(err){}
      }
      
   }

   
   useEffect(() => {
      
      const countPlans = async () => {
         try{
            const responseCountPlans = await sendRequest(
               `http://localhost:5000/api/plans/countPlans/all/plans`
            );

            setCount(responseCountPlans.countPlans);

            if (responseCountPlans.countPlans % 1 === 0){
               // console.log(responseCountPlans.countPlans);
   
               setNumberOfPages(Math.floor(responseCountPlans.countPlans / 1));
            }
            else {
               setNumberOfPages(Math.floor(responseCountPlans.countPlans / 1) + 1);
            }
   
            getPlans(1);
         }catch(err){}
      }

      countPlans();
   }, []);

   const searchPlanSubmitHandler = async event => {
      event.preventDefault();
      try{
         const responseCountPlans = await sendRequest(
            `http://localhost:5000/api/plans/countPlans/searchPlans/plans`,
            'POST',
            JSON.stringify({
               searchPlans:formState.inputs.searchPlan.value
            }),
            {
               'Content-Type': 'application/json'
            }
         );
         setCount(responseCountPlans.countPlans);
         if (responseCountPlans.countPlans % 1 === 0){
            setNumberOfPages(Math.floor(responseCountPlans.countPlans / 1));
         }
         else {
            setNumberOfPages(Math.floor(responseCountPlans.countPlans / 1) + 1);
         }
         setIsSearch(true);
         setCurrentPage(1);
         getPlans(1);
      }catch(err){}
     
      
   };

   // const setShowSearchHandler = (isShow) => {
   //    setIsShow(true);
   // }
   // const selectProvinceHandler = event => {
   //    setProvince(event.target.value);
   // }

   // const selectTypePlaceHandler = event => {
   //    setTypePlace(event.target.value);
   // }

   // if(isLoading) {
   //    return (
   //       <div className="center">
   //         <LoadingSpinner /> 
   //       </div>
   //    );
   // }

   const plans = (!isLoading && loadedPlans) ? 
                     (<PlanList items={loadedPlans} />) 
                  : 
                   (<div className="center" style={{marginTop:'200px'}}>
                      <LoadingSpinner/>
                      </div>
                   );
                  
   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />
         {<form className="place-form" onSubmit={searchPlanSubmitHandler} >
            <Input
               id="searchPlan"
               element="input" 
               type="text" 
               label="" 
               validators={[VALIDATOR_NO_REQUIRE()]} 
               onInput={inputHandler}
            />
            <Button type="submit" >
               SEARCH
            </Button>
         </form>}
         {plans}
         {!isLoading && loadedPlans && count && count > 1 && (
            <PaginationPage
               pages={numberOfPages}
               nextPage={nextpage}
               currentPage={currentPage}
               // hundreadChange={hundreadChange}
               // tenChange={tenChange}
            />
            )
          }
      </React.Fragment>
   )
}

export default SearchPlans;
