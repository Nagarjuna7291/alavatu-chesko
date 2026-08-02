import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useHabits } from '../context/HabitContext';
import { getWeekDays } from '../utils/dateUtils';

export const DateStrip = () => {
  const { selectedDateKey, handleSelectDate, selectedDateObj, themeMode } = useHabits();
  const weekDays = getWeekDays(selectedDateObj);
  const isDark = themeMode === 'dark';

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weekDays.map((item) => {
          const isSelected = item.dateKey === selectedDateKey;

          return (
            <TouchableOpacity
              key={item.dateKey}
              style={[
                styles.dayCard,
                isDark ? styles.dayCardDark : styles.dayCardLight,
                isSelected && styles.dayCardSelected,
                item.isToday && !isSelected && styles.dayCardToday
              ]}
              onPress={() => handleSelectDate(item.dateObj)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayName,
                  isSelected
                    ? styles.textSelected
                    : isDark
                    ? styles.textSubDark
                    : styles.textSubLight
                ]}
              >
                {item.dayName}
              </Text>

              <Text
                style={[
                  styles.dayNumber,
                  isSelected
                    ? styles.textSelected
                    : isDark
                    ? styles.textMainDark
                    : styles.textMainLight
                ]}
              >
                {item.dayNumber}
              </Text>

              {item.isToday && (
                <View style={[styles.todayDot, isSelected && { backgroundColor: '#FFFFFF' }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  dayCard: {
    width: 52,
    height: 68,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dayCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  dayCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  dayCardSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    elevation: 3,
  },
  dayCardToday: {
    borderColor: '#10B981',
    borderWidth: 1.5,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
    marginTop: 4,
  },
  textSelected: {
    color: '#FFFFFF',
  },
  textMainDark: { color: '#F8FAFC' },
  textMainLight: { color: '#0F172A' },
  textSubDark: { color: '#94A3B8' },
  textSubLight: { color: '#64748B' },
});
