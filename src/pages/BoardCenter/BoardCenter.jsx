import { useMemo } from 'react';
import { Box } from '@mui/material';
import { DeckCardComponent } from '../../components/DeckCard/DeckCardComponent';

export const BoardCenter = ({ selectedCards, currentPlayerIndex, playersIdArray }) => {
  const otherPlayers = useMemo(
    () => playersIdArray.filter((othersIds) => othersIds !== currentPlayerIndex),
    [playersIdArray],
  );
  console.log('otherPlayers', otherPlayers);
  console.log('selectedCards', selectedCards);

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Box>
          {selectedCards[otherPlayers[0]] && (
            <DeckCardComponent key={selectedCards[otherPlayers[0]].key} card={selectedCards[otherPlayers[0]]} />
          )}
        </Box>
        <Box>
          {selectedCards[otherPlayers[1]] && (
            <DeckCardComponent key={selectedCards[otherPlayers[1]].key} card={selectedCards[otherPlayers[1]]} />
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <Box></Box>
        <Box>
          {selectedCards[otherPlayers[2]] && (
            <DeckCardComponent key={selectedCards[otherPlayers[2]].key} card={selectedCards[otherPlayers[2]]} />
          )}
        </Box>
        <Box></Box>
        <Box>
          {selectedCards[otherPlayers[3]] && (
            <DeckCardComponent key={selectedCards[otherPlayers[3]].key} card={selectedCards[otherPlayers[3]]} />
          )}
        </Box>
        <Box></Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
        <Box>
          {selectedCards?.[currentPlayerIndex] && (
            <DeckCardComponent key={selectedCards[currentPlayerIndex].key} card={selectedCards[currentPlayerIndex]} />
          )}
        </Box>
      </Box>
    </Box>
  );
};
