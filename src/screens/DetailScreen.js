// src/screens/DetailScreen.js
// Screen: shows the full detail of one Pokémon. No fetch calls here:
// the request lives in usePokemonDetail.

import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import usePokemonDetail from '../hooks/usePokemonDetail';
import { formatNumber, capitalize, getTypeColor, translateType, translateStat } from '../utils/format';
import StatBar from '../components/StatBar';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import { colors, spacing, radius } from '../theme';

export default function DetailScreen({ pokemonId, onBack }) {
  const { pokemon, loading, error, retry } = usePokemonDetail(pokemonId);

  // The back button is shown in EVERY state (loading, error and success),
  // so the user is never trapped on this screen
  const header = (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Volver a la lista</Text>
      </Pressable>
    </View>
  );

  // UI state: loading
  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        {header}
        <LoadingView message="Cargando ficha..." />
      </SafeAreaView>
    );
  }

  // UI state: error
  if (error || !pokemon) {
    return (
      <SafeAreaView style={styles.screen}>
        {header}
        <ErrorView
          message="No pudimos cargar la ficha. Revisa tu conexión e inténtalo de nuevo."
          onRetry={retry}
        />
      </SafeAreaView>
    );
  }

  // UI state: success
  return (
    <SafeAreaView style={styles.screen}>
      {header}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainInfo}>
          <Text style={styles.number}>{formatNumber(pokemon.id)}</Text>
          <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
          {/* A remote Image needs explicit width and height */}
          <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.typesContainer}>
          {pokemon.types.map((typeName) => (
            <View key={typeName} style={[styles.typeBadge, { backgroundColor: getTypeColor(typeName) }]}>
              <Text style={styles.typeText}>{translateType(typeName)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.measuresContainer}>
          <View style={styles.measureBox}>
            <Text style={styles.measureValue}>{pokemon.heightM.toFixed(1)} m</Text>
            <Text style={styles.measureLabel}>Altura</Text>
          </View>
          <View style={styles.measureBox}>
            <Text style={styles.measureValue}>{pokemon.weightKg.toFixed(1)} kg</Text>
            <Text style={styles.measureLabel}>Peso</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estadísticas base</Text>
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.name} label={translateStat(stat.name)} value={stat.value} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', padding: spacing.md },
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
  typeText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
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