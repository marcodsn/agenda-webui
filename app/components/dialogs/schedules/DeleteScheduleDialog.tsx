import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "../DialogStyle.module.css";
import { Schedule, schedulesApi } from "@/app/api/schedulesApi";

interface DeleteScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule | null;
  onScheduleDeleted: (id: number) => void;
}

const DeleteScheduleDialog: React.FC<DeleteScheduleDialogProps> = ({
  isOpen,
  onClose,
  schedule,
  onScheduleDeleted,
}) => {
  const handleDelete = async () => {
    if (!schedule) return;

    try {
      await schedulesApi.delete(schedule.id);
      onScheduleDeleted(schedule.id);
      onClose();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  if (!schedule) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString();  // Get MM/DD/YYYY at hh:mm format
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>Delete Schedule</Dialog.Title>
          <p className={styles.dialogDescription}>
            Are you sure you want to delete the schedule for {formatDateTime(schedule.startTime)} to {formatDateTime(schedule.endTime)}?
            This action cannot be undone.
          </p>
          <div className={styles.buttonContainer}>
            <Dialog.Close asChild>
              <button type="button" className={styles.closeButton}>
                Cancel
              </button>
            </Dialog.Close>
            <button type="button" className={styles.deleteButton} onClick={handleDelete}>
              Delete Schedule
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteScheduleDialog;