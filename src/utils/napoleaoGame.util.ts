import { getAuth } from 'firebase/auth';
import { arrayUnion, collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from 'src/config/firebaseConfiguration';
import { createDeck, distributeCards, shuffleDeck } from 'src/utils/card.util';
import { JOKER, NUMBERS, SUITS } from 'src/constants/deckCard.const';
export async function connectPlayerToLobby(idToConnect: string) {
  const auth = getAuth();

  const userQuery = query(collection(db, 'users'), where('uid', '==', auth?.currentUser?.uid));
  const querySnapshot = await getDocs(userQuery);
  querySnapshot.forEach((snapshot) => {
    const { name, uid, email } = snapshot.data();
    const collectionLobbyRef = collection(db, 'onlineLobby');
    setDoc(
      doc(collectionLobbyRef, idToConnect),
      {
        players: arrayUnion({
          name,
          uid,
          email,
        }),
      },
      { merge: true },
    );
  });
}

export async function saveNapoleaoSplitedCardsInFirebase(idToConnect: string, playersOnline: string[]) {
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
