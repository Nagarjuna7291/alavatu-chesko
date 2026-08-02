// Date utility functions for Alavatu Chesko habit tracking

export const getTodayKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getFormattedHeaderDate = (dateObj = new Date()) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  return dateObj.toLocaleDateString('en-US', options);
};

export const getWeekDays = (selectedDate = new Date()) => {
  const days = [];
  const curr = new Date(selectedDate);
  const dayOfWeek = curr.getDay(); // 0 is Sunday
  
  // Get 3 days before and 3 days after for smooth horizontal strip
  for (let i = -3; i <= 3; i++) {
    const d = new Date(curr);
    d.setDate(curr.getDate() + i);
    
    days.push({
      dateObj: d,
      dateKey: formatDateKey(d),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday: formatDateKey(d) === getTodayKey()
    });
  }
  
  return days;
};

export const calculateStreak = (completionLogs = {}) => {
  let streak = 0;
  const today = new Date();
  let checkDate = new Date(today);

  // Check today first
  let key = formatDateKey(checkDate);
  if (completionLogs[key]) {
    streak++;
  } else {
    // If not checked today, check yesterday to keep active streak
    checkDate.setDate(checkDate.getDate() - 1);
    key = formatDateKey(checkDate);
    if (!completionLogs[key]) {
      return 0;
    }
  }

  // Count backwards consecutive days
  while (true) {
    checkDate.setDate(checkDate.getDate() - 1);
    key = formatDateKey(checkDate);
    if (completionLogs[key]) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const getLast30Days = () => {
  const dates = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push({
      dateObj: d,
      dateKey: formatDateKey(d),
      dayNumber: d.getDate(),
      monthShort: d.toLocaleDateString('en-US', { month: 'short' }),
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' })
    });
  }
  return dates;
};
