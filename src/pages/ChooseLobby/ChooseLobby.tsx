import { useState, useCallback } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './ChooseLobby.css';

const ChooseLobby = () => {
  const navigate = useNavigate();

  const [lobbyId, setLobbyId] = useState('');

  const connectPlayerToLobby = useCallback((idToConnect: string) => () => navigate(`/lobby/${idToConnect}`), []);

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
      <Button sx={{ marginTop: '20px' }} variant="contained" onClick={connectPlayerToLobby(lobbyId)}>
        join lobby
      </Button>
    </div>
  );
};

export default ChooseLobby;
