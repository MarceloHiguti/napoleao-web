import { Box, Button } from '@mui/material';
import { FC, useState } from 'react';
import { DeckCard } from 'src/components/DeckCard/DeckCard.class';
import { HgtAvatar } from 'src/components/HgtAvatar/HgtAvatar';
import { HgtCardsHand } from 'src/components/HgtCardsHand/HgtCardsHand';
import { useNapoleaoGameOnlineContext } from './NapoleaoGameOnlineContext';
import { DeckCardComponent } from 'src/components/DeckCard/DeckCardComponent';
import { setNextRound } from 'src/utils/napoleaoGame.util';

type ChooseNapoleaoProps = {
  userCards?: ReadonlyArray<DeckCard>;
};

export const ChooseNapoleao: FC<ChooseNapoleaoProps> = () => {
  const { lobbyId, splitedCards, playersOnline, currentUser, gameProps } = useNapoleaoGameOnlineContext();
  console.log('splitedCards', splitedCards);
  console.log('playersOnline', playersOnline);
  console.log('currentUser', currentUser);
  console.log('gameProps', gameProps);
  const [napoleaoNumber, setNapoleaoNumber] = useState('10');

  const user = playersOnline.find(({ uid }) => uid === currentUser.uid);

  if (!user) {
    return null;
  }

  const isButtonDisabled = (napoleaoQuantity: string) =>
    gameProps.playerIndexTurn !== user.index || napoleaoQuantity <= napoleaoNumber;

  const handleChooseNapoleao = (quantity: string) => {
    if (quantity !== 'mesa') {
      setNapoleaoNumber(quantity);
    }
    setNextRound({ idToConnect: lobbyId, playerIndexTurn: user.index, roundNumber: 0 });
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <HgtAvatar initials={'M1'} />
        <HgtAvatar initials={'M2'} />
        <HgtAvatar initials={'M3'} />
        <HgtAvatar initials={'M4'} />
      </Box>

      <Box
        sx={{
          height: '500px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        {(splitedCards?.['pile'] ?? []).map((card) => (
          <DeckCardComponent key={card.key} card={card} />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <HgtCardsHand cards={splitedCards?.[currentUser?.uid]} />
        <HgtAvatar initials={'EU'} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {['11', '12', '13', '14', '15', '16', 'mesa'].map((napoleaoQuantity) => (
            <Button
              variant="contained"
              onClick={() => handleChooseNapoleao(napoleaoQuantity)}
              disabled={isButtonDisabled(napoleaoQuantity)}
            >
              {napoleaoQuantity}
            </Button>
          ))}
        </Box>
      </Box>
      <Button
        variant="contained"
        sx={{ marginTop: '32px' }}
        // onClick={() => handleChooseNapoleao(napoleaoQuantity)}
      >
        Start game
      </Button>
    </Box>
  );
};
