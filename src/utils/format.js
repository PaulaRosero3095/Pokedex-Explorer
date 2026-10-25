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

const TYPE_COLORS = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0',
  electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6',
  fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65',
  flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC',
  dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD',
};

export function getTypeColor(typeName) {
  // If the type is not in our list, we return a default gray color
  return TYPE_COLORS[typeName.toLowerCase()] || '#777777';
}

// The API returns English names, but the interface must be in Spanish
const TYPE_NAMES_ES = {
  normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico',
  grass: 'Planta', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
  ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
  rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
  steel: 'Acero', fairy: 'Hada',
};

const STAT_NAMES_ES = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque esp.',
  'special-defense': 'Defensa esp.',
  speed: 'Velocidad',
};

// "fire" -> "Fuego" (unknown types fall back to the capitalized API name)
export function translateType(name) {
  return TYPE_NAMES_ES[name] ?? capitalize(name);
}

// "special-attack" -> "Ataque esp."
export function translateStat(name) {
  return STAT_NAMES_ES[name] ?? capitalize(name);
}