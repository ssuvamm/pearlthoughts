"use client"
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDatePickerStore } from '@/app/store/datePickerStore';

const RecurringDatePicker = () => {
  const {
    startDate,
    endDate,
    recurrenceType,
    recurrenceInterval,
    selectedDays,
    previewDates,
    setStartDate,
    setEndDate,
    setRecurrenceType,
    setRecurrenceInterval,
    handleDaySelection,
    updatePreviewDates
  } = useDatePickerStore();

  const handleRecurrenceTypeChange = (value: string) => {
    setRecurrenceType(value);
    updatePreviewDates();
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Calendar className="mr-2" /> Recurring Date Picker
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <Input
            type="date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(e) => {
              setStartDate(new Date(e.target.value));
              updatePreviewDates();
            }}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
          <Input
            type="date"
            value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              const newDate = e.target.value ? new Date(e.target.value) : null;
              setEndDate(newDate);
              updatePreviewDates();
            }}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recurrence Type</label>
          <Select onValueChange={handleRecurrenceTypeChange} value={recurrenceType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select recurrence type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recurrence Interval</label>
          <Input
            type="number"
            min="1"
            value={recurrenceInterval}
            onChange={(e) => {
              setRecurrenceInterval(parseInt(e.target.value));
              updatePreviewDates();
            }}
            className="mt-1"
          />
        </div>

        {recurrenceType === 'weekly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Days</label>
            <div className="flex flex-wrap gap-2">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <Button
                  key={day}
                  onClick={() => {
                    handleDaySelection(day);
                    updatePreviewDates();
                  }}
                  variant={selectedDays.includes(day) ? 'default' : 'outline'}
                  className="px-2 py-1 text-sm"
                >
                  {day.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <div className="bg-gray-100 p-2 rounded">
            {previewDates.map((date, index) => (
              <div key={index} className="text-sm">{format(date, 'MMMM d, yyyy')}</div>
            ))}
          </div>
        </div>

        <Button onClick={updatePreviewDates} className="w-full">
          Update Preview
        </Button>
      </div>
    </div>
  );
};

export default RecurringDatePicker;