import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from '../DialogStyle.module.css';
import { Task, tasksApi } from '@/app/api/tasksApi';

interface DeleteTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskDeleted: (id: number) => void;
}

const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({
  isOpen,
  onClose,
  task,
  onTaskDeleted,
}) => {
  const handleDelete = async () => {
    if (!task) return;
    
    try {
      await tasksApi.delete(task.id);
      onTaskDeleted(task.id);
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!task) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>Delete Task</Dialog.Title>
          <p className={styles.dialogDescription}>
            Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
          </p>
          <div className={styles.buttonContainer}>
            <Dialog.Close asChild>
              <button type="button" className={styles.closeButton}>Cancel</button>
            </Dialog.Close>
            <button 
              type="button" 
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              Delete Task
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteTaskDialog;