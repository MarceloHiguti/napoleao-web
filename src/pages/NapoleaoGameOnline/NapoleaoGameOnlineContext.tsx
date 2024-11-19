import { User } from 'firebase/auth';
import { DeckCard } from 'src/components/DeckCard/DeckCard.class';
import { useCreateContext } from 'src/hooks/useCreateContext.hook';
import { PlayersInLobby } from 'src/models/napoleaoGame.model';

export const [NapoleaoGameOnlineProvider, useNapoleaoGameOnlineContext] = useCreateContext<{
  readonly lobbyId: string;
  readonly currentUser: User;
  readonly playersOnline: ReadonlyArray<PlayersInLobby & { isBot: boolean }>;
  readonly splitedCards: Record<string, DeckCard[]>;
  readonly gameProps: any;
}>({
  name: 'NapoleaoGameOnlineContext',
  errorMessage: 'This context should be used inside NapoleaoGameOnlineProvider!',
});
