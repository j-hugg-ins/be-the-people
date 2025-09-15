import React from 'react';
import type { ButtonProps } from '../../../types/button';
import './Button.css';

const Button: React.FC<ButtonProps> = ({ 
  text, 
  variant = 'primary', 
  size = 'medium',
  type = 'button',
  disabled = false,
  onClick,
  children
}) => {
  return (
    <button 
      type={type}
      className={`button ${variant} ${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children || text}
    </button>
  );
};

export default Button;
