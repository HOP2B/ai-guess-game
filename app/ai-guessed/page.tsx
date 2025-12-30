import Link from "next/link";
import CharacterImage from "../components/CharacterImage";

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

  return (
    <div className="flex flex-col min-h-screen text-center bg-black text-white pb-5 pt-5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gray-400 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="text-lg mb-2 animate-fade-in">The AI identified this character</div>
        <div className="flex-grow flex items-center justify-center animate-scale-in">
          {isCorrect ? (
            // If correct, show the single correct image
            displayImage ? (
              <CharacterImage src={displayImage} alt={correctCharacter || guess} size="medium" />
            ) : (
              <div className="w-64 h-96 bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center border border-gray-600">
                <span className="text-gray-400">No Image</span>
              </div>
            )
          ) : (
            // If incorrect, show both the AI's guessed image and the correct image side-by-side for clarity
            <div className="flex gap-4 items-center justify-center">
              <div className="flex flex-col items-center">
                {guessedImageUrl ? (
                  <CharacterImage src={guessedImageUrl} alt={`AI guess: ${guess}`} size="medium" />
                ) : (
                  <div className="w-48 h-72 bg-gray-800 rounded-lg shadow-md flex items-center justify-center border border-gray-600">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <div className="mt-2 text-sm text-gray-300">AI's guess</div>
              </div>

              <div className="flex flex-col items-center">
                {correctImageUrl ? (
                  <CharacterImage src={correctImageUrl} alt={`Correct: ${correctCharacter}`} size="medium" />
                ) : (
                  <div className="w-48 h-72 bg-gray-800 rounded-lg shadow-md flex items-center justify-center border border-gray-600">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <div className="mt-2 text-sm text-green-300">Correct character</div>
              </div>
            </div>
          )}
        </div>
        <h1 className="text-xl font-bold mb-2 animate-slide-up">{guess}</h1>
        <div className="text-base mb-4 animate-slide-up delay-200">
          {isCorrect ? (
            <span className="text-green-400">Correct! The character was {correctCharacter}</span>
          ) : (
            <span className="text-red-400">Incorrect. The correct character was {correctCharacter}</span>
          )}
        </div>
        <div className="flex flex-col items-center gap-4 mt-auto animate-fade-in delay-500 px-4">
          <Link href="/themes" className="w-full max-w-xs">
            <button className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-4 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white text-lg min-h-[56px] touch-manipulation">
              Play again
            </button>
          </Link>

          <div className="flex gap-4 w-full max-w-xs">
            <Link href="/" className="flex-1">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 text-base min-h-[56px] touch-manipulation">
                Home
              </button>
            </Link>
            <Link href="/leaderboard" className="flex-1">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 text-base min-h-[56px] touch-manipulation">
                Leaderboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
