import { useCallback, useEffect, useState } from 'react';
import { db } from 'src/config/firebaseConfiguration';
import { Table } from '../Table/Table';
import { Button } from '@mui/material';
import { arrayUnion, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import { toString } from 'lodash';

export const NapoleaoGameOnline = () => {
  const { lobbyId } = useParams();
  const lobbyIdString = toString(lobbyId);
  console.log('lobbyId', lobbyId);

  const [playersOnline, setPlayersOnline] = useState([]);

  const auth = getAuth();

  const connectPlayerToLobby = useCallback(
    (idToConnect: string) => async () => {
      const userQuery = query(collection(db, 'users'), where('uid', '==', auth?.currentUser?.uid));
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach((snapshot) => {
        const { name, uid, email } = snapshot.data();
        const collectionLobbyRef = collection(db, 'onlineLobby');
        updateDoc(doc(collectionLobbyRef, idToConnect), {
          players: arrayUnion({
            name,
            uid,
            email,
          }),
        });
      });
    },
    [],
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'onlineLobby', lobbyIdString), (snap) => {
      const source = snap.metadata.hasPendingWrites ? 'Local' : 'Server';
      const lobbyData = snap.data();
      console.log(source, ' data: ', lobbyData);
      if (!!lobbyData) {
        const { players } = lobbyData;
        setPlayersOnline(players);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Table>
      <Button variant="contained" onClick={connectPlayerToLobby(lobbyIdString)}>
        connect player
      </Button>
      {!!playersOnline && playersOnline.map(({ name, uid }) => <div key={uid}>{name}</div>)}
    </Table>
  );
};
