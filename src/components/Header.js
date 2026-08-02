import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react me-native'; // Will render cross-platform
import { COLORS } from '../constants/theme';
import { useHabits } from '../context/HabitContext';
import { getFormattedHeaderDate } from '../utils/dateUtils';

export const Header = ({ currentTab, setCurrentTab, onOpenAddModal }) => {
  const { habits, getHabitStreak, themeMode, setThemeMode } = useHabits();

  // Calculate total streak points across all habits
  const totalStreak = habits.reduce((acc, h) => acc + getHabitStreak(h.id), 0);

  const isDark = themeMode === 'dark';

  return (
    <View style={[styles.headerContainer, isDark ? styles.headerDark : styles.headerLight]}>
      <View style={styles.topRow}>
        <View>
          <View style={styles.titleRow}>
            <Text style={[styles.appTitle, isDark ? styles.textDark : styles.textLight]}>
              Alavatu Chesko
            </Text>
            <View style={styles.teluguBadge}>
              <Text style={styles.teluguText}>అలవాటు చేసుకో</Text>
            </View>
          </View>
          <Text style={styles.dateSubtext}>
            {getFormattedHeaderDate()}
          </Text>
        </View>

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.streakBadge}
            activeOpacity={0.8}
          >
            <Text style={styles.fireEmoji}>🔥</Text>
            <Text style={styles.streakCount}>{totalStreak}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.themeToggle, isDark ? styles.themeToggleDark : styles.themeToggleLight]}
            onPress={() => setThemeMode(isDark ? 'light' : 'dark')}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, currentTab === 'Dashboard' && styles.tabActive]}
          onPress={() => setCurrentTab('Dashboard')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, currentTab === 'Dashboard' ? styles.tabTextActive : isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
            ⚡ Today's Habits
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, currentTab === 'Analytics' && styles.tabActive]}
          onPress={() => setCurrentTab('Analytics')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, currentTab === 'Analytics' ? styles.tabTextActive : isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
            📊 Analytics & Trends
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerDark: {
    backgroundColor: '#0F172A',
    borderBottomColor: '#1E293B',
  },
  headerLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E2E8F0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  teluguBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  teluguText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  dateSubtext: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  fireEmoji: {
    fontSize: 15,
  },
  streakCount: {
    color: '#F59E0B',
    fontWeight: '800',
    fontSize: 14,
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  themeToggleDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  themeToggleLight: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderRadius: 12,
    padding: 4,
    gap: 6,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  textDark: { color: '#F8FAFC' },
  textLight: { color: '#0F172A' },
  textSecondaryDark: { color: '#94A3B8' },
  textSecondaryLight: { color: '#64748B' },
});
