import { useState, useCallback } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './ChooseLobby.css';
import { connectPlayerToLobby } from 'src/utils/napoleaoGame.util';

const ChooseLobby = () => {
  const navigate = useNavigate();

  const [lobbyId, setLobbyId] = useState('');

  const connectPlayerToOnlineLobby = useCallback(
    (idToConnect: string) => () => {
      connectPlayerToLobby(idToConnect);
      navigate(`/lobby/${idToConnect}`);
    },
    [],
  );

  return (
    <div className="chooseLobby__container">
      <TextField
        id="lobby-id"
        label="Lobby ID"
        variant="outlined"
        value={lobbyId}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLobbyId(event.target.value);
        }}
      />
      <Button sx={{ marginTop: '20px' }} variant="contained" onClick={connectPlayerToOnlineLobby(lobbyId)}>
        join lobby
      </Button>
    </div>
  );
};

export default ChooseLobby;
