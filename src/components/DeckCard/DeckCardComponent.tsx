import { Box, Typography } from '@mui/material';
import { CARD_MASK_TYPE, DeckCardProps } from './DeckCard.model';
import { HgtDiscardMask } from '../HgtCardMask/HgtDiscardMask';
import { HgtCopinhoMask } from '../HgtCardMask/HgtCopinhoMask';

export const DeckCardComponent = ({ card, isOffside, onClick, mask }: DeckCardProps) => {
  const { key, value, suit } = card;

  const handleCardClick = () => {
    onClick?.(card);
  };

  return (
    <Box
      key={key}
      sx={{
        position: 'relative',
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
      {mask === CARD_MASK_TYPE.Discard && <HgtDiscardMask />}
      {mask === CARD_MASK_TYPE.Copinho && <HgtCopinhoMask />}
    </Box>
  );
};
