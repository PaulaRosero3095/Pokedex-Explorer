// Screen: assembles hooks + components. No fetch calls here.

import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import usePokemonList from '../hooks/usePokemonList';
import usePokemonSearch from '../hooks/usePokemonSearch';
import PokemonCard from '../components/PokemonCard';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import EmptyView from '../components/EmptyView';
import { colors, spacing, radius } from '../theme';

export default function ListScreen({ onSelectPokemon }) {
  const { pokemon, loading, loadingMore, error, loadMore } = usePokemonList();

  // --- Search logic ---
  const { query, setQuery, searchResults, searching, searchError, searchNow, retry, clearSearch } =
    usePokemonSearch();

  // "Buscar" button / Enter key: search right now and close the keyboard
  const handleSearch = () => {
    Keyboard.dismiss();
    searchNow();
  };

  // useCallback keeps renderItem stable
  const renderItem = useCallback(
    ({ item }) => <PokemonCard id={item.id} name={item.name} onPress={onSelectPokemon} />,
    [onSelectPokemon]
  );

  // one function that decides what the user sees (UI states)
  const renderContent = () => {
    // 1. A SEARCH IS ACTIVE
    if (searching) {
      return <LoadingView message="Buscando Pokémon..." />;
    }

    // Search state: no results (the Pokémon does not exist)
    if (searchError?.notFound) {
      return (
        <EmptyView
          message={searchError.message}
          actionLabel="Volver a la lista completa"
          onAction={clearSearch}
        />
      );
    }

    // Search state: real error, with "Reintentar"
    if (searchError) {
      return (
        <View style={styles.flex}>
          <ErrorView message={searchError.message} onRetry={retry} />
          <Pressable style={[styles.clearButton, styles.alignCenter]} onPress={clearSearch}>
            <Text style={styles.clearButtonText}>Limpiar búsqueda</Text>
          </Pressable>
        </View>
      );
    }

    // Search state: success (there can be several results)
    if (searchResults.length > 0) {
      return (
        <View style={styles.flex}>
          <Text style={styles.subtitle}>Resultados de búsqueda:</Text>

          <FlatList
            data={searchResults}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={
              <Pressable style={[styles.clearButton, styles.alignCenter]} onPress={clearSearch}>
                <Text style={styles.clearButtonText}>Volver a la lista completa</Text>
              </Pressable>
            }
          />
        </View>
      );
    }

    // 2. NO SEARCH ACTIVE: SHOW THE NORMAL LIST
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
      // FlatList (not ScrollView + map) for long lists
      <FlatList
        data={pokemon}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        // Lets a card be tapped with only one touch while the keyboard is open
        keyboardShouldPersistTaps="handled"
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

      {/* Search bar: text input + "Buscar" button */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Busca por nombre o número..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch} // pressing "Enter" on the keyboard also searches
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable style={styles.clearIcon} onPress={clearSearch}>
              <Text style={styles.clearIconText}>✕</Text>
            </Pressable>
          )}
        </View>

        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </Pressable>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    height: 48,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: 16,
  },
  clearIcon: {
    padding: spacing.xs,
  },
  clearIconText: {
    color: colors.textSoft,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchButton: {
    height: 48,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
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
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  clearButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    marginTop: spacing.md,
  },
  clearButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  alignCenter: {
    alignSelf: 'center',
    marginVertical: spacing.lg,
  },
});