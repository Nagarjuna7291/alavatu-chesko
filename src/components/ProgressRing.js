import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHabits } from '../context/HabitContext';

export const ProgressRing = () => {
  const { getDailyProgressStats, themeMode } = useHabits();
  const { total, completed, percentage } = getDailyProgressStats();
  const isDark = themeMode === 'dark';

  const getMessage = () => {
    if (total === 0) return 'No habits created yet!';
    if (percentage === 100) return '🎉 Mastered! All habits completed today!';
    if (percentage >= 50) return '💪 Great momentum! Keep pushing!';
    if (percentage > 0) return '🚀 Off to a good start! Finish strong!';
    return '🌟 Ready to achieve your habits today?';
  };

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <View style={styles.contentRow}>
        <View style={styles.textColumn}>
          <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
            Daily Progress
          </Text>
          <Text style={styles.subtitle}>
            {completed} of {total} habits checked off
          </Text>
          <Text style={styles.motivationalText}>
            {getMessage()}
          </Text>
        </View>

        <View style={styles.badgeContainer}>
          <View style={styles.ringOuter}>
            <Text style={styles.percentText}>{percentage}%</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  textColumn: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  motivationalText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
    marginTop: 6,
  },
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 3,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#10B981',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  textDark: { color: '#F8FAFC' },
  textLight: { color: '#0F172A' },
});
