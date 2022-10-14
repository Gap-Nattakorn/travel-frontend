
import React, { useReducer, useEffect, useCallback, useMemo, useContext, useState} from 'react';

import CommentForm from './CommentForm';
import CommentList from './CommentList';
import UpdateComment from './UpdateComment';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import useHttp from '../../shared/hooks/http';

import {AuthContext} from '../../shared/context/auth-context';
import Button from '../../shared/components/FormElements/Button';


const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'UPDATE':
      let listCopy = [...currentIngredients];
      currentIngredients = listCopy.filter((item) => {
       if (item.id === action.comment.id) {
           item.comment = action.comment.comment;
           item.rating = action.comment.rating;
        }

        return item;
      });
      return currentIngredients;
    default:
      throw new Error('Should not get there!');
  }
};

const Comment = (props) => {
  const auth = useContext(AuthContext);
  const placeId = props.place;
  const [isComment, setIsComment] = useState(false);
  const [userComment, setUserComment] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  // const userComment = [];
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifer,
    clear
  } = useHttp();

  useEffect(() => {
    sendRequest(
      `http://localhost:5000/api/places/commentPlaces/${placeId}`,
      'GET'
    );

  }, [sendRequest, placeId])

  useEffect(() => {
    const loadedIngredients = [];
    if (data && !isLoading && !error && reqIdentifer === 'UPDATE_COMMENT') {
      dispatch({ type: 'UPDATE', comment: reqExtra });
      setUserComment({
        id: reqExtra.id,
        comment: reqExtra.comment,
        rating: reqExtra.rating,
        reviewer: reqExtra.reviewer,
        userName: reqExtra.userName
      })
      setShowUpdate(Prev => !Prev)
    } else if (data && !isLoading && !error && reqIdentifer === 'ADD_COMMENT') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.comment.id, ...reqExtra }
      });
      setUserComment({
        id: reqExtra.id,
        comment: reqExtra.comment,
        rating: reqExtra.rating,
        reviewer: reqExtra.reviewer,
        userName: reqExtra.userName
      })
      setIsComment(true); 
    } else if (!isLoading && !error && data) {
     data.comment.map(comment => {
        if(comment.reviewer === auth.userId){
          setUserComment({
              id: comment.id,
              comment: comment.comment,
              rating: comment.rating,
              reviewer: comment.reviewer,
              userName: comment.userName
          })
          setIsComment(true);
        }

        loadedIngredients.push({
          id: comment.id,
          comment: comment.comment,
          rating: comment.rating,
          reviewer: comment.reviewer,
          userName: comment.userName
     })
        
        });
      filteredCommentsHandler(loadedIngredients);

     }
 
    
  }, [data, reqExtra, reqIdentifer, isLoading, error, auth.userId]);


  const filteredCommentsHandler = filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  };

  const addCommentHandler = useCallback(ingredient => {
    Object.assign(ingredient, {placeId, reviewer: auth.userId});
    sendRequest(
      'http://localhost:5000/api/places/commentPlaces/places',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_COMMENT',
    );

  }, [sendRequest, auth.userId, placeId]);

  const updateCommentHandler = useCallback(
    ingredient => {
    Object.assign(ingredient, {placeId, reviewer: auth.userId});
      sendRequest(
        `http://localhost:5000/api/places/UpdateCommentPlaces/places`,
        'PATCH',
        JSON.stringify(ingredient),
        ingredient,
        'UPDATE_COMMENT'
      );
    },
    [sendRequest, auth.userId, placeId]
  );

  

  const ingredientList = useMemo(() => {
    return (
      <CommentList
        ingredients={userIngredients}
        // onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      {auth.isLoggedIn && !isComment && <CommentForm
        onAddIngredient={addCommentHandler}
        loading={isLoading}
        isComment={isComment}
        userComment={userComment}
      />}
      {auth.isLoggedIn && isComment && 
        <div className="center" style={{marginTop:"15px"}}>
          <Button onClick={()=>{setShowUpdate(Prev => !Prev)}}>เเก้ไขความคิดเห็น</Button>
        </div>
      }
      {showUpdate && <UpdateComment userComment={userComment} onUpdateItem={updateCommentHandler} loading={isLoading}  />}
      <section>
        {/* <Search onLoadIngredients={filteredCommentsHandler} /> */}
        {ingredientList}
      </section>
    </div>
  );
};

export default Comment;
