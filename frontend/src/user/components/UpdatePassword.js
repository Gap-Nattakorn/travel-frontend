import React,{useContext} from 'react';
import {useParams, useHistory} from 'react-router-dom';

// import ImageUpdate from '../../shared/components/FormElements/ImageUpdate';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
// import Card from '../../shared/components/UIElements/Card';
import {
   VALIDATOR_REQUIRE,
   VALIDATOR_PASSWORD,
   VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import '../pages/UserForm.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';


const UpdateUser = () => {
   const auth = useContext(AuthContext);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   // const [loadedUser, setLoadedUser] = useState();
   const userId = useParams().userId;
   const history = useHistory();

   const [formState, inputHandler] = useForm({
      password: {
         value: '',
         isValid: false
      },
      confirmPassword: {
         value: '',
         isValid: false
      }
   }, false);

   // useEffect(()=>{
   //    const fetchUser = async () => {
   //       try {
   //          const responseData = await sendRequest(
   //             `http://localhost:5000/api/users/edit/${userId}`
   //          );
   //          setLoadedUser(responseData.user);
   //          setFormData(
   //             {
   //                // email: {
   //                //    value: responseData.user.email,
   //                //    isValid: true
   //                // },
   //                name: {
   //                   value: responseData.user.name,
   //                   isValid: true
   //                },
   //                image: {
   //                   value: responseData.user.image,
   //                   isValid: true
   //                }

   //             },
   //             true
   //          );
   //       } catch(err) {}

   //    };
   //    fetchUser();
      
   // },[sendRequest, userId, setFormData])


   const placeUpdateSubmitHandler = async event => {
      event.preventDefault();
      try {
         const formData = new FormData();
         formData.append('password', formState.inputs.password.value);
         await sendRequest(
            `http://localhost:5000/api/users/editPassword/${userId}`,
            'PATCH',
            formData,
            {
               Authorization: 'Bearer ' + auth.token
            }
         );
         //auth.userName = formState.inputs.name.value;
         history.push('/');
      } catch(err) {

      }

   };


   return (
      <React.Fragment>
         {isLoading && <LoadingSpinner asOverlay />}
         <ErrorModal error={error} onClear={clearError} />
         {!isLoading && <form style={{marginTop:'20px'}} className="place-form" onSubmit={placeUpdateSubmitHandler}>
         <Input
               id="password"
               element="input"
               label="รหัสผ่าน"
               type="password"
               validators={[VALIDATOR_REQUIRE(),VALIDATOR_MINLENGTH(6)]}
               errorText = "กรุณากรอกรหัสผ่านอย่างน้อย 6 ตัว"
               onInput={inputHandler} 
            />
            <Input
               id="confirmPassword"
               element="input"
               label="ยืนยันรหัสผ่าน"
               type="password"
               validators={[VALIDATOR_PASSWORD(formState.inputs.password.value),VALIDATOR_MINLENGTH(6)]}
               errorText = "รหัสผ่านไม่ตรงกัน"
               onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
               เปลี่ยนรหัสผ่าน
            </Button>
            </form>}
      </React.Fragment>

   );
}

export default UpdateUser;
