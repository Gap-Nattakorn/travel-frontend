import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import {
   VALIDATOR_EMAIL, 
   VALIDATOR_MINLENGTH,
   VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
   const auth = useContext(AuthContext);
   const [isLoginMode, setIsLoginMode] = useState(true);
   const {isLoading, error, sendRequest, clearError } = useHttpClient();
   const history = useHistory();

   const [formState, inputHandler, setFormData] = useForm({
      email: {
         value: '',
         isValid: false 
      },
      password: {
         value: '',
         isValid: false
      }
   }, false); 

   const authSubmitHandler = async event => {
      event.preventDefault();

      if(isLoginMode) {
         try {
            const responseData = await sendRequest(
               'http://localhost:5000/api/users/login',
               'POST',
               JSON.stringify({
                  email: formState.inputs.email.value,
                  password: formState.inputs.password.value
               }),
               {
                  'Content-Type': 'application/json'
               }
            );
            
            auth.login(responseData.userId, responseData.userName, responseData.status, responseData.token);
            history.push(`/`);

         } catch(err){
            
         }
           
      } else {
         try {
            const formData =  new FormData();
            formData.append('email', formState.inputs.email.value);
            formData.append('name', formState.inputs.name.value);
            formData.append('password', formState.inputs.password.value);
            formData.append('image', formState.inputs.image.value);
            const responseData = await sendRequest(
               'http://localhost:5000/api/users/signup',
               'POST',
              formData
            );
            auth.login(responseData.userId, responseData.userName, responseData.status, responseData.token);
            history.push(`/`);

         } catch(err) {
            
         }
      }

   };

   const switchModeHandler = () => {
      if (!isLoginMode) {
         setFormData(
         {
            ...formState.inputs,
            name: undefined,
            image: undefined
         }, 
         formState.inputs.email.isValid && formState.inputs.password.isValid)
      } else {
         setFormData(
            {
               ...formState.inputs,
               name: {
                  value:'',
                  isValid: false
               },
               image: {
                  value: null,
                  isValid: false
               }
            }, 
            false
         );
         
      }
      setIsLoginMode(preMode => !preMode);

   };

   
   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError}/>
         <Card className="authentication">
            {isLoading && <LoadingSpinner asOverlay/>}
            <h2>{isLoginMode ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
               {!isLoginMode && 
                  <Input 
                     element="input"
                     id="name"
                     type="text"
                     label="ชื่อ-นามสกุล"
                     validators={[VALIDATOR_REQUIRE()]}
                     errorText="กรุณากรอกชื่อ-นามสกุล"
                     onInput={inputHandler}
                  />
               }
               {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="กรุณาเลือกรูปภาพ" />}
               <Input 
                  element="input"
                  id="email"
                  type="email"
                  label="อีเมล"
                  validators={[VALIDATOR_EMAIL()]}
                  errorText="กรุณากรอกอีเมลที่ถูกต้อง"
                  onInput={inputHandler}
               />
               <Input 
                  element="input"
                  id="password"
                  type="password"
                  label="รหัสผ่าน"
                  validators={[VALIDATOR_MINLENGTH(6)]}
                  errorText="กรุณากรอกรหัสผ่านอย่างน้อย 6 ตัว"
                  onInput={inputHandler}
               />
               <Button type="submit" disabled={!formState.isValid}>
                  {isLoginMode ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
               </Button>
            </form>
            <Button inverse onClick={switchModeHandler}>
               สลับไป {isLoginMode ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
            </Button>
         </Card>
      </React.Fragment>
      
   );
}

export default Auth;
