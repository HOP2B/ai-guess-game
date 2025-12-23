'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Theme {
  id: number;
  name: string;
  imageUrl: string | null;
  _count: {
    characters: number;
  };
}

interface Character {
  id: number;
  name: string;
  imageUrl: string;
  themeId: number;
  forbiddenWords: { word: string }[];
}

export default function Admin() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeImage, setNewThemeImage] = useState('');
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterImage, setNewCharacterImage] = useState('');
  const [newCharacterTheme, setNewCharacterTheme] = useState('');
  const [newForbiddenWord, setNewForbiddenWord] = useState('');
  const [selectedCharacterForWord, setSelectedCharacterForWord] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [themesRes, charactersRes] = await Promise.all([
        fetch('/api/themes'),
        fetch('/api/characters')
      ]);

      if (themesRes.ok) {
        const themesData = await themesRes.json();
        setThemes(themesData.themes);
      }

      if (charactersRes.ok) {
        const charactersData = await charactersRes.json();
        setCharacters(charactersData.characters);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newThemeName,
          imageUrl: newThemeImage || null
        }),
      });

      if (response.ok) {
        setNewThemeName('');
        setNewThemeImage('');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create theme:', error);
    }
  };

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/upload-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCharacterName,
          theme: newCharacterTheme,
          imageUrl: newCharacterImage
        }),
      });

      if (response.ok) {
        setNewCharacterName('');
        setNewCharacterImage('');
        setNewCharacterTheme('');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  const handleAddForbiddenWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharacterForWord) return;

    try {
      const response = await fetch('/api/forbidden-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: selectedCharacterForWord,
          word: newForbiddenWord
        }),
      });

      if (response.ok) {
        setNewForbiddenWord('');
        setSelectedCharacterForWord(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to add forbidden word:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Admin Panel</h1>

        <Link href="/">
          <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg mb-8">
            Back to Game
          </button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Create Theme */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Create Theme</h2>
            <form onSubmit={handleCreateTheme} className="space-y-4">
              <input
                type="text"
                placeholder="Theme name"
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60"
                required
              />
              <input
                type="url"
                placeholder="Theme image URL (optional)"
                value={newThemeImage}
                onChange={(e) => setNewThemeImage(e.target.value)}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Create Theme
              </button>
            </form>
          </div>

          {/* Create Character */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Create Character</h2>
            <form onSubmit={handleCreateCharacter} className="space-y-4">
              <input
                type="text"
                placeholder="Character name"
                value={newCharacterName}
                onChange={(e) => setNewCharacterName(e.target.value)}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60"
                required
              />
              <select
                value={newCharacterTheme}
                onChange={(e) => setNewCharacterTheme(e.target.value)}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                required
              >
                <option value="">Select theme</option>
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.name}>
                    {theme.name}
                  </option>
                ))}
              </select>
              <input
                type="url"
                placeholder="Character image URL"
                value={newCharacterImage}
                onChange={(e) => setNewCharacterImage(e.target.value)}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Create Character
              </button>
            </form>
          </div>

          {/* Add Forbidden Word */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Add Forbidden Word</h2>
            <form onSubmit={handleAddForbiddenWord} className="space-y-4">
              <select
                value={selectedCharacterForWord || ''}
                onChange={(e) => setSelectedCharacterForWord(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                required
              >
                <option value="">Select character</option>
                {characters.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Forbidden word"
                value={newForbiddenWord}
                onChange={(e) => setNewForbiddenWord(e.target.value)}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60"
                required
              />
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Add Forbidden Word
              </button>
            </form>
          </div>
        </div>

        {/* Data Overview */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Themes List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Themes ({themes.length})</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {themes.map((theme) => (
                <div key={theme.id} className="flex justify-between text-white bg-white/10 rounded p-2">
                  <span>{theme.name}</span>
                  <span className="text-sm text-gray-300">{theme._count.characters} characters</span>
                </div>
              ))}
            </div>
          </div>

          {/* Characters List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Characters ({characters.length})</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {characters.map((character) => (
                <div key={character.id} className="text-white bg-white/10 rounded p-2">
                  <div className="font-semibold">{character.name}</div>
                  <div className="text-sm text-gray-300">
                    Forbidden words: {character.forbiddenWords.map(fw => fw.word).join(', ') || 'None'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}