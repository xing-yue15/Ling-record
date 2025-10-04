import { GameBoardClient } from "@/components/game/GameBoardClient";

export default function BattlePage({ params }: { params: { matchId: string } }) {
  return (
    <div className="w-full h-[calc(100vh-7rem)] overflow-hidden">
        <GameBoardClient matchId={params.matchId} />
    </div>
  );
}
