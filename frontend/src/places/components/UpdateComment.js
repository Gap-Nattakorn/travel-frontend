import React, { useContext, useState } from 'react';
import ReactStars from "react-stars";

import {AuthContext} from '../../shared/context/auth-context';
import Card from '../../shared/components/UIElements/Card';
import LoadingIndicator from '../../shared/components/UIElements/LoadingIndicator';

import './CommentForm.css';
import Button from '../../shared/components/FormElements/Button';


const UpdateComment = (props) => {
  const [enteredTitle, setEnteredTitle] = useState(props.userComment.comment);
  const [enteredRating, setEnteredRating] = useState(props.userComment.rating);
  const auth = useContext(AuthContext);
  const userName = props.userComment.userName 
  const firstExample = {
    size: 30,
    value:  enteredRating ,
    edit: true,
    isHalf: true,
    a11y: true,
    onChange: (newValue) => {
      setEnteredRating(newValue);
    }
  };
  
  

  const submitHandler = event => {
    event.preventDefault();

    props.onUpdateItem({ comment: enteredTitle, rating: enteredRating, userName ,id: props.userComment.id});
  };
   return (
      <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div>{userName}</div>
          <div className="form-control">
            <input
              type="text"
              id="comment"
              value={enteredTitle}
              onChange={event => {
                setEnteredTitle(event.target.value);
              }}
            />
          </div>
          <div className="form-control">
              <ReactStars {...firstExample} />
          </div>
          <div className="ingredient-form__actions">
            <Button type="submit">บันทึกความคิดเห็น</Button>
            {props.loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
   )
}

export default UpdateComment
