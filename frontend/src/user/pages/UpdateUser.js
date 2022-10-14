import React,{useEffect, useState, useContext} from 'react';
import {useParams, useHistory} from 'react-router-dom';

import ImageUpdate from '../../shared/components/FormElements/ImageUpdate';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
// import Card from '../../shared/components/UIElements/Card';
import {
   VALIDATOR_REQUIRE,
   // VALIDATOR_PASSWORD
} from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import './UserForm.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import UpdatePassword from '../components/UpdatePassword';

const UpdateUser = (props) => {
   const auth = useContext(AuthContext);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const [loadedUser, setLoadedUser] = useState();
   const userId = useParams().userId;
   const history = useHistory();

   const [formState, inputHandler, setFormData] = useForm({
      // email: {
      //    value: '',
      //    isValid: false
      // },
      name: {
         value: '',
         isValid: false
      },
      image: {
         value: '',
         isValid: false
      },
      password: {
         value: '',
         isValid: false
      },
      confirmPassword: {
         value: '',
         isValid: false
      }
   }, false);

   useEffect(()=>{
      const fetchUser = async () => {
         try {
            const responseData = await sendRequest(
               `http://localhost:5000/api/users/edit/${userId}`
            );
            setLoadedUser(responseData.user);
            setFormData(
               {
                  // email: {
                  //    value: responseData.user.email,
                  //    isValid: true
                  // },
                  name: {
                     value: responseData.user.name,
                     isValid: true
                  },
                  image: {
                     value: responseData.user.image,
                     isValid: true
                  }

               },
               true
            );
         } catch(err) {}

      };
      fetchUser();
      
   },[sendRequest, userId, setFormData])


   const placeUpdateSubmitHandler = async event => {
      event.preventDefault();
      try {
         const formData = new FormData();
         formData.append('name', formState.inputs.name.value);
         formData.append('image', formState.inputs.image.value);
         await sendRequest(
            `http://localhost:5000/api/users/edit/${userId}`,
            'PATCH',
            formData,
            {
               Authorization: 'Bearer ' + auth.token
            }
         );
         auth.userName = formState.inputs.name.value;
         history.push('/');
      } catch(err) {

      }

   };

   if(isLoading) {
      return (
         <div className="center">
           <LoadingSpinner asOverlay />
         </div>
      );
   }

   // if(!loadedUser && !error) {
   //    return (
   //       <div className="center">
   //          <Card>
   //             <h2>Could not find place!</h2>
   //          </Card>
   //       </div>
   //    );
   // }

   return (
      <React.Fragment>
         {/* {isLoading && <LoadingSpinner asOverlay />} */}
         <ErrorModal error={error} onClear={clearError} />
         {!isLoading && loadedUser && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input
               id="name"
               element="input"
               label="ชื่อ-นามสกุล"
               validators={[VALIDATOR_REQUIRE()]}
               errorText = "กรุณากรอกชื่อ-นามสกุล"
               onInput={inputHandler}
               initialValue={loadedUser.name}
               initialValid={true}
            />
            <ImageUpdate
               id="image"
               image={loadedUser.image}
               onInput={inputHandler}
               errorText="กรุณาเลือกรูปภาพ"
            />
            <Button type="submit" disabled={!formState.isValid}>
               อัพเดตข้อมูล
            </Button>
         </form>}
         {!isLoading && <UpdatePassword/>}
      </React.Fragment>

   );
}

export default UpdateUser;
