import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { db } from 'src/config/firebaseConfiguration';
import { Table } from '../Table/Table';
import { Box, Button, Grid } from '@mui/material';
import { doc, onSnapshot } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { isEmpty, toString } from 'lodash';
import { DeckCardComponent } from 'src/components/DeckCard/DeckCardComponent';
import { DeckCard } from 'src/components/DeckCard/DeckCard.class';
import { DeckCardConstructor } from 'src/components/DeckCard/DeckCard.model';
import { saveNapoleaoSplitedCardsInFirebase, saveRoundCardsPlayed } from 'src/utils/napoleaoGame.util';
import { useCurrentUser } from 'src/hooks/useCurrentUser.hook';
import { BoardCenter } from '../BoardCenter/BoardCenter';

export const NapoleaoGameOnline = () => {
  const { lobbyId } = useParams();
  const lobbyIdString = toString(lobbyId);
  const currentUser = useCurrentUser();
  const currentPlayerIndex = toString(currentUser?.uid);

  const [playersOnline, setPlayersOnline] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  const playersIdArray = useMemo(() => {
    const playersOnlineArray = Array.isArray(playersOnline) ? playersOnline : [];
    return playersOnlineArray.map(({ uid }) => uid);
  }, [playersOnline]);

  const startGame = useCallback(() => {
    saveNapoleaoSplitedCardsInFirebase({ idToConnect: lobbyIdString, playersOnline: playersIdArray });
    setGameStarted(true);
  }, [playersIdArray]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [selectedCards, setSelectedCards] = useState<Record<number, DeckCardConstructor>>({});
  const [roundsCards, setRoundsCards] = useState<Record<number, Record<string, DeckCardConstructor>>>({});
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundWinner, setRoundWinner] = useState();
  const [superSuit, setSuperSuit] = useState('joker');
  const [copinho, setCopinho] = useState('joker');
  const [splitedCards, setSplitedCards] = useState<Record<string, DeckCard[]>>();

  const copinhoNumberRef = useRef();
  const copinhoSuitRef = useRef();

  const finishRound = useCallback(() => {
    setRoundNumber((prev) => prev + 1);
  }, []);

  const handleClickCard = useCallback(
    (playerId: string, card: DeckCardConstructor) => {
      saveRoundCardsPlayed({
        idToConnect: lobbyIdString,
        roundNumber,
        playerId,
        card,
      });
    },
    [lobbyIdString, roundNumber],
  );
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (roundsCards[roundNumber]) {
      setSelectedCards(roundsCards[roundNumber]);
    }
  }, [roundsCards, roundNumber]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'onlineLobby', lobbyIdString), (snap) => {
      const lobbyData = snap.data();
      if (!!lobbyData) {
        const { players, playersCards, rounds } = lobbyData;
        setPlayersOnline(players);

        if (!!playersCards) {
          setSplitedCards(playersCards);
        }

        if (!!rounds) {
          setRoundsCards(rounds);
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
            <Grid
              item
              xs={6}
              sx={{ border: '1px solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <DeckCardComponent key={'player_01'} card={{ key: 'player_01', value: 2, suit: '' }} isOffside />
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ border: '1px solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <DeckCardComponent key={'player_02'} card={{ key: 'player_02', value: 2, suit: '' }} isOffside />
            </Grid>
          </Grid>

          <Grid container sx={{ marginBottom: '24px' }}>
            <Grid
              item
              xs={2}
              sx={{ border: '1px solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <DeckCardComponent key={'player_03'} card={{ key: 'player_03', value: 2, suit: '' }} isOffside />
            </Grid>
            <Grid item xs={8} sx={{ border: '1px solid' }}>
              <BoardCenter
                selectedCards={selectedCards}
                currentPlayerIndex={currentPlayerIndex}
                playersIdArray={playersIdArray}
              />
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ border: '1px solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <DeckCardComponent key={'player_04'} card={{ key: 'player_04', value: 2, suit: '' }} isOffside />
            </Grid>
          </Grid>

          <Grid container sx={{ marginBottom: '24px', marginTop: '96px' }}>
            <Grid item xs={12} sx={{ border: '1px solid' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }} gap={2}>
                {(splitedCards?.[currentPlayerIndex] ?? []).map((card) => (
                  <DeckCardComponent
                    key={card.key}
                    card={card}
                    onClick={(card) => handleClickCard(currentPlayerIndex, card)}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Table>
  );
};
