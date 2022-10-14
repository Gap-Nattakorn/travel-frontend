import { useReducer, useCallback, useRef, useEffect } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      // console.log("SEND")
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not be reached!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);
  const activeHttpRequests = useRef([]);


  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback(
    (url, 
     method, 
     body, 
     reqExtra, 
     reqIdentifer,
     headers = {
      'Content-Type': 'application/json'
     }
     ) => {
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);


      dispatchHttp({ type: 'SEND', identifier: reqIdentifer });
      fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortCtrl.signal
      })
        .then(response => {

          activeHttpRequests.current = activeHttpRequests.current.filter(
            reqCtrl => reqCtrl !== httpAbortCtrl
          );
          
          return response.json();
          
        })
        .then(responseData => {
         
          dispatchHttp({
            type: 'RESPONSE',
            responseData: responseData,
            extra: reqExtra
          });
        })
        .catch(error => {
          console.log("ERROR" + error);
          dispatchHttp({
            type: 'ERROR',
            errorMessage: 'Something went wrong!'
          });
        });
    },
    []
  );

  useEffect(()=>{
    //console.log("test");
    return () => {
       activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
 },[])

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifer: httpState.identifier,
    clear: clear
  };
};

export default useHttp;
