// apps/frontend/src/components/TaskItem.tsx
import { Task } from '@/models/task.model';

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  return (
    <li className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
      <span className={task.status === 'done' ? 'line-through text-gray-500' : ''}>
        {task.title}
      </span>
      <div className="flex gap-2">
        {task.status !== 'done' && (
          <button
            onClick={() => onUpdate(task.id, { status: 'done' })}
            className="px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Mark Done
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </li>
  );
}