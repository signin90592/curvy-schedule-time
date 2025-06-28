
import React, { useState } from 'react';
import { Calendar, List, Plus, Settings as SettingsIcon, Home, Filter, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useTaskManager, Task } from '../hooks/useTaskManager';
import { ThemeProvider } from '../contexts/ThemeContext';
import CalendarView from '../components/CalendarView';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Settings from '../components/Settings';

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask, getTasksForDate, getTasksByCategory } = useTaskManager();
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'tasks' | 'settings'>('dashboard');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'work' | 'personal' | 'pending' | 'completed'>('all');

  const handleAddTask = (date?: string) => {
    setSelectedDate(date || '');
    setSelectedTask(undefined);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateTask(id, { completed });
  };

  const getFilteredTasks = () => {
    switch (taskFilter) {
      case 'work':
        return getTasksByCategory('work');
      case 'personal':
        return getTasksByCategory('personal');
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  const getTodaysTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return getTasksForDate(today);
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate > today && !task.completed;
    }).slice(0, 5);
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back!</h1>
        <p className="text-muted-foreground text-lg">Here's your productivity overview</p>
      </div>

      {/* Progress Card */}
      <div className="glass-card rounded-3xl p-8 text-center animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <div className="text-6xl font-bold text-primary mb-2">{progress}%</div>
            <p className="text-muted-foreground">Tasks completed</p>
            <p className="text-sm text-muted-foreground">{completedTasks}/{totalTasks} Tasks</p>
          </div>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleAddTask()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Task</span>
            </button>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Keep going!</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-6 text-center animate-slide-up">
          <div className="text-2xl font-bold text-primary">{getTodaysTasks().length}</div>
          <div className="text-sm text-muted-foreground">Today</div>
        </div>
        <div className="glass-card rounded-2xl p-6 text-center animate-slide-up">
          <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="glass-card rounded-2xl p-6 text-center animate-slide-up">
          <div className="text-2xl font-bold text-purple-600">{getTasksByCategory('work').length}</div>
          <div className="text-sm text-muted-foreground">Work</div>
        </div>
        <div className="glass-card rounded-2xl p-6 text-center animate-slide-up">
          <div className="text-2xl font-bold text-orange-600">{getTasksByCategory('personal').length}</div>
          <div className="text-sm text-muted-foreground">Personal</div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-primary" />
          <span>Today's Schedule</span>
        </h2>
        {getTodaysTasks().length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tasks scheduled for today</p>
            <button
              onClick={() => handleAddTask(new Date().toISOString().split('T')[0])}
              className="mt-4 bg-primary/10 text-primary px-4 py-2 rounded-2xl hover:bg-primary/20 transition-colors"
            >
              Add Today's Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {getTodaysTasks().map(task => (
              <div
                key={task.id}
                onClick={() => handleEditTask(task)}
                className={`bg-card border border-border rounded-2xl p-4 cursor-pointer hover-lift ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(task.id, !task.completed);
                      }}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        task.completed ? 'bg-green-500 border-green-500' : 'border-muted-foreground hover:border-primary'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                    <div>
                      <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{task.time}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.category === 'work' 
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  }`}>
                    {task.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Tasks */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center space-x-3">
          <List className="w-6 h-6 text-primary" />
          <span>Upcoming Tasks</span>
        </h2>
        {getUpcomingTasks().length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No upcoming tasks</p>
        ) : (
          <div className="space-y-3">
            {getUpcomingTasks().map(task => (
              <div
                key={task.id}
                onClick={() => handleEditTask(task)}
                className="bg-card border border-border rounded-2xl p-4 cursor-pointer hover-lift"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(task.date).toLocaleDateString()} at {task.time}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.category === 'work' 
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  }`}>
                    {task.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'calendar':
        return (
          <CalendarView
            onAddTask={handleAddTask}
            onTaskClick={handleEditTask}
          />
        );
      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
                <p className="text-muted-foreground">Manage your tasks</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value as any)}
                  className="px-4 py-2 rounded-2xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                </select>
                <button
                  onClick={() => handleAddTask()}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl hover:opacity-90 transition-opacity flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
            <TaskList
              tasks={getFilteredTasks()}
              onTaskClick={handleEditTask}
              onToggleComplete={handleToggleComplete}
              title="Tasks"
            />
          </div>
        );
      case 'settings':
        return <Settings />;
      default:
        return renderDashboard();
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        {/* Mobile View */}
        <div className="lg:hidden">
          <div className="p-4 pb-24">
            {renderContent()}
          </div>
          
          {/* Modern Mobile Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border">
            <div className="flex items-center justify-around py-4 px-2">
              {[
                { id: 'dashboard', icon: Home, label: 'Home' },
                { id: 'calendar', icon: Calendar, label: 'Calendar' },
                { id: 'tasks', icon: List, label: 'Tasks' },
                { id: 'settings', icon: SettingsIcon, label: 'Settings' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setCurrentView(id as any)}
                  className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-2xl transition-all duration-200 ${
                    currentView === id 
                      ? 'bg-primary text-primary-foreground transform scale-105' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex min-h-screen">
          {/* Modern Sidebar */}
          <div className="w-80 bg-card/50 backdrop-blur-xl border-r border-border p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">TaskFlow</h1>
              <p className="text-muted-foreground">Organize your life</p>
            </div>
            
            <nav className="space-y-2">
              {[
                { id: 'dashboard', icon: Home, label: 'Dashboard' },
                { id: 'calendar', icon: Calendar, label: 'Calendar' },
                { id: 'tasks', icon: List, label: 'All Tasks' },
                { id: 'settings', icon: SettingsIcon, label: 'Settings' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setCurrentView(id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl transition-all duration-200 font-medium ${
                    currentView === id 
                      ? 'bg-primary text-primary-foreground shadow-lg transform scale-105' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 overflow-auto">
            <div className="max-w-6xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            task={selectedTask}
            selectedDate={selectedDate}
            onSave={handleSaveTask}
            onDelete={deleteTask}
            onClose={() => {
              setShowTaskForm(false);
              setSelectedTask(undefined);
              setSelectedDate('');
            }}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
