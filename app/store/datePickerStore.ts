import { create } from 'zustand';
import { format, addDays, addWeeks, addMonths, addYears, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface DatePickerState {
  startDate: Date;
  endDate: Date | null;
  recurrenceType: string;
  recurrenceInterval: number;
  selectedDays: string[];
  previewDates: Date[];
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date | null) => void;
  setRecurrenceType: (type: string) => void;
  setRecurrenceInterval: (interval: number) => void;
  handleDaySelection: (day: string) => void;
  updatePreviewDates: () => void;
}

export const useDatePickerStore = create<DatePickerState>((set, get) => ({
  startDate: new Date(),
  endDate: null,
  recurrenceType: 'daily',
  recurrenceInterval: 1,
  selectedDays: [],
  previewDates: [],
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setRecurrenceType: (type) => set({ recurrenceType: type, selectedDays: [] }),
  setRecurrenceInterval: (interval) => set({ recurrenceInterval: interval }),
  handleDaySelection: (day) => set((state) => ({
    selectedDays: state.selectedDays.includes(day)
      ? state.selectedDays.filter(d => d !== day)
      : [...state.selectedDays, day]
  })),
  updatePreviewDates: () => {
    const { startDate, endDate, recurrenceType, recurrenceInterval, selectedDays } = get();
    let currentDate = new Date(startDate);
    const dates: Date[] = [];
    const maxDates = 10; // Limit to 10 preview dates

    while (dates.length < maxDates && (!endDate || currentDate <= endDate)) {
      if (recurrenceType === 'daily') {
        dates.push(new Date(currentDate));
        currentDate = addDays(currentDate, recurrenceInterval);
      } else if (recurrenceType === 'weekly') {
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        const daysThisWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
        const selectedDaysThisWeek = daysThisWeek.filter(day => selectedDays.includes(format(day, 'EEEE')));
        dates.push(...selectedDaysThisWeek.map(day => new Date(day)));
        currentDate = addWeeks(currentDate, recurrenceInterval);
      } else if (recurrenceType === 'monthly') {
        dates.push(new Date(currentDate));
        currentDate = addMonths(currentDate, recurrenceInterval);
      } else if (recurrenceType === 'yearly') {
        dates.push(new Date(currentDate));
        currentDate = addYears(currentDate, recurrenceInterval);
      }
    }

    set({ previewDates: dates });
  },
}));