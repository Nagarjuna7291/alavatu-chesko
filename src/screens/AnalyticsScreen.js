import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useHabits } from '../context/HabitContext';
import { StatCard } from '../components/StatCard';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { formatDateKey } from '../utils/dateUtils';

export const AnalyticsScreen = () => {
  const { habits, logs, getHabitStreak, themeMode } = useHabits();
  const isDark = themeMode === 'dark';

  // Metrics computation
  const totalHabits = habits.length;

  // Best streak calculation
  const bestStreak = habits.reduce((max, h) => {
    const s = getHabitStreak(h.id);
    return s > max ? s : max;
  }, 0);

  // Total check-ins logged
  let totalCheckins = 0;
  Object.values(logs).forEach(hLog => {
    totalCheckins += Object.keys(hLog || {}).length;
  });

  // Calculate overall 7-day completion rate %
  const today = new Date();
  let completed7DaysCount = 0;
  let possible7DaysCount = totalHabits * 7;

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateKey(d);
    
    habits.forEach(h => {
      if (logs[h.id] && logs[h.id][key]) {
        completed7DaysCount++;
      }
    });
  }

  const completionRate7Days = possible7DaysCount > 0
    ? Math.round((completed7DaysCount / possible7DaysCount) * 100)
    : 0;

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Screen Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
            Habit Analytics
          </Text>
          <Text style={styles.subtitle}>
            Track your consistency, streaks, and habit completion growth
          </Text>
        </View>

        {/* Top 4 Key Metric Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="🏆"
            title="Best Streak"
            value={`${bestStreak} days`}
            subtitle="Longest active streak"
            accentColor="#F59E0B"
          />
          <StatCard
            icon="⚡"
            title="Weekly Rate"
            value={`${completionRate7Days}%`}
            subtitle="7-day completion average"
            accentColor="#10B981"
          />
          <StatCard
            icon="✅"
            title="Check-ins"
            value={totalCheckins}
            subtitle="Total habits logged"
            accentColor="#3B82F6"
          />
          <StatCard
            icon="📌"
            title="Active Habits"
            value={totalHabits}
            subtitle="Currently tracking"
            accentColor="#8B5CF6"
          />
        </View>

        {/* Detailed Analytics Charts & Heatmaps */}
        <AnalyticsCharts />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgDark: { backgroundColor: '#0F172A' },
  bgLight: { backgroundColor: '#F8FAFC' },
  scrollContent: {
    paddingBottom: 40,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  textDark: { color: '#F8FAFC' },
  textLight: { color: '#0F172A' },
});
