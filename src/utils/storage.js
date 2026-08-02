import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@alavatu_chesko_habits_v1';
const LOGS_KEY = '@alavatu_chesko_logs_v1';

export const saveHabitsToStorage = async (habits) => {
  try {
    const jsonValue = JSON.stringify(habits);
    await AsyncStorage.setItem(HABITS_KEY, jsonValue);
  } catch (e) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    }
  }
};

export const loadHabitsFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(HABITS_KEY);
    if (jsonValue != null) return JSON.parse(jsonValue);
  } catch (e) {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(HABITS_KEY);
      if (val) return JSON.parse(val);
    }
  }
  return null;
};

export const saveLogsToStorage = async (logs) => {
  try {
    const jsonValue = JSON.stringify(logs);
    await AsyncStorage.setItem(LOGS_KEY, jsonValue);
  } catch (e) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    }
  }
};

export const loadLogsFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(LOGS_KEY);
    if (jsonValue != null) return JSON.parse(jsonValue);
  } catch (e) {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(LOGS_KEY);
      if (val) return JSON.parse(val);
    }
  }
  return null;
};
