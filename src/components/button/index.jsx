import React from 'react';
import { Button } from '@mui/material';

const ButtonComponent = ({ variant = 'contained', color = 'primary', onClick, children, ...props }) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
