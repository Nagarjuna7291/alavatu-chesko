import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { HabitProvider, useHabits } from './src/context/HabitContext';
import { Header } from './src/components/Header';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';

const MainApp = () => {
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const { themeMode } = useHabits();
  const isDark = themeMode === 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0F172A' : '#FFFFFF'} />
      <View style={styles.container}>
        {/* Header */}
        <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* Tab Body View */}
        <View style={{ flex: 1 }}>
          {currentTab === 'Dashboard' ? (
            <DashboardScreen />
          ) : (
            <AnalyticsScreen />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <HabitProvider>
      <MainApp />
    </HabitProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  bgDark: { backgroundColor: '#0F172A' },
  bgLight: { backgroundColor: '#F8FAFC' },
});
