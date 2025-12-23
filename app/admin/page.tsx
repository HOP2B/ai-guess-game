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
  const [expandedThemes, setExpandedThemes] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeImage, setNewThemeImage] = useState('');
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterImage, setNewCharacterImage] = useState('');
  const [newCharacterTheme, setNewCharacterTheme] = useState('');
  const [newForbiddenWords, setNewForbiddenWords] = useState('');
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

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleThemeExpansion = (themeId: number) => {
    const newExpanded = new Set(expandedThemes);
    if (newExpanded.has(themeId)) {
      newExpanded.delete(themeId);
    } else {
      newExpanded.add(themeId);
    }
    setExpandedThemes(newExpanded);
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
        showToast(`Theme "${newThemeName}" created successfully!`);
        fetchData();
      } else {
        showToast('Failed to create theme', 'error');
      }
    } catch (error) {
      console.error('Failed to create theme:', error);
      showToast('Failed to create theme', 'error');
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
        showToast(`Character "${newCharacterName}" created successfully!`);
        fetchData();
      } else {
        showToast('Failed to create character', 'error');
      }
    } catch (error) {
      console.error('Failed to create character:', error);
      showToast('Failed to create character', 'error');
    }
  };

  const handleAddForbiddenWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharacterForWord || !newForbiddenWords.trim()) return;

    const words = newForbiddenWords.split(',').map(w => w.trim()).filter(w => w.length > 0);

    if (words.length === 0) return;

    try {
      // Add all words
      const promises = words.map(word =>
        fetch('/api/forbidden-words', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characterId: selectedCharacterForWord,
            word: word
          }),
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.ok).length;

      if (successCount > 0) {
        showToast(`${successCount} forbidden word${successCount > 1 ? 's' : ''} added successfully!`);
        if (successCount === words.length) {
          setNewForbiddenWords('');
        }
        fetchData();
      } else {
        showToast('Failed to add forbidden words', 'error');
      }
    } catch (error) {
      console.error('Failed to add forbidden words:', error);
      showToast('Failed to add forbidden words', 'error');
    }
  };

  const handleDeleteTheme = async (themeId: number, themeName: string) => {
    if (!confirm(`Are you sure you want to delete the theme "${themeName}"? This will also delete all characters in this theme.`)) return;

    try {
      const response = await fetch(`/api/themes/${themeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast(`Theme "${themeName}" deleted successfully!`);
        fetchData();
      } else {
        showToast('Failed to delete theme', 'error');
      }
    } catch (error) {
      console.error('Failed to delete theme:', error);
      showToast('Failed to delete theme', 'error');
    }
  };

  const handleDeleteCharacter = async (characterId: number, characterName: string) => {
    if (!confirm(`Are you sure you want to delete the character "${characterName}"?`)) return;

    try {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast(`Character "${characterName}" deleted successfully!`);
        fetchData();
      } else {
        showToast('Failed to delete character', 'error');
      }
    } catch (error) {
      console.error('Failed to delete character:', error);
      showToast('Failed to delete character', 'error');
    }
  };

  const handleDeleteForbiddenWord = async (characterId: number, word: string) => {
    if (!confirm(`Are you sure you want to delete the forbidden word "${word}"?`)) return;

    try {
      const response = await fetch(`/api/forbidden-words/${characterId}/${word}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast(`Forbidden word "${word}" deleted successfully!`);
        fetchData();
      } else {
        showToast('Failed to delete forbidden word', 'error');
      }
    } catch (error) {
      console.error('Failed to delete forbidden word:', error);
      showToast('Failed to delete forbidden word', 'error');
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
              <textarea
                placeholder="Forbidden words (comma-separated)"
                value={newForbiddenWords}
                onChange={(e) => setNewForbiddenWords(e.target.value)}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 resize-none"
                rows={3}
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

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {toast.message}
          </div>
        )}

        {/* Data Overview */}
        <div className="mt-12">
          {/* Themes List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Themes ({themes.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {themes.map((theme) => {
                const themeCharacters = characters.filter(c => c.themeId === theme.id);
                const isExpanded = expandedThemes.has(theme.id);

                return (
                  <div key={theme.id} className="bg-white/10 rounded p-3">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => toggleThemeExpansion(theme.id)}
                        className="flex items-center text-white hover:text-blue-300"
                      >
                        <span className="mr-2">{isExpanded ? '▼' : '▶'}</span>
                        <span className="font-semibold">{theme.name}</span>
                        <span className="text-sm text-gray-300 ml-2">({theme._count.characters} characters)</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTheme(theme.id, theme.name)}
                        className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 ml-6 space-y-2">
                        {themeCharacters.map((character) => (
                          <div key={character.id} className="bg-white/5 rounded p-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-white font-medium">{character.name}</div>
                                <div className="text-sm text-gray-300">
                                  Forbidden: {character.forbiddenWords.map(fw => (
                                    <span key={fw.word} className="inline-flex items-center mr-1">
                                      {fw.word}
                                      <button
                                        onClick={() => handleDeleteForbiddenWord(character.id, fw.word)}
                                        className="ml-1 text-red-400 hover:text-red-300 text-xs"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteCharacter(character.id, character.name)}
                                className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                        {themeCharacters.length === 0 && (
                          <div className="text-gray-400 text-sm italic">No characters in this theme</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}