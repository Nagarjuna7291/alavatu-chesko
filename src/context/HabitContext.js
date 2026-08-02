import React, { createContext, useState, useEffect, useContext } from 'react';
import { getTodayKey, formatDateKey, calculateStreak } from '../utils/dateUtils';
import { saveHabitsToStorage, loadHabitsFromStorage, saveLogsToStorage, loadLogsFromStorage } from '../utils/storage';

const INITIAL_HABITS = [
  {
    id: 'h1',
    title: 'Drink 2.5L Water',
    description: 'Stay hydrated throughout the day',
    category: 'Health',
    timeOfDay: 'Anytime',
    targetValue: '2.5 Liters',
    icon: 'droplet',
    color: '#10B981',
    createdAt: '2026-07-01'
  },
  {
    id: 'h2',
    title: 'Morning Yoga & Stretch',
    description: '15 mins mindfulness & posture flexibility',
    category: 'Mindfulness',
    timeOfDay: 'Morning',
    targetValue: '15 Mins',
    icon: 'sun',
    color: '#8B5CF6',
    createdAt: '2026-07-01'
  },
  {
    id: 'h3',
    title: 'Read 20 Pages',
    description: 'Read self-growth or tech book',
    category: 'Learning',
    timeOfDay: 'Evening',
    targetValue: '20 Pages',
    icon: 'book-open',
    color: '#EC4899',
    createdAt: '2026-07-01'
  },
  {
    id: 'h4',
    title: '30-Min Evening Workout',
    description: 'Cardio, strength, or brisk outdoor walk',
    category: 'Fitness',
    timeOfDay: 'Evening',
    targetValue: '30 Mins',
    icon: 'activity',
    color: '#F59E0B',
    createdAt: '2026-07-01'
  },
  {
    id: 'h5',
    title: 'Deep Focus Coding',
    description: 'Build projects without distractions',
    category: 'Productivity',
    timeOfDay: 'Afternoon',
    targetValue: '90 Mins',
    icon: 'code',
    color: '#3B82F6',
    createdAt: '2026-07-01'
  }
];

// Seed initial completion logs for realistic initial streaks & analytics
const generateSeedLogs = () => {
  const logs = {};
  const today = new Date();
  
  // Past 14 days mock completions for starter habits
  INITIAL_HABITS.forEach(habit => {
    logs[habit.id] = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = formatDateKey(d);
      
      // Random high completion for realistic demonstration (80% completion rate)
      const isCompleted = i === 0 ? true : (i % 5 !== 3);
      if (isCompleted) {
        logs[habit.id][dateKey] = true;
      }
    }
  });
  return logs;
};

const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [selectedDateKey, setSelectedDateKey] = useState(getTodayKey());
  const [selectedDateObj, setSelectedDateObj] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [themeMode, setThemeMode] = useState('dark');

  // Load initial habits & logs from storage or seed defaults
  useEffect(() => {
    const initData = async () => {
      let savedHabits = await loadHabitsFromStorage();
      let savedLogs = await loadLogsFromStorage();

      if (!savedHabits || savedHabits.length === 0) {
        savedHabits = INITIAL_HABITS;
        await saveHabitsToStorage(savedHabits);
      }

      if (!savedLogs || Object.keys(savedLogs).length === 0) {
        savedLogs = generateSeedLogs();
        await saveLogsToStorage(savedLogs);
      }

      setHabits(savedHabits);
      setLogs(savedLogs);
      setIsLoading(false);
    };

    initData();
  }, []);

  // Save changes to storage whenever habits or logs change
  useEffect(() => {
    if (!isLoading) {
      saveHabitsToStorage(habits);
      saveLogsToStorage(logs);
    }
  }, [habits, logs, isLoading]);

  // Select Date
  const handleSelectDate = (dateObj) => {
    setSelectedDateObj(dateObj);
    setSelectedDateKey(formatDateKey(dateObj));
  };

  // Toggle habit completion on selected date
  const toggleHabitCompletion = (habitId, dateKey = selectedDateKey) => {
    setLogs(prevLogs => {
      const habitLogs = prevLogs[habitId] || {};
      const newHabitLogs = { ...habitLogs };
      
      if (newHabitLogs[dateKey]) {
        delete newHabitLogs[dateKey];
      } else {
        newHabitLogs[dateKey] = true;
      }

      return {
        ...prevLogs,
        [habitId]: newHabitLogs
      };
    });
  };

  // Add new habit
  const addHabit = (newHabitData) => {
    const newHabit = {
      id: 'h_' + Date.now(),
      title: newHabitData.title,
      description: newHabitData.description || '',
      category: newHabitData.category || 'Health',
      timeOfDay: newHabitData.timeOfDay || 'Anytime',
      targetValue: newHabitData.targetValue || '1 time',
      color: newHabitData.color || '#10B981',
      icon: newHabitData.icon || 'star',
      createdAt: getTodayKey()
    };

    setHabits(prev => [newHabit, ...prev]);

    // Automatically mark completed for today if requested
    if (newHabitData.markCompletedToday) {
      toggleHabitCompletion(newHabit.id, getTodayKey());
    }
  };

  // Delete habit
  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setLogs(prev => {
      const copy = { ...prev };
      delete copy[habitId];
      return copy;
    });
  };

  // Calculate habit streak
  const getHabitStreak = (habitId) => {
    const habitLogs = logs[habitId] || {};
    return calculateStreak(habitLogs);
  };

  // Check if habit is completed for given date key
  const isHabitCompleted = (habitId, dateKey = selectedDateKey) => {
    return !!(logs[habitId] && logs[habitId][dateKey]);
  };

  // Stats calculation
  const getDailyProgressStats = (dateKey = selectedDateKey) => {
    if (habits.length === 0) return { total: 0, completed: 0, percentage: 0 };
    const completedCount = habits.filter(h => isHabitCompleted(h.id, dateKey)).length;
    const percentage = Math.round((completedCount / habits.length) * 100);
    return {
      total: habits.length,
      completed: completedCount,
      percentage
    };
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        logs,
        selectedDateKey,
        selectedDateObj,
        isLoading,
        activeCategory,
        themeMode,
        setActiveCategory,
        setThemeMode,
        handleSelectDate,
        toggleHabitCompletion,
        addHabit,
        deleteHabit,
        getHabitStreak,
        isHabitCompleted,
        getDailyProgressStats
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => useContext(HabitContext);
