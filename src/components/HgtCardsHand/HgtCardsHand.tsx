import { Box, Grid } from '@mui/material';
import { DeckCardComponent } from '../DeckCard/DeckCardComponent';
import { DeckCard } from '../DeckCard/DeckCard.class';
import { FC } from 'react';
import { DeckCardConstructor } from '../DeckCard/DeckCard.model';

type HgtCardsHandProps = {
  cards: ReadonlyArray<DeckCard>;
  onClick?: (card: DeckCardConstructor) => void;
};

export const HgtCardsHand: FC<HgtCardsHandProps> = ({ cards, onClick }) => {
  return (
    <Grid item xs={12} sx={{ border: '1px solid' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }} gap={2}>
        {cards.map((card) => (
          <DeckCardComponent key={card.key} card={card} onClick={onClick} />
        ))}
      </Box>
    </Grid>
  );
};
