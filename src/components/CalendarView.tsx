
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useTaskManager, Task } from '../hooks/useTaskManager';

interface CalendarViewProps {
  onAddTask: (date: string) => void;
  onTaskClick: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onAddTask, onTaskClick }) => {
  const { getTasksForDate } = useTaskManager();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const formatDateString = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, day).toISOString().split('T')[0];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        
        <h2 className="text-2xl font-bold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center text-white/70 font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-24"></div>;
          }

          const dateString = formatDateString(day);
          const tasksForDay = getTasksForDate(dateString);
          const isToday = new Date().toDateString() === new Date(dateString).toDateString();

          return (
            <div
              key={day}
              className={`h-24 bg-white/10 rounded-xl p-2 relative hover:bg-white/20 transition-colors cursor-pointer ${
                isToday ? 'ring-2 ring-white/50' : ''
              }`}
              onClick={() => onAddTask(dateString)}
            >
              <div className="text-white font-medium mb-1">{day}</div>
              
              {/* Task indicators */}
              <div className="space-y-1">
                {tasksForDay.slice(0, 2).map(task => (
                  <div
                    key={task.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick(task);
                    }}
                    className={`text-xs px-2 py-1 rounded-full text-white truncate cursor-pointer hover:scale-105 transition-transform ${
                      task.category === 'work' 
                        ? 'bg-blue-500/80' 
                        : 'bg-green-500/80'
                    }`}
                  >
                    {task.time} {task.title}
                  </div>
                ))}
                
                {tasksForDay.length > 2 && (
                  <div className="text-xs text-white/70 text-center">
                    +{tasksForDay.length - 2} more
                  </div>
                )}
              </div>

              {/* Add task button */}
              {tasksForDay.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Plus className="w-4 h-4 text-white/50" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
