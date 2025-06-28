
import React from 'react';
import { Moon, Sun, Users, Bell, Shield, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTaskManager } from '../hooks/useTaskManager';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { tasks, getTasksByCategory } = useTaskManager();

  const completedTasks = tasks.filter(task => task.completed).length;
  const workTasks = getTasksByCategory('work').length;
  const personalTasks = getTasksByCategory('personal').length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      {/* Theme Toggle */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {theme === 'light' ? (
              <Sun className="w-6 h-6 text-primary" />
            ) : (
              <Moon className="w-6 h-6 text-primary" />
            )}
            <div>
              <h3 className="font-semibold text-foreground">Theme</h3>
              <p className="text-sm text-muted-foreground">
                {theme === 'light' ? 'Light mode' : 'Dark mode'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl hover:opacity-90 transition-opacity"
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="w-6 h-6 text-primary" />
          <h3 className="font-semibold text-foreground">Statistics</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{tasks.length}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{workTasks}</div>
            <div className="text-sm text-muted-foreground">Work Tasks</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{personalTasks}</div>
            <div className="text-sm text-muted-foreground">Personal</div>
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="space-y-4">
        <div className="glass-card rounded-3xl p-4 animate-slide-up">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground">Notifications</span>
          </div>
        </div>
        <div className="glass-card rounded-3xl p-4 animate-slide-up">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground">Privacy</span>
          </div>
        </div>
        <div className="glass-card rounded-3xl p-4 animate-slide-up">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground">About</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
