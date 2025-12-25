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
    <div className="flex flex-col min-h-screen text-center bg-black text-white pb-5 pt-5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gray-400 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="text-lg mb-2 animate-fade-in">The AI identified this character</div>
        <div className="flex-grow flex items-center justify-center animate-scale-in">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Character"
              width={250}
              height={350}
              className="rounded-lg shadow-2xl border border-gray-700"
              unoptimized
            />
          ) : (
            <div className="w-64 h-96 bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center border border-gray-600">
              <span className="text-gray-400">No Image</span>
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
        <div className="flex items-center justify-center gap-4 mt-auto animate-fade-in delay-500">
          <Link href="/">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 text-base">
              Home
            </button>
          </Link>
          <Link href="/themes">
            <button className="bg-white text-black hover:bg-gray-200 font-semibold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white text-base">
              Play again
            </button>
          </Link>
          <Link href="/leaderboard">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 text-base">
              Leaderboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
