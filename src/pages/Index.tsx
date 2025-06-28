
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Settings, CheckCircle, Clock, Star } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  time: string;
  completed: boolean;
  urgent?: boolean;
  category: string;
  teamMembers?: string[];
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Team meeting", time: "10:00AM", completed: false, category: "Work", teamMembers: ["Charlie", "Alex", "Sam"] },
    { id: 2, title: "Finish a project", time: "12:00AM", completed: false, urgent: true, category: "Work" },
    { id: 3, title: "Interview", time: "14:00PM", completed: false, category: "Work" },
    { id: 4, title: "Design review", time: "16:00PM", completed: true, category: "Design" },
  ]);

  const [currentView, setCurrentView] = useState('tasks');
  const [progress, setProgress] = useState(78);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle,
        time: "09:00AM",
        completed: false,
        category: "Personal"
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setShowAddTask(false);
    }
  };

  useEffect(() => {
    const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setProgress(newProgress);
  }, [completedTasks, totalTasks]);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-300">
      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="p-6 pt-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">My daily</h1>
                <h1 className="text-3xl font-bold text-white">tasks 📝</h1>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Date */}
          <p className="text-white/80 mb-2">Today,</p>
          <p className="text-white/80 mb-6">{getCurrentDate()}</p>

          {/* Progress Card */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/80">Hi, Charlie!</span>
              <div className="w-12 h-2 bg-white/30 rounded-full">
                <div className="h-full bg-white rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className="text-5xl font-bold text-white mb-2">{progress}%</div>
            <p className="text-white/80 text-sm">Your goals is almost met.</p>
            <p className="text-white/60 text-xs">{completedTasks}/{totalTasks} Tasks</p>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 transition-all duration-300 hover:scale-105 ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        task.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-orange-400'
                      }`}
                    >
                      {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </button>
                    <div>
                      <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600">{task.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.urgent && <Star className="w-4 h-4 text-red-500" />}
                    <span className="text-sm font-medium text-gray-700">{task.time}</span>
                  </div>
                </div>
                {task.teamMembers && (
                  <div className="flex items-center mt-3 space-x-2">
                    <span className="text-xs text-gray-600">Complete with mates</span>
                    <div className="flex -space-x-2">
                      {task.teamMembers.map((member, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center text-xs text-white font-semibold border-2 border-white"
                        >
                          {member[0]}
                        </div>
                      ))}
                      <button className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 border-2 border-white">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setShowAddTask(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-200"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Panel - Main Dashboard */}
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">My daily tasks</h1>
                <p className="text-white/80">Today, {getCurrentDate()}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-3xl">👨‍💼</span>
                </div>
                <div className="flex space-x-3">
                  <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                    <Settings className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-8 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-6">
                <span className="text-white/80 text-lg">Hi, Charlie!</span>
                <div className="w-20 h-3 bg-white/30 rounded-full">
                  <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
              <div className="text-7xl font-bold text-white mb-4">{progress}%</div>
              <p className="text-white/80 text-lg">Your goals is almost met.</p>
              <p className="text-white/60">{completedTasks}/{totalTasks} Tasks completed</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <Clock className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{tasks.filter(t => !t.completed).length}</div>
                <div className="text-white/70">Pending</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <CheckCircle className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{completedTasks}</div>
                <div className="text-white/70">Completed</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <Users className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-white/70">Team Tasks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Task List */}
        <div className="w-96 bg-white/10 backdrop-blur-sm border-l border-white/20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Today's Tasks</h2>
              <button
                onClick={() => setShowAddTask(true)}
                className="bg-black text-white px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform"
              >
                Add task +
              </button>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 transition-all duration-300 hover:scale-105 ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        task.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-orange-400'
                      }`}
                    >
                      {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex items-center space-x-2">
                      {task.urgent && <Star className="w-4 h-4 text-red-500" />}
                      <span className="text-sm font-medium text-gray-700">{task.time}</span>
                    </div>
                  </div>
                  <h3 className={`font-semibold mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{task.category}</p>
                  {task.teamMembers && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Team:</span>
                      <div className="flex -space-x-1">
                        {task.teamMembers.map((member, index) => (
                          <div
                            key={index}
                            className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center text-xs text-white font-semibold border border-white"
                          >
                            {member[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
            <input
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-2xl mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={addTask}
                className="flex-1 bg-orange-400 text-white py-3 rounded-2xl font-semibold hover:bg-orange-500 transition-colors"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
