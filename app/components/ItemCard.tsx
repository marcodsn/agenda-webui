// ItemCard.tsx
import React, { useState } from 'react';
import styles from './ItemCard.module.css';
import { IconEdit, IconTrash, IconCheck } from '@tabler/icons-react';
import EditTaskDialog from './dialogs/tasks/EditTaskDialog';
import DeleteTaskDialog from './dialogs/tasks/DeleteTaskDialog';
import EditScheduleDialog from './dialogs/schedules/EditScheduleDialog';
import DeleteScheduleDialog from './dialogs/schedules/DeleteScheduleDialog';
import { Task } from '@/app/api/tasksApi';
import { Schedule, ScheduleStatus, schedulesApi } from '@/app/api/schedulesApi';

interface ItemCardProps {
  task: Task;
  schedule?: Schedule;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (id: number) => void;
  onScheduleUpdated?: (schedule: Schedule) => void;
  onScheduleDeleted?: (id: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  task,
  schedule,
  onTaskUpdated,
  onTaskDeleted,
  onScheduleUpdated,
  onScheduleDeleted
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const bgColor = '#262626';
  const bdColor = task.color || 'var(--color-light-gray)';

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (schedule && schedule.status !== ScheduleStatus.COMPLETED) {
      try {
        const updatedSchedule = await schedulesApi.completeSchedule(schedule.id);
        onScheduleUpdated?.(updatedSchedule);
      } catch (error) {
        console.error('Error completing schedule:', error);
      }
    }
  };

  return (
    <>
      <div
        className={styles.itemCard}
        style={{
          borderColor: bdColor,
          opacity: schedule?.status === ScheduleStatus.COMPLETED ? 0.5 : 1
        }}
        onClick={handleEdit}
      >
        <div className={styles.header}>
          <span className={styles.title}>{task.title}</span>
          <div className={styles.actions}>
            {schedule && (
              <IconCheck
                className={`${styles.actionIcon} ${schedule.status === ScheduleStatus.COMPLETED ? styles.completed : ''}`}
                size={16}
                onClick={handleComplete}
              />
            )}
            <IconEdit
              className={styles.actionIcon}
              size={16}
              onClick={handleEdit}
            />
            <IconTrash
              className={styles.actionIcon}
              size={16}
              onClick={handleDelete}
            />
          </div>
        </div>
        {task.description && <p className={styles.subtitle}>{task.description}</p>}
        {!task.description && !schedule && <p className={styles.subtitle}>No description</p>}
        {schedule && (
          <p className={styles.scheduleTime}>
            {new Date(schedule.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
      </div>

      {schedule ? (
        <>
          <EditScheduleDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            schedule={schedule}
            onScheduleUpdated={onScheduleUpdated!}
          />
          <DeleteScheduleDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            schedule={schedule}
            onScheduleDeleted={onScheduleDeleted!}
          />
        </>
      ) : (
        <>
          <EditTaskDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            task={task}
            onTaskUpdated={onTaskUpdated}
          />
          <DeleteTaskDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            task={task}
            onTaskDeleted={onTaskDeleted}
          />
        </>
      )}
    </>
  );
};

export default ItemCard;