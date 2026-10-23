// App.js
// Decides which view is shown: the list or the detail.
// (The real detail screen comes in the next step; this is a placeholder.)

import React, { useState, useCallback } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import ListScreen from './src/screens/ListScreen';
import { formatNumber } from './src/utils/format';

export default function App() {
  // Concept: useState decides the current view (no navigation library needed)
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = useCallback((id) => setSelectedId(id), []);
  const handleBack = useCallback(() => setSelectedId(null), []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {selectedId === null ? (
        <ListScreen onSelectPokemon={handleSelect} />
      ) : (
        <SafeAreaView style={styles.placeholder}>
          <Text style={styles.text}>Detalle de {formatNumber(selectedId)} (próximamente)</Text>
          <View>
            <Button title="Volver a la lista" onPress={handleBack} />
          </View>
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  text: {
    fontSize: 18,
  },
});