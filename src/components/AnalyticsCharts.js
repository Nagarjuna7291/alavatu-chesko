import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useHabits } from '../context/HabitContext';
import { formatDateKey, getLast30Days } from '../utils/dateUtils';
import { COLORS } from '../constants/theme';

export const AnalyticsCharts = () => {
  const { habits, logs, themeMode } = useHabits();
  const isDark = themeMode === 'dark';

  // Last 7 Days completion data
  const last7Days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = formatDateKey(d);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

    let completedCount = 0;
    habits.forEach(h => {
      if (logs[h.id] && logs[h.id][dateKey]) {
        completedCount++;
      }
    });

    const totalHabits = habits.length || 1;
    const rate = Math.round((completedCount / totalHabits) * 100);

    last7Days.push({
      dateKey,
      dayLabel,
      completedCount,
      rate
    });
  }

  // Last 30 days grid for habit consistency
  const last30 = getLast30Days();

  // Category breakdown
  const categoryStats = {};
  habits.forEach(h => {
    if (!categoryStats[h.category]) {
      categoryStats[h.category] = { count: 0, completedSum: 0 };
    }
    categoryStats[h.category].count += 1;
    
    // Check completion rate over last 7 days
    let habitCompleted7 = 0;
    last7Days.forEach(day => {
      if (logs[h.id] && logs[h.id][day.dateKey]) habitCompleted7++;
    });
    categoryStats[h.category].completedSum += (habitCompleted7 / 7);
  });

  return (
    <View style={styles.container}>
      {/* 1. Weekly Completion Bar Chart */}
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
        <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]}>
          📈 7-Day Completion Trend
        </Text>
        <Text style={styles.cardSubtitle}>Habit check-in percentage per day</Text>

        <View style={styles.chartArea}>
          {last7Days.map((item, idx) => (
            <View key={item.dateKey} style={styles.barColumn}>
              <Text style={styles.barValue}>{item.completedCount}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${Math.max(item.rate, 10)}%` },
                    item.rate >= 80 && { backgroundColor: '#10B981' }
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, isDark ? styles.textSubDark : styles.textSubLight]}>
                {item.dayLabel}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 2. Category Progress Breakdown */}
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
        <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]}>
          🎯 Category Focus & Consistency
        </Text>
        <Text style={styles.cardSubtitle}>Distribution across life domains</Text>

        <View style={{ marginTop: 12, gap: 10 }}>
          {Object.keys(categoryStats).map(catName => {
            const stat = categoryStats[catName];
            const avgRate = Math.round((stat.completedSum / stat.count) * 100);
            const catTheme = COLORS.categories[catName] || COLORS.categories.Custom;

            return (
              <View key={catName}>
                <View style={styles.catRowHeader}>
                  <Text style={[styles.catName, isDark ? styles.textDark : styles.textLight]}>
                    {catName} ({stat.count} {stat.count === 1 ? 'habit' : 'habits'})
                  </Text>
                  <Text style={[styles.catRate, { color: catTheme.color }]}>{avgRate}%</Text>
                </View>
                <View style={styles.catProgressTrack}>
                  <View
                    style={[
                      styles.catProgressFill,
                      { width: `${avgRate}%`, backgroundColor: catTheme.color }
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* 3. Monthly Habit Consistency Heatmap */}
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
        <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]}>
          🔥 30-Day Habit Heatmap
        </Text>
        <Text style={styles.cardSubtitle}>Daily check-ins across all habits</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }}>
          <View style={styles.gridContainer}>
            {last30.map((dItem) => {
              let totalDone = 0;
              habits.forEach(h => {
                if (logs[h.id] && logs[h.id][dItem.dateKey]) totalDone++;
              });

              const totalHabits = habits.length || 1;
              const ratio = totalDone / totalHabits;

              let cellBg = 'rgba(148, 163, 184, 0.15)';
              if (ratio > 0.75) cellBg = '#10B981';
              else if (ratio > 0.4) cellBg = '#34D399';
              else if (ratio > 0) cellBg = '#A7F3D0';

              return (
                <View key={dItem.dateKey} style={styles.gridCellWrapper}>
                  <View style={[styles.gridCell, { backgroundColor: cellBg }]} />
                  <Text style={styles.gridDayText}>{dItem.dayNumber}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginTop: 16,
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  catRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catName: {
    fontSize: 13,
    fontWeight: '700',
  },
  catRate: {
    fontSize: 13,
    fontWeight: '800',
  },
  catProgressTrack: {
    height: 6,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  gridCellWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  gridCell: {
    width: 22,
    height: 22,
    borderRadius: 6,
  },
  gridDayText: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  textDark: { color: '#F8FAFC' },
  textLight: { color: '#0F172A' },
  textSubDark: { color: '#94A3B8' },
  textSubLight: { color: '#64748B' },
});
