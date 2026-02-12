import { Task } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ReloadIcon } from '@radix-ui/react-icons';
import { CheckCircle2, Circle, SquarePen, Trash2, Calendar, Flag, RotateCcw } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (task: Task) => void;
  loading?: boolean;
  onRefresh?: () => void;
}

export default function TaskList({ tasks, onEdit, onDelete, onToggleComplete, loading = false, onRefresh }: TaskListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 border-transparent rounded-full animate-spin"></div>
        </div>
        <span className="text-xl font-semibold text-gray-700 mt-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Loading your tasks...
        </span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-8">
          <div className="text-4xl">📝</div>
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-4">No tasks yet</h3>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          Get started by creating your first task. You'll be productive in no time!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => onEdit(null as any)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-lg"
          >
            Create Your First Task
          </Button>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100 px-8 py-4 rounded-xl shadow-md transition-all duration-300 text-lg"
            >
              <RotateCcw className="h-5 w-5 mr-2" /> Refresh
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={`rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${
            task.completed
              ? 'bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 shadow-md'
              : task.priority === 'high'
                ? 'bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-l-red-500 shadow-md'
                : task.priority === 'medium'
                  ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-l-yellow-500 shadow-md'
                  : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-l-blue-500 shadow-md'
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <button
                onClick={() => onToggleComplete(task)}
                className={`mt-1 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                  task.completed
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white ring-2 ring-green-300'
                    : 'border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <div className="flex-1">
                <h3 className={`font-bold text-xl mb-2 ${
                  task.completed
                    ? 'line-through text-gray-500'
                    : task.priority === 'high'
                      ? 'text-red-600'
                      : task.priority === 'medium'
                        ? 'text-amber-600'
                        : 'text-gray-800'
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-600 mb-4">{task.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
                    task.completed
                      ? 'bg-green-100 text-green-800'
                      : task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                  }`}>
                    {task.priority === 'high' ? <Flag className="h-3 w-3" /> :
                     task.priority === 'medium' ? <Flag className="h-3 w-3" /> :
                     task.completed ? <CheckCircle2 className="h-3 w-3" /> :
                     <Circle className="h-3 w-3" />}
                    {task.completed ? 'Completed' : task.priority ? `${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}` : 'Pending'}
                  </div>
                  <div className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    <Calendar className="h-3 w-3" />
                    {new Date(task.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between bg-white/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(task)}
              disabled={task.completed}
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-colors"
            >
              <SquarePen className="h-4 w-4" /> Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}