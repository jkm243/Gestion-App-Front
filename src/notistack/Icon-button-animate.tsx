"use client";

import { m } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
// @mui
import { Box, IconButton, IconButtonProps } from '@mui/material';

// ----------------------------------------------------------------------

interface IconButtonAnimateProps extends IconButtonProps {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const IconButtonAnimate = forwardRef<HTMLButtonElement, IconButtonAnimateProps>(
  ({ children, size = 'medium', ...other }, ref) => (
    <AnimateWrap size={size}>
      <IconButton size={size} ref={ref} {...other}>
        {children}
      </IconButton>
    </AnimateWrap>
  )
);

IconButtonAnimate.displayName = 'IconButtonAnimate';

export default IconButtonAnimate;

// ----------------------------------------------------------------------

const varSmall = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
};

const varMedium = {
  hover: { scale: 1.09 },
  tap: { scale: 0.97 },
};

const varLarge = {
  hover: { scale: 1.08 },
  tap: { scale: 0.99 },
};

interface AnimateWrapProps {
  children: ReactNode;
  size: 'small' | 'medium' | 'large';
}

function AnimateWrap({ size, children }: AnimateWrapProps) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <Box
      component={m.div}
      whileTap="tap"
      whileHover="hover"
      variants={(isSmall && varSmall) || (isLarge && varLarge) || varMedium}
      sx={{
        display: 'inline-flex',
      }}
    >
      {children}
    </Box>
  );
}
