// src/hooks/usePokemonSearch.js
// Custom hook: owns the search state.
// Separated from usePokemonList because searching is NOT pagination.

import { useState, useCallback } from 'react';
import { fetchPokemon } from '../api/pokeApi';
import { getIdFromUrl } from '../utils/format';

export default function usePokemonSearch() {
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const search = useCallback(async (query) => {
    const cleanQuery = String(query).trim();
    
    // If the user searches for nothing, we clear the search
    if (cleanQuery === '') {
      setSearchResult(null);
      setSearchError(null);
      return;
    }

    setSearching(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      const data = await fetchPokemon(cleanQuery);
      // We adapt the API response to our card format
      setSearchResult({ id: data.id, name: data.name });
    } catch (err) {
      // If it's a 404, it means the Pokémon doesn't exist.
      if (err.status === 404) {
        setSearchError('No se encontró ningún Pokémon con ese nombre o número.');
      } else {
        setSearchError('Ocurrió un error al buscar. Intenta de nuevo.');
      }
    } finally {
      setSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResult(null);
    setSearchError(null);
  }, []);

  return { searchResult, searching, searchError, search, clearSearch };
}