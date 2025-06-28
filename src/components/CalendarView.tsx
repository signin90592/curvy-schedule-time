
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Circle } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Calendar</h1>
        <p className="text-muted-foreground">Manage your schedule</p>
      </div>

      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-3 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-3 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center text-muted-foreground font-medium py-3">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="aspect-square"></div>;
            }

            const dateString = formatDateString(day);
            const tasksForDay = getTasksForDate(dateString);
            const isToday = new Date().toDateString() === new Date(dateString).toDateString();

            return (
              <div
                key={day}
                className={`calendar-day ${isToday ? 'today' : ''} ${tasksForDay.length > 0 ? 'has-tasks' : 'bg-card hover:bg-muted'}`}
                onClick={() => onAddTask(dateString)}
              >
                <div className={`font-semibold mb-2 ${tasksForDay.length > 0 ? 'text-white' : 'text-foreground'}`}>
                  {day}
                </div>
                
                {/* Task indicators */}
                <div className="flex-1 space-y-1">
                  {tasksForDay.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                      className="flex items-center space-x-1 cursor-pointer group"
                    >
                      <Circle className={`w-2 h-2 ${task.category === 'work' ? 'text-blue-300' : 'text-green-300'} ${tasksForDay.length > 0 ? 'fill-current' : ''}`} />
                      <span className={`text-xs truncate ${tasksForDay.length > 0 ? 'text-white/90' : 'text-muted-foreground'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                  
                  {tasksForDay.length > 3 && (
                    <div className={`text-xs ${tasksForDay.length > 0 ? 'text-white/70' : 'text-muted-foreground'}`}>
                      +{tasksForDay.length - 3} more
                    </div>
                  )}
                </div>

                {/* Add task button */}
                {tasksForDay.length === 0 && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
