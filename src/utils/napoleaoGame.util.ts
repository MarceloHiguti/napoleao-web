import { getAuth } from 'firebase/auth';
import { arrayUnion, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from 'src/config/firebaseConfiguration';
import { createDeck, distributeCards, shuffleDeck } from 'src/utils/card.util';
import { JOKER, NUMBERS, SUITS } from 'src/constants/deckCard.const';
import {
  NextRoundParams,
  SaveNapoleaoSplitedCardsInFirebaseParams,
  SaveRoundCardsPlayedParams,
  UpdatedGameParams,
} from 'src/models/napoleaoGame.model';

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
            gameProps: {
              isNapoleao: false,
              isCopinho: false,
              isMyTurn: index === 0,
            },
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
  const distributedCards = distributeCards({
    deck,
    numberOfCards: 10,
    numberOfPlayers: 5,
    playersIndex: playersOnline,
  });
  const collectionLobbyRef = collection(db, 'onlineLobby');

  setDoc(
    doc(collectionLobbyRef, idToConnect),
    {
      playersCards: distributedCards,
    },
    { merge: true },
  );
}

export async function saveRoundCardsPlayed({ idToConnect, roundNumber, playerId, card }: SaveRoundCardsPlayedParams) {
  const collectionLobbyRef = collection(db, 'onlineLobby');
  setDoc(
    doc(collectionLobbyRef, idToConnect),
    {
      rounds: {
        [roundNumber]: {
          [playerId]: card,
        },
      },
    },
    { merge: true },
  );
}

export async function updateGameProps({
  idToConnect,
  isGameStarted = true,
  roundNumber = 0,
  playerIndexTurn = 0,
}: UpdatedGameParams) {
  const collectionLobbyRef = collection(db, 'onlineLobby');
  setDoc(
    doc(collectionLobbyRef, idToConnect),
    {
      gameProps: {
        isGameStarted,
        roundNumber,
        playerIndexTurn,
      },
    },
    { merge: true },
  );
}

export async function setNextRound({ idToConnect, roundNumber, playerIndexTurn }: NextRoundParams) {
  const nextPlayerIndex = playerIndexTurn === 4 ? 0 : playerIndexTurn + 1;

  updateGameProps({ idToConnect, roundNumber, playerIndexTurn: nextPlayerIndex });
}
