// src/api/pokeApi.js
// Network layer: the ONLY file in the app that calls fetch.
// Screens and components never talk to the API directly.

const BASE_URL = 'https://pokeapi.co/api/v2';

// Concept: fetch + async/await + response.ok check
async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`);

  // A missing Pokémon returns 404 with plain text (not JSON),
  // so we must check response.ok BEFORE calling response.json()
  if (!response.ok) {
    const error = new Error('Request failed');
    error.status = response.status; // lets the UI tell "not found" (404) from other errors
    throw error;
  }

  return response.json();
}

// GET /pokemon?limit={n}&offset={m}  → paginated list (name + url only)
export function fetchPokemonList(limit = 20, offset = 0) {
  return request(`/pokemon?limit=${limit}&offset=${offset}`);
}

// GET /pokemon/{name or id}  → full detail of one Pokémon
// Names must be lowercase and without leading/trailing spaces
export function fetchPokemon(nameOrId) {
  const query = encodeURIComponent(String(nameOrId).trim().toLowerCase());
  return request(`/pokemon/${query}`);
}