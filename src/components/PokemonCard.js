// src/components/PokemonCard.js
// Presentational component: it only draws what it receives through props.

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { capitalize, formatNumber, getArtworkUrl } from '../utils/format';
import { colors, radius, spacing } from '../theme';

function PokemonCard({ id, name, onPress }) {
  return (
    // The wrapper takes 50% of the row; the padding creates the gap between cards
    <View style={styles.cell}>
      <Pressable
        onPress={() => onPress(id)}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        {/* Concept: a remote Image NEEDS explicit width and height or it is invisible */}
        <Image
          source={{ uri: getArtworkUrl(id) }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.number}>{formatNumber(id)}</Text>
        <Text style={styles.name}>{capitalize(name)}</Text>
      </Pressable>
    </View>
  );
}

// Concept: React.memo avoids re-drawing cards that did not change when more are loaded
export default React.memo(PokemonCard);

const styles = StyleSheet.create({
  cell: {
    width: '50%',
    padding: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: 120,
  },
  number: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSoft,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});