import { Box } from '@mui/material';
import { FC } from 'react';
import { HgtAvatar } from 'src/components/HgtAvatar/HgtAvatar';
import { DeckCardConstructor } from 'src/components/DeckCard/DeckCard.model';
import { useNapoleaoGameOnlineContext } from '../NapoleaoGameOnline/NapoleaoGameOnlineContext';
import HgtCard from 'src/components/HgtCard/HgtCard';

type BoardCenterV2Props = {
  selectedCards: Record<number | string, DeckCardConstructor>;
  currentPlayerUid: string;
  onTableClick?: () => void;
};

const BoardCenterV2: FC<BoardCenterV2Props> = ({ selectedCards, currentPlayerUid, onTableClick }) => {
  const { playersOnline, currentUser, onlineGameProps } = useNapoleaoGameOnlineContext();
  const turnFromPlayerIndex = onlineGameProps?.turnFromPlayerIndex?.toString() ?? '';
  const user = playersOnline.find(({ uid }) => uid === currentPlayerUid);

  const handleTableClick = () => {
    onTableClick?.();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '100px', padding: '16px' }} onClick={handleTableClick}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {playersOnline
          .filter(({ uid: otherUid }) => otherUid !== currentUser.uid)
          .map(({ name, uid: otherPlayerUid }) => {
            return (
              <Box
                key={otherPlayerUid}
                sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '16px' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HgtAvatar initials={name.substring(0, 2)?.toUpperCase()} />
                  {turnFromPlayerIndex === name && <div style={{ color: 'white' }}>My turn</div>}
                </Box>
                <Box sx={{ height: '150px' }}>
                  {selectedCards[otherPlayerUid] && (
                    <HgtCard key={selectedCards[otherPlayerUid].key} card={selectedCards[otherPlayerUid]} />
                  )}
                </Box>
              </Box>
            );
          })}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Box sx={{ height: '142px', width: '107px', border: '1px solid #fff', padding: '20px' }}>
          {selectedCards?.[currentPlayerUid] && (
            <HgtCard key={selectedCards[currentPlayerUid].key} card={selectedCards[currentPlayerUid]} />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HgtAvatar initials={'EU'} />
          {turnFromPlayerIndex === user?.index?.toString() && <div style={{ color: 'white' }}>My turn</div>}
        </Box>
      </Box>
    </Box>
  );
};

export default BoardCenterV2;
