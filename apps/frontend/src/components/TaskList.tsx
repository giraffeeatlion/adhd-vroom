// apps/frontend/src/components/TaskList.tsx

import { Task } from '@/models/task.model';
import TaskItem from './TaskItem';

// 1. Define all the props the component will receive in an interface
interface TaskListProps {
  tasks: Task[];
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

// 2. Use the new props interface and accept the functions
export default function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  return (
    <div className="mt-4">
      <h2 className="text-xl">Your Tasks</h2>
      <ul className="mt-2 space-y-2">
        {tasks.length > 0 ? (
          tasks.map(task => (
            // 3. Pass the functions down to each TaskItem
            <TaskItem 
              key={task.id} 
              task={task} 
              onUpdate={onUpdate} 
              onDelete={onDelete} 
            />
          ))
        ) : (
          <p className="text-gray-400">You have no tasks yet. Add one above!</p>
        )}
      </ul>
    </div>
  );
}