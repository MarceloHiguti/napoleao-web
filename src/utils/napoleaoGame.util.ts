import { getAuth } from 'firebase/auth';
import { arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from 'src/config/firebaseConfiguration';
import { createDeck, distributeCards, shuffleDeck } from 'src/utils/card.util';
import { JOKER, NUMBERS, SUITS } from 'src/constants/deckCard.const';
import {
  GAME_STEPS,
  NextRoundParams,
  SaveNapoleaoSplitedCardsInFirebaseParams,
  SaveRoundCardsPlayedParams,
  SetCardPlayedInParams,
  UpdatedOnlineGameProps,
  UpdatedPlayersCards,
  UpdatePlayerDataParams,
} from 'src/models/napoleaoGame.model';

import { merge } from 'lodash';
import { DeckCard } from 'src/components/DeckCard/DeckCard.class';
import { napoleaoDeckModifier } from './napoleaoRules.util';

export async function connectPlayerToLobby(idToConnect: string) {
  try {
    const auth = getAuth();
    const userQuery = query(collection(db, 'users'), where('uid', '==', auth?.currentUser?.uid));
    const querySnapshot = await getDocs(userQuery);

    for (const [index, snapshot] of querySnapshot.docs.entries()) {
      const { name, uid, email } = snapshot.data();
      const collectionLobbyRef = collection(db, 'onlineLobby');
      const docRef = doc(collectionLobbyRef, idToConnect);

      await setDoc(
        docRef,
        {
          players: arrayUnion({
            name,
            uid,
            email,
            index,
          }),
        },
        { merge: true },
      );
    }
  } catch (error) {
    console.error('Error during operation:', error);
  }
}

export async function saveNapoleaoSplitedCardsInFirebase({
  idToConnect,
  playersOnline,
}: SaveNapoleaoSplitedCardsInFirebaseParams) {
  const deck = shuffleDeck(createDeck({ numbers: NUMBERS, suits: SUITS, extraCards: JOKER }));
  const cards = deck.map((deckCardConstructor) => new DeckCard(deckCardConstructor));
  const modifiedDeck = napoleaoDeckModifier({ cards });
  const modifiedDeckObjectArray = modifiedDeck.map((cardsInstance) => cardsInstance.toJson);
  const distributedCards = distributeCards({
    deck: modifiedDeckObjectArray,
    numberOfCards: 10,
    numberOfPlayers: 5,
    playersIndex: playersOnline,
  });
  const collectionLobbyRef = collection(db, 'onlineLobby');

  await setDoc(
    doc(collectionLobbyRef, idToConnect),
    {
      playersCards: distributedCards,
    },
    { merge: true },
  );
}

export async function updateSplitedCardsInFirebase({
  idToConnect,
  newPlayersCards,
  newGameProps,
}: UpdatedPlayersCards) {
  try {
    const lobbyRef = doc(db, 'onlineLobby', idToConnect);
    const lobbyDoc = await getDoc(lobbyRef);

    if (!lobbyDoc.exists()) {
      throw new Error(`Lobby with ID ${idToConnect} does not exist`);
    }

    const playersCards = lobbyDoc.data()?.playersCards;
    const onlineGameProps = lobbyDoc.data()?.onlineGameProps;

    if (!playersCards) {
      throw new Error(`playersCards not found in lobby ${idToConnect}`);
    }

    const updatedPlayersCards = merge({}, playersCards, newPlayersCards);
    const updatedOnlineGameProps = merge({}, onlineGameProps ?? {}, newGameProps);

    await updateDoc(lobbyRef, {
      [`playersCards`]: updatedPlayersCards,
      [`onlineGameProps`]: updatedOnlineGameProps,
    });
  } catch (error) {
    console.error('Error updating PlayersCards data: ', error);
  }
}

export async function setCardPlayedInFirebase({
  idToConnect,
  newPlayerCards,
  currentPlayerIndex,
  currentPlayerUid,
  newGameProps,
  roundNumber,
  card,
  validSuit,
}: SetCardPlayedInParams) {
  try {
    const lobbyRef = doc(db, 'onlineLobby', idToConnect);
    const lobbyDoc = await getDoc(lobbyRef);

    if (!lobbyDoc.exists()) {
      throw new Error(`Lobby with ID ${idToConnect} does not exist`);
    }

    const playersCards = lobbyDoc.data()?.playersCards;
    const onlineGameProps = lobbyDoc.data()?.onlineGameProps;
    const rounds = lobbyDoc.data()?.rounds;

    if (!playersCards) {
      throw new Error(`playersCards not found in lobby ${idToConnect}`);
    }

    const updatedPlayersCards = { ...playersCards, [currentPlayerUid]: newPlayerCards };

    const playerIndexNumber = Number(currentPlayerIndex);
    const nextPlayerIndex = playerIndexNumber === 4 ? 0 : playerIndexNumber + 1;
    const updatedOnlineGameProps = {
      ...onlineGameProps,
      ...newGameProps,
      turnFromPlayerIndex: nextPlayerIndex,
    };

    const newRounds = {
      [roundNumber]: {
        playersCard: {
          [currentPlayerUid]: card,
        },
        validSuit,
      },
    };
    const roundsToUpdate = merge({}, rounds, newRounds);

    console.log('updatedOnlineGameProps', updatedOnlineGameProps);

    await updateDoc(lobbyRef, {
      [`playersCards`]: updatedPlayersCards,
      [`onlineGameProps`]: updatedOnlineGameProps,
      [`rounds`]: roundsToUpdate,
    });
  } catch (error) {
    console.error('Error updating PlayersCards data: ', error);
  }
}

export async function saveRoundCardsPlayed({
  idToConnect,
  roundNumber,
  playerUid,
  card,
  validSuit,
}: SaveRoundCardsPlayedParams) {
  const collectionLobbyRef = collection(db, 'onlineLobby');
  await setDoc(
    doc(collectionLobbyRef, idToConnect),
    {
      rounds: {
        [roundNumber]: {
          playersCard: {
            [playerUid]: card,
          },
          validSuit,
        },
      },
    },
    { merge: true },
  );
}

export async function createOnlineGameProps({ idToConnect }: { idToConnect: string }) {
  try {
    const collectionLobbyRef = collection(db, 'onlineLobby');

    await setDoc(
      doc(collectionLobbyRef, idToConnect),
      {
        onlineGameProps: {
          gameStep: GAME_STEPS.ChooseNapoleao,
          isGameStarted: true,
          roundNumber: 0,
          turnFromPlayerIndex: 0,
        },
      },
      { merge: true },
    );
  } catch (error) {
    console.error('Error creating OnlineGameProps: ', error);
  }
}

export async function updateOnlineGameProps({ idToConnect, newGameProps }: UpdatedOnlineGameProps) {
  try {
    const lobbyRef = doc(db, 'onlineLobby', idToConnect);
    const lobbyDoc = await getDoc(lobbyRef);

    if (!lobbyDoc.exists()) {
      throw new Error(`Lobby with ID ${idToConnect} does not exist`);
    }

    const onlineGameProps = lobbyDoc.data()?.onlineGameProps;

    if (!onlineGameProps) {
      throw new Error(`onlineGameProps not found in lobby ${idToConnect}`);
    }

    const updatedOnlineGameProps = merge({}, onlineGameProps, newGameProps);

    await updateDoc(lobbyRef, {
      [`onlineGameProps`]: updatedOnlineGameProps,
    });
  } catch (error) {
    console.error('Error updating OnlineGameProps data: ', error);
  }
}

export async function setNextTurn({ idToConnect, currentPlayerIndex, newGameProps = {} }: NextRoundParams) {
  const nextPlayerIndex = currentPlayerIndex === 4 ? 0 : currentPlayerIndex + 1;
  const updatedGameProps = {
    ...newGameProps,
    turnFromPlayerIndex: nextPlayerIndex,
  };

  updateOnlineGameProps({ idToConnect, newGameProps: updatedGameProps });
}

export async function updatePlayerData({ idToConnect, uid, playerNewData }: UpdatePlayerDataParams) {
  try {
    const lobbyRef = doc(db, 'onlineLobby', idToConnect);
    const lobbyDoc = await getDoc(lobbyRef);

    if (!lobbyDoc.exists()) {
      throw new Error(`Lobby with ID ${idToConnect} does not exist`);
    }

    const players = lobbyDoc.data()?.players;

    if (!players || !players[uid]) {
      throw new Error(`Player with UID ${uid} not found in lobby ${idToConnect}`);
    }

    const currentPlayerData = players[uid];

    const updatedPlayerData = {
      ...currentPlayerData,
      ...playerNewData,
    };

    await updateDoc(lobbyRef, {
      [`players.${uid}`]: updatedPlayerData,
    });
  } catch (error) {
    console.error('Error updating player data: ', error);
  }
}

export async function updatePlayerIndicesInLobby({ idToConnect }: { idToConnect: string }) {
  try {
    const lobbyRef = doc(db, 'onlineLobby', idToConnect);
    const lobbyDoc = await getDoc(lobbyRef);

    if (!lobbyDoc.exists()) {
      throw new Error(`Lobby with ID ${idToConnect} does not exist`);
    }

    const players = lobbyDoc.data()?.players;

    if (!players) {
      throw new Error(`No players found in lobby ${idToConnect}`);
    }

    const updatedPlayers = Object.keys(players).map((uid, index) => {
      const player = players[uid];
      return {
        ...player,
        index,
        gameProps: {
          ...player.gameProps,
          isMyTurn: index === 0,
        },
      };
    });

    await updateDoc(lobbyRef, {
      players: updatedPlayers,
    });
  } catch (error) {
    console.error('Error updating player indices: ', error);
  }
}
