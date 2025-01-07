import { Box } from '@mui/material';
import { FC } from 'react';

type HgtCopinhoMaskProps = {};

export const HgtCopinhoMask: FC<HgtCopinhoMaskProps> = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '24px',
        height: '24px',
        backgroundColor: 'purple',
        borderRadius: '50%',
        top: '-12px',
        right: '-12px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      !
    </Box>
  );
};
