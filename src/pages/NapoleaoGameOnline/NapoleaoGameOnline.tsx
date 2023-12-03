import { useCallback, useEffect, useRef, useState } from 'react';
import { db } from 'src/config/firebaseConfiguration';
import { Table } from '../Table/Table';
import { Box, Button, Grid } from '@mui/material';
import { doc, onSnapshot } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { isEmpty, toString } from 'lodash';
import { DeckCardComponent } from 'src/components/DeckCard/DeckCardComponent';
import { DeckCard } from 'src/components/DeckCard/DeckCard.class';
import { DeckCardConstructor } from 'src/components/DeckCard/DeckCard.model';
import { saveNapoleaoSplitedCardsInFirebase } from 'src/utils/napoleaoGame.util';
import { useCurrentUser } from 'src/hooks/useCurrentUser.hook';

export const NapoleaoGameOnline = () => {
  const { lobbyId } = useParams();
  const lobbyIdString = toString(lobbyId);
  const currentUser = useCurrentUser();
  const currentPlayerIndex = toString(currentUser?.uid);

  const [playersOnline, setPlayersOnline] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = useCallback(() => {
    const playersOnlineArray = Array.isArray(playersOnline) ? playersOnline : [];
    const playersIdArray = playersOnlineArray.map(({ uid }) => uid);
    saveNapoleaoSplitedCardsInFirebase(lobbyIdString, playersIdArray);
    setGameStarted(true);
  }, [playersOnline]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [selectedCards, setSelectedCards] = useState<Record<number, DeckCardConstructor>>({});
  const [roundWinner, setRoundWinner] = useState();
  const [superSuit, setSuperSuit] = useState('joker');
  const [copinho, setCopinho] = useState('joker');
  const [splitedCards, setSplitedCards] = useState<Record<string, DeckCard[]>>();

  const copinhoNumberRef = useRef();
  const copinhoSuitRef = useRef();

  const handleClickCard = useCallback(
    (playerNumber: number, card: DeckCardConstructor) => {
      setSelectedCards((prevSelectedCards) => ({ ...prevSelectedCards, [playerNumber]: card }));
    },
    [selectedCards],
  );
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'onlineLobby', lobbyIdString), (snap) => {
      const lobbyData = snap.data();
      if (!!lobbyData) {
        const { players, playersCards } = lobbyData;
        setPlayersOnline(players);

        if (!!playersCards) {
          setSplitedCards(playersCards);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Table>
      {!gameStarted && (
        <Button variant="contained" onClick={startGame}>
          start game
        </Button>
      )}
      {!!playersOnline && playersOnline.map(({ name, uid }) => <div key={uid}>{name}</div>)}

      {!isEmpty(splitedCards) && (
        <>
          <Grid container sx={{ marginBottom: '24px' }}>
            <Grid item xs={5}></Grid>
            {selectedCards[0] && (
              <Grid item xs={2} sx={{ border: '1px solid' }}>
                <DeckCardComponent key={selectedCards[0].key} card={selectedCards[0]} />
              </Grid>
            )}
          </Grid>

          <Grid container sx={{ marginBottom: '24px', marginTop: '96px' }}>
            <Grid item xs={12} sx={{ border: '1px solid' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }} gap={2}>
                {(splitedCards?.[currentPlayerIndex] ?? []).map((card) => (
                  <DeckCardComponent key={card.key} card={card} onClick={(card) => handleClickCard(0, card)} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Table>
  );
};
