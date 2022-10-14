import React from 'react';

const Option = (props) => {
   return (
      <option key={props.id} value={props.id}>{props.name}</option>
   )
}

export default Option;
