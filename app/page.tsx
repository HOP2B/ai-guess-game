'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    localStorage.setItem('username', value);
  };

  const handlePlay = async () => {
    if (!username.trim()) return;

    try {
      const response = await fetch('/api/save-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (response.ok) {
        router.push('/themes');
      } else {
        console.error('Failed to save username');
      }
    } catch (error) {
      console.error('Error saving username:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gray-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gray-600 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gray-500 rounded-full animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-8xl font-bold text-white text-center mt-10 mb-16 animate-fade-in">
          AI Guess Game
        </h1>

        <div className="text-center max-w-md w-full mx-auto mb-8 animate-slide-up">
          <label htmlFor="userInput" className="block text-white text-lg mt-10 font-medium mb-4">
            Enter your username
          </label>
          <input
            id="userInput"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your username..."
            className="w-full px-6 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300"
          />
        </div>

        <div className="flex-grow flex items-center justify-center animate-slide-up delay-200 px-4">
          <div className="text-center max-w-md w-full">
            <button
              onClick={handlePlay}
              disabled={!username.trim()}
              className={`w-full mt-1 bg-white text-black font-semibold py-6 px-6 rounded-lg shadow-lg transform transition-all duration-300 text-xl min-h-[64px] touch-manipulation ${
                username.trim()
                  ? 'hover:bg-gray-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black active:scale-95'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Play
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex flex-col gap-3 animate-fade-in delay-500">
          <Link href="/leaderboard">
            <div className="bg-gray-800 backdrop-blur-lg rounded-full p-4 border border-gray-600 shadow-lg cursor-pointer hover:bg-gray-700 transition-all duration-300 hover:scale-110 min-w-[120px] min-h-[60px] flex items-center justify-center touch-manipulation">
              <div className="text-white text-base font-semibold text-center">
                Leaderboard
              </div>
            </div>
          </Link>
          <Link href="/how-to-play">
            <div className="bg-gray-800 backdrop-blur-lg rounded-full p-4 border border-gray-600 shadow-lg cursor-pointer hover:bg-gray-700 transition-all duration-300 hover:scale-110 min-w-[120px] min-h-[60px] flex items-center justify-center touch-manipulation">
              <div className="text-white text-base font-semibold text-center">
                How to Play
              </div>
            </div>
          </Link>
          {/* <Link href="/admin">
            <div className="bg-gray-800 backdrop-blur-lg rounded-full p-4 border border-gray-600 shadow-lg cursor-pointer hover:bg-gray-700 transition-all duration-300 hover:scale-110 min-w-[120px] min-h-[60px] flex items-center justify-center touch-manipulation">
              <div className="text-white text-base font-semibold text-center">
                Admin
              </div>
            </div>
          </Link> */}
        </div>
      </div>
    </div>
  );
}