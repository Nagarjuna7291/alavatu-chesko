import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useHabits } from '../context/HabitContext';
import { COLORS } from '../constants/theme';

export const HabitCard = ({ habit }) => {
  const {
    isHabitCompleted,
    toggleHabitCompletion,
    getHabitStreak,
    deleteHabit,
    selectedDateKey,
    themeMode
  } = useHabits();

  const isCompleted = isHabitCompleted(habit.id, selectedDateKey);
  const streak = getHabitStreak(habit.id);
  const isDark = themeMode === 'dark';

  const categoryTheme = COLORS.categories[habit.category] || COLORS.categories.Custom;

  const handleDelete = () => {
    deleteHabit(habit.id);
  };

  return (
    <View
      style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
        isCompleted && styles.cardCompleted
      ]}
    >
      {/* Category Indicator Strip */}
      <View style={[styles.categoryIndicator, { backgroundColor: habit.color || categoryTheme.color }]} />

      <View style={styles.content}>
        {/* Top Header Row */}
        <View style={styles.topRow}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, isDark ? styles.textDark : styles.textLight, isCompleted && styles.completedText]}>
              {habit.title}
            </Text>
            {habit.description ? (
              <Text style={styles.description} numberOfLines={1}>
                {habit.description}
              </Text>
            ) : null}
          </View>

          {/* Delete Action */}
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={{ fontSize: 13, opacity: 0.6 }}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* Badges & Checkbox Row */}
        <View style={styles.bottomRow}>
          <View style={styles.badgesGroup}>
            <View style={[styles.categoryBadge, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
              <Text style={[styles.categoryBadgeText, { color: habit.color || categoryTheme.color }]}>
                {habit.category}
              </Text>
            </View>

            <View style={styles.streakBadge}>
              <Text style={{ fontSize: 12 }}>🔥</Text>
              <Text style={styles.streakText}>{streak} day streak</Text>
            </View>

            {habit.targetValue && (
              <View style={styles.targetBadge}>
                <Text style={styles.targetText}>🎯 {habit.targetValue}</Text>
              </View>
            )}
          </View>

          {/* Large Check-Off Button */}
          <TouchableOpacity
            style={[
              styles.checkbox,
              isCompleted ? styles.checkboxActive : isDark ? styles.checkboxDark : styles.checkboxLight
            ]}
            onPress={() => toggleHabitCompletion(habit.id)}
            activeOpacity={0.6}
          >
            <Text style={[styles.checkMark, isCompleted && styles.checkMarkActive]}>
              {isCompleted ? '✓' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  cardCompleted: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  categoryIndicator: {
    width: 6,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  description: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  badgesGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  streakText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '700',
  },
  targetBadge: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  targetText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  checkbox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginLeft: 10,
  },
  checkboxDark: {
    borderColor: '#475569',
    backgroundColor: '#0F172A',
  },
  checkboxLight: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  checkboxActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkMark: {
    fontSize: 18,
    color: 'transparent',
    fontWeight: '900',
  },
  checkMarkActive: {
    color: '#FFFFFF',
  },
  textDark: { color: '#F8FAFC' },
  textLight: { color: '#0F172A' },
});
