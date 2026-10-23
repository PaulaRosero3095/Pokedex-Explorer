// src/screens/ListScreen.js
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import usePokemonList from '../hooks/usePokemonList';
import usePokemonSearch from '../hooks/usePokemonSearch'; // <-- Importamos el nuevo hook
import PokemonCard from '../components/PokemonCard';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import { colors, spacing, radius } from '../theme';

export default function ListScreen({ onSelectPokemon }) {
  const { pokemon, loading, loadingMore, error, loadMore } = usePokemonList();
  
  // --- Lógica de Búsqueda ---
  const [query, setQuery] = useState('');
  const { searchResult, searching, searchError, search, clearSearch } = usePokemonSearch();

  const handleSearch = () => {
    search(query);
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  // Concept: useCallback keeps renderItem stable
  const renderItem = useCallback(
    ({ item }) => <PokemonCard id={item.id} name={item.name} onPress={onSelectPokemon} />,
    [onSelectPokemon]
  );

  // Concept: one function that decides what the user sees (UI states)
  const renderContent = () => {
    // 1. SI ESTAMOS BUSCANDO
    if (searching) {
      return <LoadingView message="Buscando Pokémon..." />;
    }

    if (searchError) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{searchError}</Text>
          <Button title="Limpiar búsqueda" onPress={handleClear} color={colors.primary} />
        </View>
      );
    }

    if (searchResult) {
      return (
        <View style={styles.center}>
          <Text style={styles.subtitle}>Resultado de búsqueda:</Text>
          <View style={{ width: '50%', padding: spacing.sm }}>
            <PokemonCard id={searchResult.id} name={searchResult.name} onPress={onSelectPokemon} />
          </View>
          <Button title="Volver a la lista completa" onPress={handleClear} color={colors.primary} />
        </View>
      );
    }

    // 2. SI NO HAY BÚSQUEDA, MOSTRAMOS LA LISTA NORMAL
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
      <FlatList
        data={pokemon}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onEndReached={() => {
          if (!error) loadMore();
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
      
      {/* Concept: Search Bar. autoCapitalize and autoCorrect are required by the PDF */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Busca por nombre o número..."
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleSearch} // Permite buscar al presionar "Enter" en el teclado
        />
        <Button title="Buscar" onPress={handleSearch} color={colors.primary} />
      </View>

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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    color: colors.text,
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  errorText: {
    fontSize: 16,
    color: colors.error || 'red', // Asumiendo que tienes un color de error
    textAlign: 'center',
  },
});