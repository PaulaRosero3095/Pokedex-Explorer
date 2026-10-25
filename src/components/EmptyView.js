// UI state: no results (the searched Pokémon does not exist)

import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

export default function EmptyView({ message, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sin resultados</Text>
      <Text style={styles.text}>{message}</Text>
      {onAction && <Button title={actionLabel} color={colors.primary} onPress={onAction} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  text: {
    fontSize: 15,
    color: colors.textSoft,
    textAlign: 'center',
  },
});