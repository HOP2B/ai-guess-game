import CharacterClient from './CharacterClient';

export default async function CharacterPage({
  searchParams,
}: {
  // searchParams may be a Promise in the server render environment
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const themeId = (resolvedSearchParams.theme as string) || null;
  const gameId = (resolvedSearchParams.gameId as string) || null;

  return <CharacterClient themeId={themeId} initialGameId={gameId} />;
}
