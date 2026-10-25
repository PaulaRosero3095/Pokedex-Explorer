// Custom hook: owns the search state.
// Live search (debounced) + "Buscar" button (immediate).

import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchAllPokemonNames } from '../api/pokeApi';
import { getIdFromUrl } from '../utils/format';

const DEBOUNCE_MS = 500;
const MAX_RESULTS = 15;

export default function usePokemonSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]); // array of { id, name }
  const [searching, setSearching] = useState(false);
  // searchError = { notFound: boolean, message: string } | null
  const [searchError, setSearchError] = useState(null);

  // useRef.
  // allNamesRef: the big list of names, fetched only once.
  // requestIdRef: lets us ignore answers from older searches that arrive late.
  // timerRef: the pending debounce timer.
  const allNamesRef = useRef(null);
  const requestIdRef = useRef(0);
  const timerRef = useRef(null);

  const runSearch = useCallback(async (rawQuery) => {
    const cleanQuery = rawQuery.trim().toLowerCase();
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;

    // If the query is empty, we clear everything
    if (cleanQuery === '') {
      setSearchResults([]);
      setSearchError(null);
      setSearching(false);
      return;
    }

    setSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      // 1. Get all the names (only the first time)
      if (!allNamesRef.current) {
        allNamesRef.current = await fetchAllPokemonNames();
      }
      if (requestId !== requestIdRef.current) return; // a newer search replaced this one

      // 2. Filter by number (exact) or by name (partial match)
      const isNumeric = /^\d+$/.test(cleanQuery);
      const filtered = allNamesRef.current
        .filter((p) =>
          isNumeric ? String(getIdFromUrl(p.url)) === cleanQuery : p.name.includes(cleanQuery)
        )
        .slice(0, MAX_RESULTS);

      // 3. Format the results
      const formatted = filtered.map((p) => ({ id: getIdFromUrl(p.url), name: p.name }));

      if (formatted.length === 0) {
        // UI state: no results
        setSearchError({
          notFound: true,
          message: 'No encontramos ningún Pokémon con ese nombre o número.',
        });
      } else {
        setSearchResults(formatted);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      // UI state: real error (no internet, server down)
      setSearchError({
        notFound: false,
        message: 'Ocurrió un error al buscar. Revisa tu conexión e inténtalo de nuevo.',
      });
    } finally {
      if (requestId === requestIdRef.current) setSearching(false);
    }
  }, []);

  // useEffect with [query] → live search, waits 500 ms after the last key
  useEffect(() => {
    if (query.trim() === '') {
      runSearch(query); // clearing does not need to wait
      return undefined;
    }
    timerRef.current = setTimeout(() => runSearch(query), DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [query, runSearch]);

  // "Buscar" button: searches right now, without waiting for the debounce
  const searchNow = useCallback(() => {
    clearTimeout(timerRef.current);
    runSearch(query);
  }, [query, runSearch]);

  // "Reintentar" button: repeats the current search
  const retry = useCallback(() => runSearch(query), [query, runSearch]);

  const clearSearch = useCallback(() => setQuery(''), []);

  return {
    query,
    setQuery,
    searchResults,
    searching,
    searchError,
    searchNow,
    retry,
    clearSearch,
  };
}