import { Box, Typography } from '@mui/material';
import { DeckCardProps } from './DeckCard.model';

export const DeckCardComponent = ({ card, isOffside, onClick }: DeckCardProps) => {
  const { key, value, suit } = card;

  const handleCardClick = () => {
    onClick?.(card);
  };

  return (
    <Box
      key={key}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        padding: '2px',
        minWidth: '50px',
        minHeight: '70px',
      }}
      onClick={handleCardClick}
    >
      {isOffside ? (
        <>
          <Typography>?</Typography>
          <Typography>?</Typography>
        </>
      ) : (
        <>
          <Typography>{suit}</Typography>
          <Typography>{value}</Typography>
        </>
      )}
    </Box>
  );
};
