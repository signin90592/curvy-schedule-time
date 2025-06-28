
import React, { useState } from 'react';
import { Calendar, List, Plus, Settings, Home, Filter } from 'lucide-react';
import { useTaskManager, Task } from '../hooks/useTaskManager';
import CalendarView from '../components/CalendarView';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

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
      <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
            <p className="text-white/80">Here's your schedule overview</p>
          </div>
          <button
            onClick={() => handleAddTask()}
            className="bg-black text-white px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition-transform flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>
        
        <div className="text-6xl font-bold text-white mb-2">{progress}%</div>
        <p className="text-white/80">Tasks completed today</p>
        <p className="text-white/60 text-sm">{completedTasks}/{totalTasks} Tasks</p>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Today's Schedule</h2>
        {getTodaysTasks().length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/60">No tasks scheduled for today</p>
            <button
              onClick={() => handleAddTask(new Date().toISOString().split('T')[0])}
              className="mt-4 bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors"
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
                className={`bg-white/90 rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform ${
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
                      className={`w-5 h-5 rounded-full border-2 ${
                        task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}
                    />
                    <div>
                      <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600">{task.time}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.category === 'work' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
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
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Upcoming Tasks</h2>
        {getUpcomingTasks().length === 0 ? (
          <p className="text-white/60 text-center py-8">No upcoming tasks</p>
        ) : (
          <div className="space-y-3">
            {getUpcomingTasks().map(task => (
              <div
                key={task.id}
                onClick={() => handleEditTask(task)}
                className="bg-white/90 rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(task.date).toLocaleDateString()} at {task.time}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.category === 'work' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
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
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">All Tasks</h1>
              <div className="flex items-center space-x-4">
                <select
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value as any)}
                  className="px-4 py-2 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                </select>
                <button
                  onClick={() => handleAddTask()}
                  className="bg-black text-white px-4 py-2 rounded-xl hover:scale-105 transition-transform flex items-center space-x-2"
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
        return (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-2">Statistics</h3>
                <div className="grid grid-cols-2 gap-4 text-white/80">
                  <div>Total Tasks: {totalTasks}</div>
                  <div>Completed: {completedTasks}</div>
                  <div>Work Tasks: {getTasksByCategory('work').length}</div>
                  <div>Personal Tasks: {getTasksByCategory('personal').length}</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-300">
      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="p-4 pt-12">
          {renderContent()}
        </div>
        
        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20">
          <div className="flex items-center justify-around py-3">
            {[
              { id: 'dashboard', icon: Home, label: 'Home' },
              { id: 'calendar', icon: Calendar, label: 'Calendar' },
              { id: 'tasks', icon: List, label: 'Tasks' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id as any)}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors ${
                  currentView === id ? 'bg-orange-400 text-white' : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white/10 backdrop-blur-sm border-r border-white/20 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Schedule App</h1>
            <p className="text-white/70 text-sm">Manage your time</p>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: Home, label: 'Dashboard' },
              { id: 'calendar', icon: Calendar, label: 'Calendar' },
              { id: 'tasks', icon: List, label: 'All Tasks' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-colors ${
                  currentView === id 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
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
  );
};

export default Index;
