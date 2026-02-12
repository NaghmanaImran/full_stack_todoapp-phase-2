'use client';

import { useState, useEffect } from 'react';
import { Task, apiClient } from '@/lib/api';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { Plus, User, SortAsc, Filter, RotateCcw } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sort, setSort] = useState<'created' | 'title'>('created');

  // Load tasks when component mounts or filter/sort changes
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await apiClient.getTasks(filter, sort);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter, sort]); // Dependencies are correct here

  const handleCreateOrUpdate = async (taskData: { title: string; description?: string }) => {
    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await apiClient.updateTask(editingTask.id, taskData);
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        setEditingTask(null);
      } else {
        // Create new task
        const newTask = await apiClient.createTask(taskData);
        setTasks([newTask, ...tasks]); // Add to the beginning of the list
      }
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save task:', error);
      // In a real app, you might want to show an error message to the user
    }
  };

  const handleDelete = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await apiClient.deleteTask(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
      } catch (error) {
        console.error('Failed to delete task:', error);
        // In a real app, you might want to show an error message to the user
      }
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = await apiClient.toggleTaskCompletion(task.id, !task.completed);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      // In a real app, you might want to show an error message to the user
    }
  };

  const filteredAndSortedTasks = [...tasks];

  // Apply sorting
  if (sort === 'title') {
    filteredAndSortedTasks.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Sort by creation date (newest first)
    filteredAndSortedTasks.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 mb-3">
            Task Manager
          </h1>
          <p className="text-lg text-blue-800 max-w-2xl mx-auto">
            Organize your work and boost productivity with our intuitive task management system
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-blue-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <span className="bg-blue-100 p-2 rounded-lg">
                  <Filter className="h-5 w-5 text-blue-600" />
                </span>
                My Tasks
              </h2>
              <p className="text-blue-700 mt-1">Manage your tasks efficiently</p>
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 bg-blue-100 rounded-lg p-1">
                <Filter className="h-4 w-4 text-blue-600 ml-2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
                  className="border-0 bg-transparent rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-blue-900"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-blue-100 rounded-lg p-1">
                <SortAsc className="h-4 w-4 text-blue-600 ml-2" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as 'created' | 'title')}
                  className="border-0 bg-transparent rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-blue-900"
                >
                  <option value="created">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>

              <Button
                onClick={() => {
                  setEditingTask(null);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white flex items-center gap-2 px-4 py-5"
              >
                <Plus className="h-4 w-4" /> Add Task
              </Button>

              <Button
                onClick={fetchTasks}
                variant="outline"
                className="flex items-center gap-2 border-blue-400 hover:bg-blue-100 text-blue-700 px-4 py-5"
              >
                <RotateCcw className="h-4 w-4" /> Refresh
              </Button>

              <Button
                onClick={() => window.location.href = '/auth'}
                variant="outline"
                className="flex items-center gap-2 border-blue-400 hover:bg-blue-100 text-blue-700 px-4 py-5"
              >
                <User className="h-4 w-4" /> Account
              </Button>
            </div>
          </div>
        </div>

        {showForm ? (
          <TaskForm
            task={editingTask}
            onSave={handleCreateOrUpdate}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        ) : (
          <div className="mb-8">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white w-full md:w-auto flex items-center justify-center gap-2 py-6 text-lg"
            >
              <Plus className="h-5 w-5" /> Create New Task
            </Button>
          </div>
        )}

        <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-200">
          <TaskList
            tasks={filteredAndSortedTasks}
            onEdit={(task) => {
              setEditingTask(task);
              setShowForm(true);
            }}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
            loading={loading}
            onRefresh={fetchTasks}
          />
        </div>
      </div>
    </div>
  );
}