// Decides which view is shown: the list or the detail.

import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';

export default function App() {
  // useState decides the current view (no navigation library needed)
  const [selectedId, setSelectedId] = useState(null);

  // useCallback keeps the handlers stable between renders
  const handleSelect = useCallback((id) => setSelectedId(id), []);
  const handleBack = useCallback(() => setSelectedId(null), []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />

      {/* The list stays mounted (only hidden) while the detail is open,
          so the loaded pages, the scroll position and the search are not lost */}
      <View style={[styles.flex, selectedId !== null && styles.hidden]}>
        <ListScreen onSelectPokemon={handleSelect} />
      </View>

      {selectedId !== null && <DetailScreen pokemonId={selectedId} onBack={handleBack} />}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
});