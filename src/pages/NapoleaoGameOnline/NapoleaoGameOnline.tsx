import { useCallback, useEffect, useState, useMemo } from 'react';
import { db } from 'src/config/firebaseConfiguration';
import { Table } from '../Table/Table';
import { Box, Button, Grid } from '@mui/material';
import { doc, onSnapshot } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { isEmpty, toString } from 'lodash';
import { DeckCardComponent } from 'src/components/DeckCard/DeckCardComponent';
import { DeckCard } from 'src/components/DeckCard/DeckCard.class';
import { DeckCardConstructor } from 'src/components/DeckCard/DeckCard.model';
import {
  createOnlineGameProps,
  saveNapoleaoSplitedCardsInFirebase,
  updateOnlineGameProps,
  updatePlayerIndicesInLobby,
  setCardPlayedInFirebase,
} from 'src/utils/napoleaoGame.util';
import { useCurrentUser } from 'src/hooks/useCurrentUser.hook';
import { LobbyData, PlayersInLobby, RoundData } from 'src/models/napoleaoGame.model';
import { napoleaoRoundWinner } from 'src/utils/napoleaoRules.util';
import { ChooseNapoleao } from './ChooseNapoleao';
import { NapoleaoGameOnlineProvider } from './NapoleaoGameOnlineContext';
import { User } from 'firebase/auth';
import BoardCenterV2 from '../BoardCenter/BoardCenterV2';
import { BehaviorSubject } from 'rxjs';
import HgtCardsHand from 'src/components/HgtCard/HgtCardsHand';

