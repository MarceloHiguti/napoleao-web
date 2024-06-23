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
import { LobbyData, PlayersInLobby } from 'src/models/napoleaoGame.model';
import { napoleaoRoundWinner } from 'src/utils/napoleaoRules.util';
import { NapoleaoRoundWinnerResult } from 'src/models/napoleaoRules.util.model';

export const NapoleaoGameOnline = () => {
  const { lobbyId } = useParams();
  const lobbyIdString = toString(lobbyId);
  const currentUser = useCurrentUser();
  const currentPlayerIndex = toString(currentUser?.uid);

  const [playersOnline, setPlayersOnline] = useState<ReadonlyArray<PlayersInLobby & { isBot: boolean }>>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const playersIdArray = useMemo(() => {
    const playersOnlineArray = Array.isArray(playersOnline) ? playersOnline : [];
    return playersOnlineArray.map(({ uid }) => uid);
  }, [playersOnline]);

  const otherPlayersIdArray = useMemo(() => {
    const playersOnlineArray = Array.isArray(playersOnline) ? playersOnline : [];
    return playersOnlineArray.filter(({ isBot }) => isBot).map(({ uid }) => uid);
  }, [playersOnline]);

  const startGame = useCallback(() => {
    saveNapoleaoSplitedCardsInFirebase({
      idToConnect: lobbyIdString,
      playersOnline: playersOnline.map(({ uid }) => uid),
    });
    setGameStarted(true);
  }, [playersIdArray]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [selectedCards, setSelectedCards] = useState<Record<number, DeckCardConstructor>>({});
  const [roundsCards, setRoundsCards] = useState<Record<number, Record<string, DeckCardConstructor>>>({});
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundWinner, setRoundWinner] = useState<NapoleaoRoundWinnerResult | null>();
  const [superSuit, setSuperSuit] = useState('joker');
  const [copinho, setCopinho] = useState('joker');
  const [splitedCards, setSplitedCards] = useState<Record<string, DeckCard[]>>();

  const copinhoNumberRef = useRef();
  const copinhoSuitRef = useRef();

  const finishRound = useCallback(() => {
    setRoundWinner(napoleaoRoundWinner({ selectedCards }));
    setRoundNumber((prev) => prev + 1);
  }, [selectedCards]);

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
      const lobbyData = snap.data() as LobbyData | undefined;
      if (!!lobbyData) {
        const { players, playersCards, rounds } = lobbyData;
        const playersOnline = players.map((onlinePlayer) => ({ ...onlinePlayer, isBot: false }));

        setPlayersOnline(playersOnline);

        if (!!playersCards) {
          setSplitedCards(playersCards);
          const onlinePlayers = players.map(({ uid }) => uid);
          const otherPlayers = Object.keys(playersCards)
            .filter((playerId) => playerId !== 'pile' && !onlinePlayers.includes(playerId))
            .map((othePlayerId) => ({
              email: othePlayerId,
              name: othePlayerId,
              uid: othePlayerId,
              isBot: true,
            }));

          setPlayersOnline([...playersOnline, ...otherPlayers]);
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
      {!!playersOnline && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {playersOnline
              .filter(({ isBot }) => !isBot)
              .map(({ name, uid }) => (
                <div key={uid}>{name}</div>
              ))}
          </div>
          {gameStarted && (
            <div>
              <div>Round: {roundNumber}</div>
              <div>
                Last round winner:{' '}
                {playersOnline.find(({ uid }) => roundWinner?.winnerId && roundWinner.winnerId === uid)?.name ?? ''}
              </div>
            </div>
          )}
        </div>
      )}

      {!isEmpty(splitedCards) && (
        <>
          <Grid container sx={{ marginBottom: '24px' }}>
            <Grid
              item
              xs={6}
              sx={{ border: '1px solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <DeckCardComponent
                key={'player_01'}
                card={{ ownerId: 'player_01', key: 'player_01', value: 2, suit: '' }}
                isOffside
              />
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ border: '1px solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <DeckCardComponent
                key={'player_02'}
                card={{ ownerId: 'player_02', key: 'player_02', value: 2, suit: '' }}
                isOffside
              />
            </Grid>
          </Grid>

          <Grid container sx={{ marginBottom: '24px' }}>
            <Grid
              item
              xs={2}
              sx={{ border: '1px solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <DeckCardComponent
                key={'player_03'}
                card={{ ownerId: 'player_03', key: 'player_03', value: 2, suit: '' }}
                isOffside
              />
            </Grid>
            <Grid item xs={8} sx={{ border: '1px solid' }}>
              <BoardCenter
                selectedCards={selectedCards}
                currentPlayerIndex={currentPlayerIndex}
                playersIdArray={playersOnline.map(({ uid }) => uid)}
              />
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ border: '1px solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <DeckCardComponent
                key={'player_04'}
                card={{ ownerId: 'player_04', key: 'player_04', value: 2, suit: '' }}
                isOffside
              />
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
      {gameStarted && (
        <div style={{ display: 'flex', gap: 10, flexDirection: 'column', width: '30%' }}>
          {otherPlayersIdArray.length > 0 &&
            splitedCards &&
            otherPlayersIdArray.map((otherPlayerId) => (
              <Button
                variant="contained"
                onClick={() => handleClickCard(otherPlayerId, splitedCards[otherPlayerId][roundNumber])}
              >
                play card for number {otherPlayerId}
              </Button>
            ))}
          <Button variant="contained" onClick={finishRound}>
            finish round
          </Button>
        </div>
      )}
    </Table>
  );
};
