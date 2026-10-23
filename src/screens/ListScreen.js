// src/screens/ListScreen.js
// Screen: assembles the hook + components. No fetch calls here.

import React, { useCallback } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import usePokemonList from '../hooks/usePokemonList';
import PokemonCard from '../components/PokemonCard';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import { colors, spacing } from '../theme';

export default function ListScreen({ onSelectPokemon }) {
  const { pokemon, loading, loadingMore, error, loadMore } = usePokemonList();

  // Concept: useCallback keeps renderItem stable, so FlatList does not redo work
  const renderItem = useCallback(
    ({ item }) => <PokemonCard id={item.id} name={item.name} onPress={onSelectPokemon} />,
    [onSelectPokemon]
  );

  // Concept: one function that decides what the user sees (UI states)
  const renderContent = () => {
    if (loading) {
      return <LoadingView message="Cargando Pokémon..." />;
    }

    if (error && pokemon.length === 0) {
      return (
        <ErrorView
          message="No pudimos cargar los Pokémon. Revisa tu conexión e inténtalo de nuevo."
          onRetry={loadMore}
        />
      );
    }

    return (
      // Concept: FlatList (not ScrollView + map) for long lists
      <FlatList
        data={pokemon}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        // Infinite scroll: asks for 20 more when the user is near the end
        onEndReached={() => {
          if (!error) loadMore(); // after an error the user decides with "Reintentar"
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.footer} color={colors.primary} />
          ) : error ? (
            <View style={styles.footer}>
              <Text style={styles.footerText}>No se pudieron cargar más Pokémon.</Text>
              <Button title="Reintentar" color={colors.primary} onPress={loadMore} />
            </View>
          ) : null
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>PokéDex Explorer</Text>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  list: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerText: {
    color: colors.textSoft,
  },
});