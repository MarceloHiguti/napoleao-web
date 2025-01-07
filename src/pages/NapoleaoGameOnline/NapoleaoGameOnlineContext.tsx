import { User } from 'firebase/auth';
import { DeckCard } from 'src/components/DeckCard/DeckCard.class';
import { useCreateContext } from 'src/hooks/useCreateContext.hook';
import { OnlineGameProps, PlayersInLobby } from 'src/models/napoleaoGame.model';

export const [NapoleaoGameOnlineProvider, useNapoleaoGameOnlineContext] = useCreateContext<{
  readonly lobbyId: string;
  readonly currentUser: User;
  readonly playersOnline: ReadonlyArray<PlayersInLobby>;
  readonly splitedCards: Record<string, DeckCard[]>;
  readonly onlineGameProps: OnlineGameProps;
}>({
  name: 'NapoleaoGameOnlineContext',
  errorMessage: 'This context should be used inside NapoleaoGameOnlineProvider!',
});
