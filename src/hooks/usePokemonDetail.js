// Custom hook: loads the full detail of ONE Pokémon.
// The screen only renders what this hook returns.

import { useState, useEffect, useCallback } from 'react';

import { fetchPokemonDetail } from '../api/pokeApi';
import { getArtworkUrl } from '../utils/format';

export default function usePokemonDetail(pokemonId) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Changing this number re-runs the effect: that is how "Reintentar" works
  const [attempt, setAttempt] = useState(0);

  // useEffect dependency array.
  // The request runs only when the id changes or the user taps "Reintentar",
  // so it never repeats endlessly.
  useEffect(() => {
    let cancelled = false; // cleanup flag: ignore the answer if the screen was closed

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPokemonDetail(pokemonId);
        if (cancelled) return;

        // We keep only the fields the screen needs
        setPokemon({
          id: data.id,
          name: data.name,
          image:
            data.sprites?.other?.['official-artwork']?.front_default ??
            data.sprites?.front_default ??
            getArtworkUrl(data.id),
          heightM: data.height / 10, // API gives decimetres
          weightKg: data.weight / 10, // API gives hectograms
          types: data.types.map((item) => item.type.name),
          stats: data.stats.map((item) => ({ name: item.stat.name, value: item.base_stat })),
        });
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    // cleanup function of useEffect
    return () => {
      cancelled = true;
    };
  }, [pokemonId, attempt]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  return { pokemon, loading, error, retry };
}