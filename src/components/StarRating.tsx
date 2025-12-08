
// components/StarRating.js
'use client'; 
import { useState } from 'react';

interface StarRating{
    initialRating?: number;
    totalStars?: number;
    onRatingChange: (rating: number) => void;
};

const StarRating = ({ initialRating = 0, totalStars = 5, onRatingChange }: StarRating) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (index:number) => {
    setRating(index);
    if (onRatingChange) {
      onRatingChange(index);
    }
  };

  const handleMouseEnter = (index:number) => {
    setHover(index);
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  return (
    <div>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className="star"
            style={{
              cursor: 'pointer',
              fontSize: '25px',
              textShadow: '0px 3px 5px rgba(0,0,0,0.1)',
              color: (hover || rating) >= starValue ? '#ffc107' : '#cacbcf', 
            }}
          >
            &#9733; 
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;