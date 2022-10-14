import React, { useContext, useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
//import Option from '../../shared/components/FormElements/Option';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_REQUIRE, 
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import './PlaceForm.css';



const NewPlace = () => {
  const auth = useContext(AuthContext);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedProvinces, setLoadedProvinces] = useState();
  const [opening, setOpening] = useState([]);
  const [tpCount, setTpCount] = useState();

  // const date = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  //const [province, setProvince] = useState();
  const [formState, inputHandler] = useForm(
    {
       title: {
         value:'',
         isValid: false
       },
       description: {
         value:'',
         isValid: false
       },
       address: {
         value:'',
         isValid: false
       },
       provinceName: {
         value:'',
         isValid: false
       },
       typeName: {
         value:'',
         isValid: false
       },
       image:{
         value: null,
         isValid: false
       }
     }, 
     false
  );

  const history = useHistory();

  useEffect(() => {
    const fetchProvinces = async () => {
       try{
          const responseProvinces = await sendRequest(
             `http://localhost:5000/api/places/province/places`
          );
          setLoadedProvinces(responseProvinces.provinces);
          // console.log(responseProvinces.provinces);
       }catch(err){

       }  
    }

    fetchProvinces();
    // console.log(loadedProvinces);
 }, [sendRequest]);
  
  const placeSubmitHandler = async event => {
    event.preventDefault();
    try{
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('provinceName', formState.inputs.provinceName.value);
      formData.append('typeName', formState.inputs.typeName.value);
      formData.append('creator', auth.userId);
      formData.append('image', formState.inputs.image.value);
      formData.append('opening', opening);

      await sendRequest(
        'http://localhost:5000/api/places',
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token
        } 
      );
      // Redirect the user to a different page
      history.push('/');
    }catch(err){

    }
    
  };

//   const selectHandler = event => {
//     setProvince(event.target.value);
//  }

const checkBoxHandler = (event) => {
  let d = [...opening];
  if(event.target.checked){
    //console.log(tp);
    d = [...d, event.target.value];
    setOpening(d.sort());
    //setTpCount(tp.length);

  }else {
    d = d.filter(v => v !== event.target.value); 
    setOpening(d.sort());
    //setTpCount(tp.length);

  }
  // console.log(d.length);
  // console.log(event.target.checked);
  // console.log(d.sort());
  setTpCount(d.length);
  
}

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input" 
          type="text" 
          label="ชือสถานที่ท่องเที่ยว" 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText="กรุณากรอกชื่อสถานที่ท่องเที่ยว" 
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea" 
          label="รายละเอียดสถานที่ท่องเที่ยว" 
          validators={[VALIDATOR_MINLENGTH(5)]} 
          errorText="กรูณากรอกรายละเอียดสถานที่ท่องเที่ยว" 
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input" 
          label="ที่อยู่" 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText="กรุณากรอกที่อยู่สถานที่ท่องเที่ยว" 
          onInput={inputHandler}
        />
        <Input
          id="provinceName"
          element="input" 
          label="จังหวัด" 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText="กรุณากรอกจังหวัดของสถานที่ท่องเที่ยว" 
          onInput={inputHandler}
        />
        <Input
          id="typeName"
          element="input" 
          label="ประเภทสถานที่ท่องเที่ยว" 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText="กรุณากรอกประเภทสถานที่ท่องเที่ยว" 
          onInput={inputHandler}
        />
        <div>
          <div>
            <label htmlFor="opening" style={{fontWeight: 'bold',marginBottom: '0.5rem',display:'block'}}>วันที่เปิด</label>
          </div>
          <label key={0} style={{marginRight:'0.5rem'}}>
            <input type="checkbox" value={0} onChange={checkBoxHandler} />
            จันทร์           
          </label>
          <label key={1} style={{marginRight:'0.5rem'}}>
            <input type="checkbox" value={1} onChange={checkBoxHandler} />
            อังคาร           
          </label>
          <label key={2} style={{marginRight:'0.5rem'}}>
            <input type="checkbox" value={2} onChange={checkBoxHandler} />
            พุธ           
          </label>
          <label key={3} style={{marginRight:'0.5rem'}}>
            <input type="checkbox" value={3} onChange={checkBoxHandler} />
            พฤหัสบดี           
          </label>
          <label key={4} style={{marginRight:'0.5rem'}}>
            <input type="checkbox" value={4} onChange={checkBoxHandler} />
            ศุกร์           
          </label>
          <label key={5} style={{marginRight:'0.5rem'}}>
            <input type="checkbox" value={5} onChange={checkBoxHandler} />
            เสาร์           
          </label>
          <label key={6} style={{marginRight:'0.5rem'}}>
            <input type="checkbox" value={6} onChange={checkBoxHandler} />
            อาทิตย์           
          </label>
        </div>
        <ImageUpload 
          id="image" 
          onInput={inputHandler} 
          errorText="กรุณาใส่รูปภาพ"
        />
        <Button type="submit" disabled={(!formState.isValid) || (!tpCount)}>สร้างสถานที่ท่องเที่ยว</Button>
      </form>
    </React.Fragment>
    
  );
};

export default NewPlace;