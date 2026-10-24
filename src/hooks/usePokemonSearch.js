// src/hooks/usePokemonSearch.js
import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchAllPokemonNames } from '../api/pokeApi';
import { getIdFromUrl } from '../utils/format';

export default function usePokemonSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]); // Ahora es un arreglo
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // UseRef to store the big list of names so we only fetch it once
  const allNamesRef = useRef(null);

  useEffect(() => {
    const cleanQuery = query.trim().toLowerCase();

    // If query is empty, we clear results
    if (cleanQuery === '') {
      setSearchResults([]);
      setSearchError(null);
      setSearching(false);
      return;
    }

    
    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      setSearchResults([]);

      try {
        
        if (!allNamesRef.current) {
          allNamesRef.current = await fetchAllPokemonNames();
        }

        
        const filtered = allNamesRef.current
          .filter((p) => {
            
            const isNumeric = /^\d+$/.test(cleanQuery);
            if (isNumeric) {
              return String(getIdFromUrl(p.url)) === cleanQuery;
            }
            return p.name.includes(cleanQuery);
          })
          .slice(0, 15); 

        // 3. Format the results
        const formattedResults = filtered.map((p) => ({
          id: getIdFromUrl(p.url),
          name: p.name,
        }));

        if (formattedResults.length === 0) {
          setSearchError('No se encontró ningún Pokémon con ese nombre o número.');
        } else {
          setSearchResults(formattedResults);
        }
      } catch (err) {
        setSearchError('Ocurrió un error al buscar. Intenta de nuevo.');
      } finally {
        setSearching(false);
      }
    }, 500); 

    return () => clearTimeout(timer);
  }, [query]);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return { query, setQuery, searchResults, searching, searchError, clearSearch };
} 