export const NapoleaoGameOnline = () => {
  const { lobbyId } = useParams();
  const lobbyIdString = toString(lobbyId);
  const currentUser = useCurrentUser() ?? ({} as User);
  const currentPlayerUid = toString(currentUser?.uid);

  const [playersOnline, setPlayersOnline] = useState<ReadonlyArray<PlayersInLobby>>([]);

  const user = playersOnline.find(({ uid }) => uid === currentPlayerUid);

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
    updatePlayerIndicesInLobby({ idToConnect: lobbyIdString });
    createOnlineGameProps({
      idToConnect: lobbyIdString,
    });
  }, [playersIdArray]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [roundsCards, setRoundsCards] = useState<Record<number, RoundData>>({});
  const [splitedCards, setSplitedCards] = useState<Record<string, DeckCard[]>>({});
  const [onlineGameProps, setOnlineGameProps] = useState<any>({});
  const [cardFromHandSelected, setCardFromHandSelected] = useState<DeckCardConstructor>();

  const roundNumber = onlineGameProps?.roundNumber ?? 0;
  const turnFromPlayerIndex = onlineGameProps?.turnFromPlayerIndex?.toString() ?? '';
  const selectedCards = roundsCards[roundNumber]?.playersCard ?? {};
  const lastRoundWinner = playersOnline.find(({ uid }) => roundsCards[roundNumber - 1]?.roundWinner?.playerUid === uid)
    ?.name;

  const roundsCardsSubject = new BehaviorSubject<{ rounds: Record<number, RoundData>; roundNumber: number }>({
    rounds: roundsCards,
    roundNumber,
  });

  const finishRound = useCallback(() => {
    updateOnlineGameProps({ idToConnect: lobbyIdString, newGameProps: { roundNumber: roundNumber + 1 } });
  }, [selectedCards]);

  const checkRoundWinner = ({ rounds, roundNumber }: { rounds: Record<number, RoundData>; roundNumber: number }) => {
    console.log('roundNumber', roundNumber);
    const playedCards = rounds[roundNumber]?.playersCard ?? {};
    const validSuit = rounds[roundNumber]?.validSuit ?? '';
    const numberOfCardsPlayed = Object.keys(playedCards).length;
    console.log('playedCards', playedCards);
    if (numberOfCardsPlayed === 5) {
      const roundPlayerWinner = napoleaoRoundWinner({ selectedCards: playedCards, validSuit });
      console.log('round winner', roundPlayerWinner);
    }
  };

  const handleClickCard = (playerUid: string, playerIndex: string, card: DeckCardConstructor) => {
    if (turnFromPlayerIndex === playerIndex) {
      const discardedHand = (splitedCards?.[playerUid] ?? []).filter(({ key }) => card?.key !== key);
      const validSuit = roundsCards[roundNumber]?.validSuit ?? card.suit;

      setCardPlayedInFirebase({
        idToConnect: lobbyIdString,
        currentPlayerIndex: playerIndex,
        currentPlayerUid: playerUid,
        newPlayerCards: discardedHand,
        roundNumber,
        card,
        validSuit,
      });
    }
  };

  const handlePlaySelectedCard = () => {
    if (cardFromHandSelected) {
      handleClickCard(currentPlayerUid, user?.index?.toString() ?? '', cardFromHandSelected);
      setCardFromHandSelected(undefined);
    }
  };

  const handleCardSelectionClick = (playerIndex: string, card: DeckCardConstructor) => {
    if (turnFromPlayerIndex === playerIndex) {
      setCardFromHandSelected(card);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'onlineLobby', lobbyIdString), (snap) => {
      const lobbyData = snap.data() as LobbyData | undefined;
      if (!!lobbyData) {
        const { players, playersCards, rounds, onlineGameProps } = lobbyData;
        const playersOnline = players?.map((onlinePlayer) => ({ ...onlinePlayer, isBot: false }));

        setPlayersOnline(playersOnline);
        setOnlineGameProps(onlineGameProps);

        if (!!playersCards) {
          setSplitedCards(playersCards);
          const onlinePlayers = players.map(({ uid }) => uid);
          const otherPlayers = Object.keys(playersCards)
            .filter((playerId) => playerId !== 'pile' && !onlinePlayers.includes(playerId))
            .map((othePlayerId, index) => ({
              email: othePlayerId,
              name: othePlayerId,
              uid: othePlayerId,
              isBot: true,
              index: onlinePlayers.length + index,
              gameProps: {
                isCopinho: false,
                isMyTurn: false,
                isNapoleao: false,
              },
            }));

          setPlayersOnline([...playersOnline, ...otherPlayers]);
        }

        if (!!rounds) {
          const roundNumber = onlineGameProps?.roundNumber ?? 0;
          setRoundsCards(rounds);
          console.log('rounds', rounds);
          roundsCardsSubject.next({ rounds, roundNumber });
        }
      }
    });

    const roundsCardsSubscription = roundsCardsSubject.subscribe(({ rounds, roundNumber }) => {
      checkRoundWinner({ rounds, roundNumber });
    });

    return () => {
      unsubscribe();
      roundsCardsSubscription.unsubscribe();
    };
  }, []);

  return (
    <NapoleaoGameOnlineProvider
      value={{
        lobbyId: lobbyIdString,
        currentUser,
        playersOnline,
        splitedCards,
        onlineGameProps,
      }}
    >
      <Table>
        {!onlineGameProps?.isGameStarted && (
          <Button variant="contained" onClick={startGame}>
            start game
          </Button>
        )}

        {onlineGameProps?.isGameStarted && roundNumber === 0 && !isEmpty(splitedCards) && <ChooseNapoleao />}

        {!!playersOnline && !onlineGameProps?.isGameStarted && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {playersOnline
                .filter(({ isBot }) => !isBot)
                .map(({ name, uid }) => (
                  <div key={uid}>{name}</div>
                ))}
            </div>
          </div>
        )}

        {roundNumber > 0 && !isEmpty(splitedCards) && (
          <>
            <span style={{ color: 'white' }}>Round Number: {roundNumber}</span>
            {lastRoundWinner && <div>Last Round Winner: {lastRoundWinner}</div>}
            <BoardCenterV2
              selectedCards={selectedCards}
              currentPlayerUid={currentPlayerUid}
              onTableClick={handlePlaySelectedCard}
            />
            <Grid container sx={{ marginBottom: '24px' }}>
              <Grid item xs={12} sx={{ border: '1px solid', margin: '16px 0' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }} gap={2}>
                  <HgtCardsHand
                    cards={splitedCards?.[currentPlayerUid] ?? []}
                    onClick={(card) => handleCardSelectionClick(user?.index?.toString() ?? '', card)}
                    cardSelected={cardFromHandSelected}
                  />
                  {/* {(splitedCards?.[currentPlayerUid] ?? []).map((card) => (
                    <DeckCardComponent
                      key={card.key}
                      card={card}
                      onClick={(card) => handleClickCard(currentPlayerUid, user?.index?.toString() ?? '', card)}
                    />
                  ))} */}
                </Box>
              </Grid>
            </Grid>
          </>
        )}

        {onlineGameProps?.isGameStarted && roundNumber > 0 && (
          <div style={{ display: 'flex', gap: 10, flexDirection: 'column', width: '30%' }}>
            {otherPlayersIdArray.length > 0 &&
              splitedCards &&
              otherPlayersIdArray.map((otherPlayerId) => (
                <Button
                  key={otherPlayerId}
                  variant="contained"
                  onClick={() =>
                    handleClickCard(otherPlayerId, otherPlayerId, splitedCards[otherPlayerId][10 - roundNumber])
                  }
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
    </NapoleaoGameOnlineProvider>
  );
};
