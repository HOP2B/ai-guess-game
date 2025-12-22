'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Character {
  id: number;
  name: string;
  imageUrl: string;
  forbiddenWords: { word: string }[];
}

export default function CharacterPage() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [inputs, setInputs] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const themeId = searchParams.get('theme');
  const gameId = searchParams.get('gameId');
  const hasFetched = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!themeId) return;

    if (hasFetched.current) return;

    hasFetched.current = true;

    const fetchCharacter = async () => {
      try {
        const response = await fetch(`/api/random-character?themeId=${themeId}`);
        if (response.ok) {
          const data = await response.json();
          setCharacter(data.character);
        }
      } catch (error) {
        console.error('Failed to fetch character:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [themeId]);

  const createGame = async (characterId: number) => {
    const username = localStorage.getItem('username');
    if (!username) return null;

    try {
      const response = await fetch('/api/start-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, themeId: parseInt(themeId!), characterId }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.game.id;
      }
    } catch (error) {
      console.error('Error creating game:', error);
    }
    return null;
  };

  const handleSubmitHints = async () => {
    if (!character || inputs.length === 0) return;

    // Create game if not already created
    let currentGameId = gameId;
    if (!currentGameId) {
      currentGameId = await createGame(character.id);
      if (!currentGameId) return;
    }

    const hint = inputs.join('. '); // Combine hints

    try {
      const response = await fetch('/api/give-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: parseInt(currentGameId), hint }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/ai-guessed?guess=${encodeURIComponent(data.guess)}&isCorrect=${data.isCorrect}&character=${encodeURIComponent(data.correctCharacter || '')}`);
      } else {
        console.error('Failed to submit hints');
      }
    } catch (error) {
      console.error('Error submitting hints:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-96 bg-white/10 rounded-lg shadow-2xl mx-auto mb-4 animate-pulse"></div>
          <div className="w-48 h-8 bg-white/10 rounded mx-auto mb-2 animate-pulse"></div>
          <div className="text-white text-2xl">Loading character...</div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">No character found</div>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Guess this character!</h1>
        <Image
          key={character.id}
          src={character.imageUrl}
          alt={character.name}
          width={400}
          height={600}
          className="rounded-lg shadow-2xl mx-auto"
          priority
          unoptimized
        />
        <h1 className="text-3xl font-bold mt-4">{character.name}</h1>
        <div className="mt-8">
          <h1 className="text-xl font-semibold mb-4">Words you must avoid:</h1>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {character.forbiddenWords.map((fw, index) => (
              <span key={index} className="bg-red-500/20 text-red-200 px-3 py-1 rounded-full text-sm">
                {fw.word}
              </span>
            ))}
          </div>
          <h1 className="text-lg mb-4">NOW, provide a hint for the AI</h1>
          <input
            type="text"
            placeholder="Describe the character..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputs.length < 3 && inputValue.trim() !== '') {
                setInputs([...inputs, inputValue]);
                setInputValue('');
              }
            }}
            disabled={inputs.length >= 3}
            className="bg-white/20 border border-white/30 text-white placeholder-white/60 px-4 py-2 rounded w-full max-w-md mx-auto block"
          />
          <div className="mt-4 space-y-2">
            {inputs.map((text, index) => (
              <div key={index} className="flex items-center justify-center gap-2 bg-white/10 rounded px-4 py-2 max-w-md mx-auto">
                <span>{text}</span>
                <button
                  onClick={() => setInputs(inputs.filter((_, i) => i !== index))}
                  className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto flex justify-between">
        <Link href="/themes">
          <button className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 text-lg">
            Back
          </button>
        </Link>
        <button
          onClick={handleSubmitHints}
          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 text-lg"
        >
          Submit Hints
        </button>
      </div>
    </div>
  );
}
