// Presentational component: label + value + a bar proportional to the value.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

const MAX_STAT = 255; // highest base stat possible in the games

// "label" arrives already translated to Spanish (the screen decides the text)
export default function StatBar({ label, value }) {
  // Bar width = value / 255, as a percentage (never above 100%)
  const percentage = Math.min((value / MAX_STAT) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Text style={styles.name}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  textRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  name: { fontSize: 14, fontWeight: '600', color: colors.textSoft },
  value: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  barBackground: { height: 8, backgroundColor: colors.border, borderRadius: radius.sm, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.sm },
});