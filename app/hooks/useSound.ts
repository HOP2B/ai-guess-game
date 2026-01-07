"use client";

import { useCallback, useRef, useEffect } from 'react';

export function useSound() {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const audioUnlocked = useRef(false);

  const unlockAudio = useCallback(() => {
    if (audioUnlocked.current) return;
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0;
    audio.play().then(() => {
      audioUnlocked.current = true;
    }).catch(() => {});
  }, []);

  useEffect(() => {
    // Preload audio files
    const sounds = ['/sounds/click.mp3', '/sounds/success.mp3', '/sounds/error.mp3', '/sounds/guess.mp3', '/sounds/guessedWrong.mp3'];
    sounds.forEach(soundPath => {
      const audio = new Audio(soundPath);
      audio.volume = 0.7;
      audio.preload = 'auto';
      audioRefs.current[soundPath] = audio;
    });
  }, []);

  const playSound = useCallback((soundPath: string) => {
    // Check if user has disabled sounds (could be stored in localStorage)
    const stored = localStorage.getItem('soundsEnabled');
    const soundsEnabled = stored !== 'false';
    console.log('Sound check: stored=', stored, 'enabled=', soundsEnabled);

    if (!soundsEnabled) {
      console.log('Sounds disabled');
      return;
    }

    console.log('Playing sound:', soundPath);
    try {
      const audio = audioRefs.current[soundPath];
      if (audio) {
        // Clone the preloaded audio so multiple plays / overlapping plays work
        // and reset playback to start. Cloning avoids reusing an element that
        // might already be playing (which some browsers ignore).
        const audioToPlay = (audio.cloneNode(true) as HTMLAudioElement) || new Audio(soundPath);
        try {
          audioToPlay.currentTime = 0;
        } catch {
          // Some browsers may throw when setting currentTime before metadata is loaded; ignore.
        }
        audioToPlay.volume = audio.volume ?? 0.7;
        audioToPlay.play().then(() => {
          console.log('Audio played successfully');
        }).catch((_e) => {
          console.warn('Audio play failed:', _e);
        });
      } else {
        // Fallback for non-preloaded
        const newAudio = new Audio(soundPath);
        newAudio.volume = 0.7;
        newAudio.play().then(() => {
          console.log('Audio played successfully');
        }).catch((_e) => {
          console.warn('Audio play failed:', _e);
        });
      }
    } catch (error) {
      console.warn('Failed to play audio:', error);
    }
  }, []);

  const playClick = useCallback(() => playSound('/sounds/click.mp3'), [playSound]);
  const playSuccess = useCallback(() => playSound('/sounds/success.mp3'), [playSound]);
  const playError = useCallback(() => playSound('/sounds/error.mp3'), [playSound]);
  const playGuess = useCallback(() => playSound('/sounds/guess.mp3'), [playSound]);
  const playGuessWrong = useCallback(() => playSound('/sounds/guessedWrong.mp3'), [playSound]);

  return {
    playClick,
    playSuccess,
    playError,
    playGuess,
    playGuessWrong,
  };
}