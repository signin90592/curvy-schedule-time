
import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { Task } from '../hooks/useTaskManager';

interface TaskFormProps {
  task?: Task;
  selectedDate?: string;
  onSave: (task: Omit<Task, 'id'>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  task, 
  selectedDate, 
  onSave, 
  onDelete, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: selectedDate || new Date().toISOString().split('T')[0],
    time: '09:00',
    category: 'personal' as 'work' | 'personal',
    priority: 'medium' as 'low' | 'medium' | 'high',
    completed: false,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        date: task.date,
        time: task.time,
        category: task.category,
        priority: task.priority,
        completed: task.completed,
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave(formData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter task title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 h-24 resize-none"
              placeholder="Add description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'work' | 'personal' })}
                className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {task && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="completed"
                checked={formData.completed}
                onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                className="w-4 h-4 text-orange-400 rounded focus:ring-orange-400"
              />
              <label htmlFor="completed" className="text-sm text-gray-700">
                Mark as completed
              </label>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-orange-400 text-white py-3 rounded-2xl font-semibold hover:bg-orange-500 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{task ? 'Update' : 'Save'} Task</span>
            </button>
            
            {task && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white p-3 rounded-2xl hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
