import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHabits } from '../context/HabitContext';

export const StatCard = ({ icon, title, value, subtitle, accentColor = '#10B981' }) => {
  const { themeMode } = useHabits();
  const isDark = themeMode === 'dark';

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: `${accentColor}1A` }]}>
          <Text style={{ fontSize: 18 }}>{icon}</Text>
        </View>
        <Text style={[styles.valueText, { color: accentColor }]}>{value}</Text>
      </View>
      <Text style={[styles.titleText, isDark ? styles.textDark : styles.textLight]}>{title}</Text>
      <Text style={styles.subtitleText}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 22,
    fontWeight: '900',
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  subtitleText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  textDark: { color: '#F8FAFC' },
  textLight: { color: '#0F172A' },
});
