"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Character {
  id: number;
  name: string;
  imageUrl: string;
  forbiddenWords: { word: string }[];
}

export default function CharacterClient({
  themeId,
  initialGameId,
}: {
  themeId?: string | null;
  initialGameId?: string | null;
}) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputs, setInputs] = useState<string[]>([]);

  const gameId = initialGameId ? parseInt(initialGameId) : null;

  const hasFetched = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!themeId || hasFetched.current) return;
    hasFetched.current = true;

    const fetchCharacter = async () => {
      try {
        const response = await fetch(`/api/random-character?themeId=${themeId}`);
        if (!response.ok) throw new Error('Failed to fetch character');
        const data = await response.json();
        setCharacter(data.character);
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
    if (!username || !themeId) return null;

    try {
      const response = await fetch('/api/start-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          themeId: parseInt(themeId),
          characterId,
        }),
      });

      if (!response.ok) throw new Error('Failed to create game');

      const data = await response.json();
      return data.game.id as number;
    } catch (error) {
      console.error('Error creating game:', error);
      return null;
    }
  };

  const handleSubmitHints = async () => {
    if (!character || submitting) return;

    setSubmitting(true);

    try {
      let currentGameId: number | null = gameId;
      if (!currentGameId) {
        currentGameId = await createGame(character.id);
        if (!currentGameId) throw new Error('Game creation failed');
      }

      const hint = inputs.length > 0 ? inputs.join('. ') : 'No hints provided';

      const response = await fetch('/api/give-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: Number(currentGameId),
          hint,
        }),
      });

      if (!response.ok) throw new Error('Hint submission failed');

      const data = await response.json();

      router.push(
        `/ai-guessed?guess=${encodeURIComponent(data.guess || '')}&isCorrect=${
          data.isCorrect
        }&character=${encodeURIComponent(
          data.correctCharacter || ''
        )}&imageUrl=${encodeURIComponent(data.guessedCharacterImage || '')}&correctImage=${encodeURIComponent(data.correctCharacterImage || '')}`
      );
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-2xl">Loading character...</div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">No character found</div>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 right-20 w-24 h-24 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-gray-400 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Guess this character!</h1>

        <div className="animate-scale-in">
          <Image
            src={character.imageUrl}
            alt={character.name}
            width={400}
            height={600}
            className="rounded-lg shadow-2xl mx-auto border border-gray-700"
            priority
            unoptimized
          />
        </div>

        {/* Show the character name (useful for debugging / QA) */}
        <div className="mt-4">
          <h3 className="text-2xl font-semibold animate-fade-in">{character.name}</h3>
        </div>

        <div className="mt-8 animate-slide-up delay-200">
          <h2 className="text-xl font-semibold mb-4">Words you must avoid:</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {character.forbiddenWords.map((fw, index) => (
              <span
                key={index}
                className="bg-red-600/30 text-red-200 px-3 py-1 rounded-full text-sm border border-red-500/30 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {fw.word}
              </span>
            ))}
          </div>

          <input
            type="text"
            placeholder="Describe the character..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputs.length < 3 && inputValue.trim()) {
                setInputs([...inputs, inputValue.trim()]);
                setInputValue('');
              }
            }}
            disabled={inputs.length >= 3}
            className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 px-4 py-2 rounded w-full max-w-md mx-auto block focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
          />

          <div className="mt-4 space-y-2">
            {inputs.map((text, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-3 bg-gray-800/50 backdrop-blur-sm rounded px-4 py-3 max-w-md mx-auto animate-slide-in-left flex-wrap"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="flex-1 text-center break-words">{text}</span>
                <button
                  onClick={() => setInputs(inputs.filter((_, i) => i !== index))}
                  className="w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200 flex-shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4 animate-fade-in delay-500 px-4">
        <button
          onClick={handleSubmitHints}
          disabled={submitting}
          className="w-full max-w-xs bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-5 px-8 rounded-lg text-lg min-h-[60px] touch-manipulation"
        >
          {submitting ? 'Submitting...' : 'Submit Hints'}
        </button>

        <Link href="/themes" className="w-full max-w-xs">
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 px-8 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg min-h-[60px] touch-manipulation">
            Back
          </button>
        </Link>
      </div>
    </div>
  );
}
