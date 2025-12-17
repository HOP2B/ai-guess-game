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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col p-4 relative">
      <h1 className="text-8xl font-bold text-white text-center mt-10 mb-16">
        AI Guess Game
      </h1>

      <div className="text-center max-w-md w-full mx-auto mb-8">
        <label htmlFor="userInput" className="block text-white text-lg mt-10 font-medium mb-4">
          Enter your username
        </label>
        <input
          id="userInput"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter your username..."
          className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
        />
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md w-full">
          <button
            onClick={handlePlay}
            disabled={!username.trim()}
            className={`w-full mt-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform transition-all duration-200 text-lg ${
              username.trim()
                ? 'hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Play
          </button>
        </div>
      </div>

      <Link href="/leaderboard">
        <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-lg rounded-full p-6 border border-white/20 shadow-lg cursor-pointer hover:bg-white/20 transition-all">
          <div className="text-white text-lg font-semibold text-center">
            Leaderboard
          </div>
        </div>
      </Link>
    </div>
  );
}