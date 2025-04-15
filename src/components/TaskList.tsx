'use client';

import { useState } from 'react';
import { api } from '@/utils/trpc-provider';

export default function TaskList() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const utils = api.useUtils();
  const { data: tasks, isLoading } = api.task.getAll.useQuery();

    const hello = api.task.getAll.useQuery();
    console.log("Hello result:", hello.data);
  
  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      setTitle('');
      setDescription('');
      utils.task.getAll.invalidate();
    },
  });
  
  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
    },
  });
  
  const toggleComplete = api.task.update.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTask.mutate({ title, description });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full p-2 border rounded"
          />
        </div>
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={createTask.isLoading}
        >
          {createTask.isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      <div className="space-y-4">
        {tasks?.map((task) => (
          <div key={task.id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <h3 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </h3>
              {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleComplete.mutate({ id: task.id, completed: !task.completed })}
                className="px-2 py-1 bg-green-500 text-white text-sm rounded"
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => deleteTask.mutate({ id: task.id })}
                className="px-2 py-1 bg-red-500 text-white text-sm rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}