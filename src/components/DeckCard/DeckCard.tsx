import { Box, Typography } from '@mui/material';
import { DeckCardProps } from './DeckCard.model';

export const DeckCard = ({ card, side, onClick }: DeckCardProps) => {
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
        border: '1px solid',
        padding: '2px',
      }}
      onClick={handleCardClick}
    >
      <Typography>{suit}</Typography>
      <Typography>{value}</Typography>
    </Box>
  );
};
