'use client';

import { useState, useEffect } from 'react';
import { Task } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PlusCircle, Save, X, AlertCircle, Edit3 } from 'lucide-react';

interface TaskFormProps {
  task?: Task | null;
  onSave: (taskData: { title: string; description?: string }) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Populate form when editing an existing task
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setError('');
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setError('');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim() || undefined
    });

    // Clear error after successful submission
    setError('');
  };

  return (
    <Card className="mb-8 shadow-2xl rounded-2xl border-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className={`p-4 rounded-t-2xl ${
        task
          ? 'bg-gradient-to-r from-amber-500 to-orange-600'
          : 'bg-gradient-to-r from-emerald-500 to-teal-600'
      }`}>
        <CardHeader className="p-0 text-white">
          <div className="flex items-center gap-3">
            {task ? <Edit3 className="h-6 w-6" /> : <PlusCircle className="h-6 w-6" />}
            <div>
              <CardTitle className="text-xl font-bold">
                {task ? 'Edit Task' : 'Create New Task'}
              </CardTitle>
              <CardDescription className="text-indigo-100 mt-1">
                {task
                  ? 'Update the details of your task'
                  : 'Add a new task to your list'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </div>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-100 text-red-700 rounded-lg border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-gray-700 mb-1">
              Task Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              minLength={3}
              maxLength={200}
              className={`py-2 px-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all shadow-sm ${
                error ? 'border-red-500' : 'border-gray-200'
              }`}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              maxLength={1000}
              rows={3}
              className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all p-2 shadow-sm text-sm"
            />
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-gray-50/50 rounded-b-2xl flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200/50">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-4 py-2 text-sm border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all flex items-center gap-1 rounded-lg"
          >
            <X className="h-3 w-3" /> Cancel
          </Button>
          <Button
            type="submit"
            className={`px-4 py-2 text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1 ${
              task
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
            } text-white`}
          >
            {task ? <><Save className="h-3 w-3" /> Update</> : <><PlusCircle className="h-3 w-3" /> Create</>}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}