// App.js
import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';

export default function App() {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = useCallback((id) => setSelectedId(id), []);
  const handleBack = useCallback(() => setSelectedId(null), []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {selectedId === null ? (
        <ListScreen onSelectPokemon={handleSelect} />
      ) : (
        <DetailScreen pokemonId={selectedId} onBack={handleBack} />
      )}
    </SafeAreaProvider>
  );
}