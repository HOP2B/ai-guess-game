'use client';

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

export default function AiGuessed() {
  const searchParams = useSearchParams();
  const guess = searchParams.get('guess') || 'Unknown';
  const isCorrect = searchParams.get('isCorrect') === 'true';
  const correctCharacter = searchParams.get('character') || '';
  const imageUrl = searchParams.get('imageUrl') || '';

  return (
    <div className="flex flex-col min-h-screen text-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white pb-5 pt-5">
      <div className="text-lg mb-2">The AI identified this character</div>
      <div className="flex-grow flex items-center justify-center">
        <Image
          src={imageUrl}
          alt="Character"
          width={250}
          height={350}
          className="rounded-lg shadow-2xl"
          unoptimized
        />
      </div>
      <h1 className="text-xl font-bold mb-2">{guess}</h1>
      <div className="text-base mb-4">
        {isCorrect ? (
          <span className="text-green-400">Correct! The character was {correctCharacter}</span>
        ) : (
          <span className="text-red-400">Incorrect. The correct character was {correctCharacter}</span>
        )}
      </div>
      <div className="flex items-center justify-center gap-4 mt-auto">
        <Link href="/">
          <button className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 text-base">
            Home
          </button>
        </Link>
        <Link href="/themes">
          <button className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 text-base">
            Play again
          </button>
        </Link>
        <Link href="/leaderboard">
          <button className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 text-base">
            Leaderboard
          </button>
        </Link>
      </div>
    </div>
  );
}
