import React, { useContext, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import LoadingText from '../../shared/components/UIElements/LoadingText';
import Picker from '../../shared/components/UIElements/MapPicker';

import {
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import Option from '../../shared/components/FormElements/Option';
import './PlanForm.css';




const NewPlan = () => {
  const auth = useContext(AuthContext);
  const [typePlace, setTypePlace]= useState([]);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [isAddPlanMode, setIsAddPlanMode] = useState(true);
  const [location, setLocation] = useState();
  const [tpCount, setTpCount] = useState(true);
  const [typePlan, setTypePlan] = useState('popular');
  const [loadedProvinces, setLoadedProvinces] = useState();
  const [loadedTypePlaces, setLoadedTypePlaces] = useState();
  const [province, setProvince] = useState();
  const [countPlace, setCountPlace] = useState(1);
  const [formState, inputHandler, setFormData] = useForm(
    {
       namePlan: {
         value:'',
         isValid: false
       },
       datePlan: {
         value:'',
         isValid: false
       }
     }, 
     false);

  const history = useHistory();
 

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
 }, []);

  const getLocation = (location) => {
    setLocation(location);
  }

  
  const placeSubmitHandler = async event => {
    event.preventDefault();
    if(isAddPlanMode) {
      try{
        const formData = new FormData();
        formData.append('namePlan', formState.inputs.namePlan.value);
        formData.append('datePlan', formState.inputs.datePlan.value);
        formData.append('lat', location.lat);
        formData.append('lng', location.lng);
        await sendRequest(
          'http://localhost:5000/api/plans/createPlan',
          'POST',
          formData,
          {
            Authorization: 'Bearer ' + auth.token
          } 
        );
        // Redirect the user to a different page
        history.push(`/${auth.userId}/plans`);
      }catch(err){}
    } else {
      try{
        const formData = new FormData();
        formData.append('namePlan', formState.inputs.namePlan.value);
        formData.append('datePlan', formState.inputs.datePlan.value);
        formData.append('typePlace', typePlace);
        formData.append('provinceName', province);
        formData.append('lat', location.lat);
        formData.append('lng', location.lng);
        formData.append('typePlan', typePlan);
        formData.append('countPlace', countPlace);
        await sendRequest(
          'http://localhost:5000/api/plans/autoplan/plans/plans',
          'POST',
          formData,
          {
            Authorization: 'Bearer ' + auth.token
          } 
        );
        history.push(`/${auth.userId}/plans`);
      }catch(err){}
    }
  
  };

  const switchModeHandler = () => {
    if (!isAddPlanMode) {
       setFormData(
       {
          ...formState.inputs,
       }, 
       formState.inputs.namePlan.isValid && formState.inputs.datePlan.isValid)
      setTpCount(true);

    } else {
       setFormData(
          {
             ...formState.inputs,
          }, 
          formState.inputs.namePlan.isValid && formState.inputs.datePlan.isValid
       );
       setTypePlace([]);
       setCountPlace(1);
       setTypePlan('popular');
       setTpCount(null);
       setProvince();


    }
    setIsAddPlanMode(preMode => !preMode);
 };

 const checkBoxHandler = (event) => {
    let tp = [...typePlace];
    if(event.target.checked){
      tp = [...tp, event.target.value];
      setTypePlace(tp);

    }else {
      tp = tp.filter(v => v !== event.target.value); 
      setTypePlace(tp);

    }
    setTpCount(tp.length);
    
 }


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/* {isLoading && <LoadingSpinner asOverlay />} */}
      <form className="place-form" onSubmit={placeSubmitHandler}>
      {isLoading && <LoadingSpinner asOverlay />}
      {/* {isLoading && <LoadingText/>} */}
        <Input
          id="namePlan"
          element="input" 
          type="text" 
          label="ชื่อเเผนท่องเที่ยว" 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText="Please enter a valid name." 
          onInput={inputHandler}
        />
         <Input
          id="datePlan"
          element="date" 
          type="date" 
          label="วันที่จะไป" 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText="Please enter a valid description (at least 5 characters)." 
          onInput={inputHandler}
        />
        {!isAddPlanMode && loadedProvinces && (
          <div className={`form-control`}>
          <label htmlFor="province"style={{fontWeight: 'bold',marginBottom: '0.5rem'}}>จังหวัด</label>
          <select value={province} onChange={(event)=>{setProvince(event.target.value)}} >
             {loadedProvinces.map(province => (
                <Option
                   key={province.id}
                   id={province.id}
                   name={province.name}
                />
             ))}
          </select>
       </div>
        )}
        {!isAddPlanMode && loadedTypePlaces && (
          <div>
            <div>
              <label htmlFor="typePlace" style={{fontWeight: 'bold',marginBottom: '0.5rem',display:'block'}}>ประเภทสถานที่</label>
            </div>
            {loadedTypePlaces.map(tp => (
              <label key={tp.id} style={{marginRight:'0.5rem'}}>
                <input type="checkbox" value={tp.id} onChange={checkBoxHandler} />
                {tp.typeName}
              </label>
            ))}
          </div>
        )}
        {!isAddPlanMode && !tpCount && <div style={{color:'red',marginBottom:'10px'}}>กรุณาเลือกประเภทสถานที่</div>}
        {!isAddPlanMode &&
          <div className="form-control">
            <label htmlFor="province"style={{fontWeight: 'bold',marginBottom: '0.5rem'}}>TypePlan </label>
             <select defaultValue={typePlan} onClick={(event)=>{setTypePlan(event.target.value)}}>
                <option selected value="popular">สถานที่ท่องเที่ยวยอดนิยม</option>
                <option value="near">สถานที่ท่องเที่ยวใกล้</option>
            </select>
          </div> 
        }
        {!isAddPlanMode &&
          <div className="form-control">
            <label htmlFor="province"style={{fontWeight: 'bold',marginBottom: '0.5rem'}}>จำนวนสถานที่ </label>
             <select defaultValue={countPlace} onClick={(event)=>{setCountPlace(event.target.value)}}>
                <option selected value={1}>1</option>
                <option selected value={2}>2</option>
                <option selected value={3}>3</option>
                <option selected value={4}>4</option>
                <option selected value={5}>5</option>
                <option selected value={6}>6</option>
                <option selected value={7}>7</option>
                {/* <option selected value={8}>8</option>
                <option selected value={9}>9</option>
                <option selected value={10}>10</option> */}
            </select>
          </div> 
        }
        

       <Picker getLocation={getLocation}/>
        <Button type="submit" disabled={(!formState.isValid) || (!tpCount)  }>
          {isAddPlanMode ? 'สร้างเเผนท่องเที่ยว' : 'จัดเเผนท่องเที่ยวอัตโนมัติ'}
        </Button>
      </form>
      <div style={{textAlign:"center",marginTop:"20px"}}>
        <Button inverse onClick={switchModeHandler}>
            สลับไป {isAddPlanMode ? 'จัดเเผนท่องเที่ยวอัตโนมัติ' : 'สร้างเเผนท่องเที่ยว'}
        </Button>
      </div>
      
    </React.Fragment>
    
  );
};

export default NewPlan;