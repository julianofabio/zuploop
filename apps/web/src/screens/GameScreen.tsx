// Página de um jogo. O conteúdo ("Como jogar" e "Jogar") chega na T026.
export async function GameScreen({ gameId }: { gameId: string }) {
  return <main data-game-id={gameId} />;
}
