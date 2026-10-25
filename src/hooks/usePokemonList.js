// Custom hook: owns the list state (data, loading, error, pagination).
// It calls the API layer and returns plain values, so screens only render.

import { useState, useEffect, useCallback, useRef } from 'react';

import { fetchPokemonList } from '../api/pokeApi';
import { getIdFromUrl } from '../utils/format';

const PAGE_SIZE = 20;

export default function usePokemonList() {
  // useState for data and every UI state
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true); // first page
  const [loadingMore, setLoadingMore] = useState(false); // next pages
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // useRef keeps a value between renders WITHOUT causing a re-render.
  // offsetRef: where the next page starts. busyRef: blocks duplicate requests,
  // because onEndReached can fire several times in a row.
  const offsetRef = useRef(0);
  const busyRef = useRef(false);

  // useCallback so the function keeps the same identity between renders
  const loadMore = useCallback(async () => {
    if (busyRef.current || !hasMore) return;

    busyRef.current = true;
    const isFirstPage = offsetRef.current === 0;
    if (isFirstPage) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const data = await fetchPokemonList(PAGE_SIZE, offsetRef.current);

      const items = data.results.map((item) => ({
        id: getIdFromUrl(item.url),
        name: item.name,
      }));

      setPokemon((previous) => [...previous, ...items]);
      offsetRef.current += PAGE_SIZE; // only advances when the request succeeded
      setHasMore(data.next !== null); // "next" is null on the last page
    } catch (err) {
      setError(err); // offsetRef is untouched, so "Reintentar" repeats the same page
    } finally {
      busyRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [hasMore]);

  // useEffect with [] -> loads the first page once, when the screen opens
  useEffect(() => {
    loadMore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { pokemon, loading, loadingMore, error, hasMore, loadMore };
}