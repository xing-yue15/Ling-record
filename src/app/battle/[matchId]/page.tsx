import { GameBoardClient } from "@/components/game/GameBoardClient";

// This is now a Server Component
export default function BattlePage({ params }: { params: { matchId: string } }) {
  const { matchId } = params;

  // The GameBoardClient will now handle the initial state internally.
  // We just need to pass the matchId to it.
  return (
     <GameBoardClient matchId={matchId} />
  );
}
