'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Task } from '@/models/task.model';

// Type for the form's state, matching your request
type NewTask = {
  title: string;
  energy_level: 'low' | 'medium' | 'high';
  due_date: string;
};

interface NewTaskFormProps {
  onTasksCreated: (newTasks: Task[]) => void;
}

export default function NewTaskForm({ onTasksCreated }: NewTaskFormProps) {
  const [tasks, setTasks] = useState<NewTask[]>([
    { title: '', energy_level: 'low', due_date: '' },
  ]);

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newTasks = [...tasks];
    const { name, value } = event.target;
    (newTasks[index] as any)[name] = value;
    setTasks(newTasks);
  };

  const addTaskRow = () => {
    setTasks([...tasks, { title: '', energy_level: 'low', due_date: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tasksToSubmit = tasks
      .filter(task => task.title.trim() !== '')
      .map(task => ({
        ...task,
        due_date: task.due_date || null, // Send null if date is empty
      }));

    if (tasksToSubmit.length === 0) return;

    try {
      const response = await api.post('/tasks/bulk', tasksToSubmit);
      onTasksCreated(response.data);
      setTasks([{ title: '', energy_level: 'low', due_date: '' }]); // Reset form
    } catch (error) {
      console.error("Failed to create tasks", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border border-gray-700 rounded-lg space-y-4">
      {tasks.map((task, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
          {/* Title Input */}
          <div className="md:col-span-2">
            <label className="text-xs text-gray-400">Task Title</label>
            <input
              type="text" name="title" value={task.title}
              onChange={(e) => handleInputChange(index, e)}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
            />
          </div>
          {/* Energy Select */}
          <div>
            <label className="text-xs text-gray-400">Energy</label>
            <select
              name="energy_level" value={task.energy_level}
              onChange={(e) => handleInputChange(index, e)}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          {/* Deadline Input */}
          <div>
            <label className="text-xs text-gray-400">Deadline</label>
            <input
              type="datetime-local" name="due_date" value={task.due_date}
              onChange={(e) => handleInputChange(index, e)}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
            />
          </div>
        </div>
      ))}
      <div className="flex justify-between pt-2 border-t border-gray-700">
        <button
          type="button"
          onClick={addTaskRow}
          className="px-4 py-2 font-semibold text-blue-400 rounded-md hover:bg-gray-700"
        >
          + Add Another
        </button>
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Submit All
        </button>
      </div>
    </form>
  );
}