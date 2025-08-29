'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Task } from '@/models/task.model';
import NewTaskForm from './NewTaskForm';
import TaskList from './TaskList';

export default function Dashboard() {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [suggestedTask, setSuggestedTask] = useState<Task | null>(null); // State for the suggested task
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch both the suggested task and the full list
    const fetchAllData = async () => {
      try {
        const [suggestedRes, allTasksRes] = await Promise.all([
          api.get('/tasks/suggested'),
          api.get('/tasks'),
        ]);
        setSuggestedTask(suggestedRes.data);
        setTasks(allTasksRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchAllData();
  }, []);

  const handleTasksCreated = (newTasks: Task[]) => {
  setTasks(prevTasks => [...newTasks, ...prevTasks]);
};


  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      // Filter out the deleted task for an instant UI update
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      // Find and replace the updated task in the state
      setTasks(tasks.map(task => (task.id === taskId ? response.data : task)));
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-4xl p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">ADHD Vroom</h1>
          <button onClick={() => setIsModalOpen(true)} className="...">Logout</button>
        </div>
        
        {/* --- LAUNCHPAD --- */}
        <div className="p-6 my-4 bg-gray-900 border-2 border-blue-500 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-300">Your Next Quest</h2>
          {suggestedTask ? (
            <div className="mt-2 text-2xl font-bold text-white">
              {suggestedTask.title}
            </div>
          ) : (
            <p className="mt-2 text-gray-400">Nothing to suggest! Add a task to your to-do list.</p>
          )}
        </div>

        <NewTaskForm onTasksCreated={handleTasksCreated} />
        <TaskList tasks={tasks} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />
      </div>

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-gray-700 rounded-lg shadow-xl">
            <h2 className="text-lg font-semibold text-white">Confirm Logout</h2>
            <p className="mt-2 text-sm text-gray-300">Are you sure you want to log out?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-600 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}