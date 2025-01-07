import { Box } from '@mui/material';
import { FC } from 'react';

type HgtDiscardMaskProps = {};

export const HgtDiscardMask: FC<HgtDiscardMaskProps> = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '24px',
        height: '24px',
        backgroundColor: 'red',
        borderRadius: '50%',
        top: '-12px',
        right: '-12px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      X
    </Box>
  );
};
