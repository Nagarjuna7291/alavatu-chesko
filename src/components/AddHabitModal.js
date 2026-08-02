import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useHabits } from '../context/HabitContext';
import { COLORS, FREQUENCIES, TIMES_OF_DAY } from '../constants/theme';

export const AddHabitModal = ({ visible, onClose }) => {
  const { addHabit, themeMode } = useHabits();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Health');
  const [timeOfDay, setTimeOfDay] = useState('Anytime');
  const [targetValue, setTargetValue] = useState('1 time');
  const [markCompletedToday, setMarkCompletedToday] = useState(false);

  const isDark = themeMode === 'dark';

  const categoriesList = Object.keys(COLORS.categories);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const selectedCatConfig = COLORS.categories[category] || COLORS.categories.Custom;

    addHabit({
      title: title.trim(),
      description: description.trim(),
      category,
      timeOfDay,
      targetValue,
      color: selectedCatConfig.color,
      markCompletedToday
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('Health');
    setTimeOfDay('Anytime');
    setTargetValue('1 time');
    setMarkCompletedToday(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark ? styles.modalDark : styles.modalLight]}>
          
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.modalTitle, isDark ? styles.textDark : styles.textLight]}>
                ✨ Create New Habit
              </Text>
              <Text style={styles.modalSubtitle}>Build a positive daily routine</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Habit Title */}
            <Text style={styles.label}>Habit Name *</Text>
            <TextInput
              style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
              placeholder="e.g. Read 15 mins, Drink Water"
              placeholderTextColor="#64748B"
              value={title}
              onChangeText={setTitle}
            />

            {/* Description */}
            <Text style={styles.label}>Motivation / Note (Optional)</Text>
            <TextInput
              style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
              placeholder="e.g. For better focus and memory"
              placeholderTextColor="#64748B"
              value={description}
              onChangeText={setDescription}
            />

            {/* Category Selector */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.chipsContainer}>
              {categoriesList.map(cat => {
                const catInfo = COLORS.categories[cat];
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chip,
                      isSelected ? { backgroundColor: catInfo.color } : isDark ? styles.chipDark : styles.chipLight
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.chipText, isSelected && { color: '#FFFFFF', fontWeight: '700' }]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Time of Day */}
            <Text style={styles.label}>Time of Day</Text>
            <View style={styles.chipsContainer}>
              {TIMES_OF_DAY.map(time => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.chip,
                    timeOfDay === time ? styles.chipActive : isDark ? styles.chipDark : styles.chipLight
                  ]}
                  onPress={() => setTimeOfDay(time)}
                >
                  <Text style={[styles.chipText, timeOfDay === time && styles.chipTextActive]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Daily Target */}
            <Text style={styles.label}>Daily Target Goal</Text>
            <TextInput
              style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
              placeholder="e.g. 1 time, 20 mins, 2 Liters"
              placeholderTextColor="#64748B"
              value={targetValue}
              onChangeText={setTargetValue}
            />

            {/* Mark completed today toggle */}
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setMarkCompletedToday(!markCompletedToday)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkboxSmall, markCompletedToday && styles.checkboxSmallActive]}>
                {markCompletedToday && <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '900' }}>✓</Text>}
              </View>
              <Text style={[styles.toggleLabel, isDark ? styles.textDark : styles.textLight]}>
                Already completed for today!
              </Text>
            </TouchableOpacity>

          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, !title.trim() && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={!title.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>+ Add Habit</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalDark: {
    backgroundColor: '#0F172A',
  },
  modalLight: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: '#94A3B8',
    fontWeight: '700',
  },
  formScroll: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  inputDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    color: '#F8FAFC',
  },
  inputLight: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    color: '#0F172A',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  chipLight: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
  },
  checkboxSmall: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSmallActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  textDark: { color: '#F8FAFC' },
  textLight: { color: '#0F172A' },
});
