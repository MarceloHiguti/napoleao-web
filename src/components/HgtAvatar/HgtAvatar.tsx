import { Box } from '@mui/material';
import { FC } from 'react';

type HgtAvatarProps = {
  initials: string;
};

export const HgtAvatar: FC<HgtAvatarProps> = ({ initials }) => {
  return (
    <Box
      sx={{
        padding: '16px',
        borderRadius: '50%',
        border: '1px solid white',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      {initials}
    </Box>
  );
};
