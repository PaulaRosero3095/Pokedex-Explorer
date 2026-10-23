// src/components/ErrorView.js
// UI state: error (clear message in Spanish + "Reintentar" button)

import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

export default function ErrorView({
  message = 'Ocurrió un error. Revisa tu conexión e inténtalo de nuevo.',
  onRetry,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Ups!</Text>
      <Text style={styles.text}>{message}</Text>
      {onRetry && <Button title="Reintentar" color={colors.primary} onPress={onRetry} />}
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