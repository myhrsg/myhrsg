import React from 'react';
import './StarBorder.css';

const StarBorder = ({
  as: Component = 'button',
  children,
  className = '',
  color = '#22d3ee', // Cyan-400            
  speed = '3s',
  ...props
}) => {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        '--border-color': color,
        '--speed': speed
      }}
      {...props}
    >
      <div className="star-border-outer">
        <div className="star-border-inner">
          {children}
        </div>
      </div>
    </Component>
  );
};

export default StarBorder;
