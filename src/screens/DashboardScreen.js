import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { useHabits } from '../context/HabitContext';
import { DateStrip } from '../components/DateStrip';
import { ProgressRing } from '../components/ProgressRing';
import { HabitCard } from '../components/HabitCard';
import { AddHabitModal } from '../components/AddHabitModal';
import { COLORS } from '../constants/theme';

export const DashboardScreen = () => {
  const {
    habits,
    activeCategory,
    setActiveCategory,
    themeMode
  } = useHabits();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const isDark = themeMode === 'dark';

  const categories = ['All', ...Object.keys(COLORS.categories)];

  // Filter habits by active category and search query
  const filteredHabits = habits.filter(h => {
    const matchesCategory = activeCategory === 'All' || h.category === activeCategory;
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (h.description && h.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Date Strip */}
        <DateStrip />

        {/* Daily Summary Progress Card */}
        <ProgressRing />

        {/* Search & Category Filter Section */}
        <View style={styles.filterSection}>
          <View style={[styles.searchBox, isDark ? styles.searchDark : styles.searchLight]}>
            <Text style={{ fontSize: 14 }}>🔍</Text>
            <TextInput
              style={[styles.searchInput, isDark ? styles.textDark : styles.textLight]}
              placeholder="Search habits..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={{ fontSize: 12, color: '#94A3B8' }}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Category Chips Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map(cat => {
              const isSelected = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catChip,
                    isSelected ? styles.catChipActive : isDark ? styles.catChipDark : styles.catChipLight
                  ]}
                  onPress={() => setActiveCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Habit List Header */}
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, isDark ? styles.textDark : styles.textLight]}>
            Daily Habits ({filteredHabits.length})
          </Text>

          <TouchableOpacity
            style={styles.addInlineBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.addInlineText}>+ Add Habit</Text>
          </TouchableOpacity>
        </View>

        {/* Habits List */}
        {filteredHabits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>🌱</Text>
            <Text style={[styles.emptyTitle, isDark ? styles.textDark : styles.textLight]}>
              No habits found
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try clearing your search filter' : 'Tap "+ Add Habit" below to create your first daily habit!'}
            </Text>
          </View>
        ) : (
          filteredHabits.map(habit => (
            <HabitCard key={habit.id} habit={habit} />
          ))
        )}

      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Habit Modal */}
      <AddHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
    paddingBottom: 90,
  },
  filterSection: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    marginBottom: 10,
  },
  searchDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  searchLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  categoryScroll: {
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  catChipDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  catChipLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  catChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  catChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  addInlineBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  addInlineText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '400',
    marginTop: -2,
  },
  textDark: { color: '#F8FAFC' },
  textLight: { color: '#0F172A' },
});
