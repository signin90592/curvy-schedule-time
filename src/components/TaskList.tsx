
import React from 'react';
import { Clock, User, Briefcase, CheckCircle, Star, AlertCircle } from 'lucide-react';
import { Task } from '../hooks/useTaskManager';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  title: string;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onTaskClick, 
  onToggleComplete, 
  title 
}) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/60">No tasks found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(task.id, !task.completed);
                    }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  
                  <div>
                    <h3 className={`font-semibold text-lg ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  {getPriorityIcon(task.priority)}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                    task.category === 'work' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {task.category === 'work' ? <Briefcase className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    <span className="capitalize">{task.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(task.time)}</span>
                  </span>
                  <span>{formatDate(task.date)}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.priority} priority
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
