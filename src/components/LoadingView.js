// src/components/LoadingView.js
// UI state: loading (spinner + text)

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

export default function LoadingView({ message = 'Cargando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  text: {
    fontSize: 15,
    color: colors.textSoft,
  },
});