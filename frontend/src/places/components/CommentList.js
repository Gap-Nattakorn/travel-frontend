import React from 'react';
import ReactStars from "react-stars";
// import Avatar from '../../shared/components/UIElements/Avatar';

// import {AuthContext} from '../../shared/context/auth-context';
import './CommentList.css';

const CommentList = props => {

  // const auth = useContext(AuthContext);
  const firstExample = {
    size: 30,
    edit: false,
    isHalf: true,
    a11y: true,

  };



  return (
    <section className="ingredient-list">
      {/* <h2>Loaded Ingredients</h2> */}
      <ul>
        {props.ingredients.map(ig => (
          (<li key={ig.id} >
            <span>{ig.userName}</span>
            <span>{ig.comment}</span>
            <span><ReactStars {...firstExample} value={ig.rating} /></span>
          </li>)
        ))}
      </ul>
    </section>
  );
};

export default CommentList;


// onClick={props.onRemoveItem.bind(this, ig.id)}