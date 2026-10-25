// Network layer: the ONLY file in the app that calls fetch.
// Screens and components never talk to the API directly.
const BASE_URL = 'https://pokeapi.co/api/v2';

// fetch + async/await + response.ok check
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

// GET /pokemon?limit=10000  → gets all Pokémon names (used by the search)
export async function fetchAllPokemonNames() {
  // The API has about 1300 Pokémon, so a 10000 limit ensures we get all of them
  const data = await request('/pokemon?limit=10000');
  return data.results;
}

// GET /pokemon/{id}  → gets the full detail (types, stats, sprites, etc.)
export function fetchPokemonDetail(id) {
  return request(`/pokemon/${id}`);
}