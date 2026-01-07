import Link from "next/link";
import AiGuessedClient from "./AiGuessedClient";

export default async function AiGuessed({
  searchParams,
}: {
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}) {
  const resolved = (await searchParams) || {};
  const guess = (resolved.guess as string) || 'Unknown';
  const isCorrect = (resolved.isCorrect as string) === 'true';
  const correctCharacter = (resolved.character as string) || '';
  const guessedImageUrl = (resolved.imageUrl as string) || '';
  const correctImageUrl = (resolved.correctImage as string) || '';
  // Show the correct character's image when available (so name + image match). If not available, fall back to the guessed image.
  const displayImage = correctImageUrl || guessedImageUrl;

  return <AiGuessedClient
    guess={guess}
    isCorrect={isCorrect}
    correctCharacter={correctCharacter}
    guessedImageUrl={guessedImageUrl}
    correctImageUrl={correctImageUrl}
    displayImage={displayImage}
  />;
}
