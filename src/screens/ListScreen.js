// src/screens/ListScreen.js
import React, { useCallback } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import usePokemonList from '../hooks/usePokemonList';
import usePokemonSearch from '../hooks/usePokemonSearch';
import PokemonCard from '../components/PokemonCard';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import { colors, spacing, radius } from '../theme';

export default function ListScreen({ onSelectPokemon }) {
  const { pokemon, loading, loadingMore, error, loadMore } = usePokemonList();
  
  
  const { query, setQuery, searchResults, searching, searchError, clearSearch } = usePokemonSearch();

  const renderItem = useCallback(
    ({ item }) => <PokemonCard id={item.id} name={item.name} onPress={onSelectPokemon} />,
    [onSelectPokemon]
  );

  const renderContent = () => {
    
    if (searching) {
      return <LoadingView message="Buscando Pokémon..." />;
    }

    
    if (searchError) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{searchError}</Text>
          <Pressable style={styles.clearButton} onPress={clearSearch}>
            <Text style={styles.clearButtonText}>Limpiar búsqueda</Text>
          </Pressable>
        </View>
      );
    }

    // 3. Resultados de búsqueda (pueden ser varios)
    if (searchResults.length > 0) {
      return (
        <View style={{ flex: 1 }}>
          <Text style={styles.subtitle}>Resultados de búsqueda:</Text>
          
          <FlatList
            data={searchResults}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListFooterComponent={
              <Pressable style={[styles.clearButton, styles.alignCenter]} onPress={clearSearch}>
                <Text style={styles.clearButtonText}>Volver a la lista completa</Text>
              </Pressable>
            }
          />
        </View>
      );
    }

    
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
      
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Busca por nombre o número..."
          value={query}
          onChangeText={setQuery} 
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable style={styles.clearIcon} onPress={clearSearch}>
            <Text style={styles.clearIconText}>✕</Text>
          </Pressable>
        )}
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
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
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
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: colors.error || 'red',
    textAlign: 'center',
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
  }
});