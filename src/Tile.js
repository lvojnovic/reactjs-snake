import React from 'react';

import './App.css';

function Tile(props) {
  const occupiedClass = props.occupied ? 'occupied-tile' : '';
  const foodClass = props.food ? 'food-tile' : '';
  return (
    <div className={`tile ${occupiedClass} ${foodClass}`} >
      {props.value}
    </div>
  );
}

export default Tile;
