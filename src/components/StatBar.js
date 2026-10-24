import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

export default function StatBar({ name, value }) {
  const percentage = Math.min((value / 255) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Text style={styles.name}>
          {name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ')}
        </Text>
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
  name: { fontSize: 14, fontWeight: '600', color: colors.textSoft, textTransform: 'capitalize' },
  value: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  barBackground: { height: 8, backgroundColor: colors.border, borderRadius: radius.sm, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.sm },
});