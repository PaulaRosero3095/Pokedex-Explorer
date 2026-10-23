// src/utils/format.js
// Small pure helpers: no state, no JSX.

// The list endpoint only gives name + url, so the id is the last piece of the url
// "https://pokeapi.co/api/v2/pokemon/25/" -> 25
export function getIdFromUrl(url) {
  return Number(url.split('/').filter(Boolean).pop());
}

// 25 -> "#025"
export function formatNumber(id) {
  return `#${String(id).padStart(3, '0')}`;
}

// "pikachu" -> "Pikachu"
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Image for the list, without requesting the full detail of each Pokémon
export function getArtworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}