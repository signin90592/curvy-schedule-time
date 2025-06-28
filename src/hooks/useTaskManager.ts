
import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: 'work' | 'personal';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('scheduleTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scheduleTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.date === date);
  };

  const getTasksByCategory = (category: 'work' | 'personal') => {
    return tasks.filter(task => task.category === category);
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksForDate,
    getTasksByCategory,
  };
};
