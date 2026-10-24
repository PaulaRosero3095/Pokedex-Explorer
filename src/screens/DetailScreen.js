import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchPokemonDetail } from '../api/pokeApi';
import { formatNumber, capitalize, getTypeColor } from '../utils/format';
import StatBar from '../components/StatBar';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import { colors, spacing, radius } from '../theme';

export default function DetailScreen({ pokemonId, onBack }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true; 
    setLoading(true);
    setError(null);

    fetchPokemonDetail(pokemonId)
      .then((data) => { if (isMounted) setPokemon(data); })
      .catch((err) => { if (isMounted) setError(err); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [pokemonId, retryCount]);

  if (loading) return <LoadingView message="Cargando ficha..." />;
  
  if (error || !pokemon) {
    return <ErrorView message="No pudimos cargar la ficha." onRetry={() => setRetryCount(c => c + 1)} />;
  }

  const heightInMeters = (pokemon.height / 10).toFixed(1);
  const weightInKg = (pokemon.weight / 10).toFixed(1);
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Volver a la lista</Text>
          </Pressable>
        </View>

        <View style={styles.mainInfo}>
          <Text style={styles.number}>{formatNumber(pokemon.id)}</Text>
          <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.typesContainer}>
          {pokemon.types.map((typeInfo) => {
            const typeName = typeInfo.type.name;
            return (
              <View key={typeName} style={[styles.typeBadge, { backgroundColor: getTypeColor(typeName) }]}>
                <Text style={styles.typeText}>{capitalize(typeName)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.measuresContainer}>
          <View style={styles.measureBox}>
            <Text style={styles.measureValue}>{heightInMeters} m</Text>
            <Text style={styles.measureLabel}>Altura</Text>
          </View>
          <View style={styles.measureBox}>
            <Text style={styles.measureValue}>{weightInKg} kg</Text>
            <Text style={styles.measureLabel}>Peso</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estadísticas Base</Text>
          {pokemon.stats.map((statInfo) => (
            <StatBar key={statInfo.stat.name} name={statInfo.stat.name} value={statInfo.base_stat} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', marginBottom: spacing.md },
  backButton: {
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
  },
  backButtonText: { color: colors.text, fontWeight: 'bold' },
  mainInfo: { alignItems: 'center', marginBottom: spacing.lg },
  number: { fontSize: 20, fontWeight: 'bold', color: colors.textSoft },
  name: { fontSize: 32, fontWeight: '900', color: colors.text, marginBottom: spacing.md },
  image: { width: 200, height: 200 },
  typesContainer: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  typeBadge: { paddingVertical: spacing.xs, paddingHorizontal: spacing.lg, borderRadius: 20 },
  typeText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, textTransform: 'capitalize' },
  measuresContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.xl },
  measureBox: {
    alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md,
    borderRadius: radius.md, width: '45%', borderWidth: 1, borderColor: colors.border,
  },
  measureValue: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  measureLabel: { fontSize: 14, color: colors.textSoft, marginTop: spacing.xs },
  statsContainer: { marginTop: spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: spacing.md },
});