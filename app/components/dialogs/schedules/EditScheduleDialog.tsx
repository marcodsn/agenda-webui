import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import styles from '../DialogStyle.module.css';
import { Schedule, ScheduleStatus, UpdateScheduleDto, schedulesApi } from '@/app/api/schedulesApi';

interface EditScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule;
  onScheduleUpdated: (schedule: Schedule) => void;
}

const EditScheduleDialog: React.FC<EditScheduleDialogProps> = ({
  isOpen,
  onClose,
  schedule,
  onScheduleUpdated,
}) => {
  const [scheduleData, setScheduleData] = useState<UpdateScheduleDto>({
    startTime: '',
    endTime: '',
    status: schedule.status,
    notes: '',
  });

  useEffect(() => {
    const formatDateTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16); // Get YYYY-MM-DDThh:mm format
    };

    if (schedule) {
      setScheduleData({
        startTime: formatDateTime(schedule.startTime),
        endTime: formatDateTime(schedule.endTime),
        status: schedule.status,
        notes: schedule.notes,
      });
    }
  }, [schedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedSchedule = await schedulesApi.update(schedule.id, scheduleData);
      onScheduleUpdated(updatedSchedule);
      onClose();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const handleScheduleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleStatusChange = (status: ScheduleStatus) => {
    setScheduleData((prev) => ({ ...prev, status }));
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>Create Schedule</Dialog.Title>
          <form onSubmit={handleSubmit}>
            <div className={styles.selectTrigger}>{schedule.task.title}</div>

            <label htmlFor="startTime" className={styles.label}>Start Time</label>
            <input
              id="startTime"
              type="datetime-local"
              name="startTime"
              value={scheduleData.startTime}
              onChange={handleScheduleDataChange}
              className={styles.input}
            />
            <label htmlFor="endTime" className={styles.label}>End Time</label>
            <input
              id="endTime"
              type="datetime-local"
              name="endTime"
              value={scheduleData.endTime}
              onChange={handleScheduleDataChange}
              className={styles.input}
            />
            <label htmlFor="status" className={styles.label}>Status</label>
            <Select.Root
              onValueChange={handleScheduleStatusChange}
            >
              <Select.Trigger className={styles.selectTrigger}>
                {scheduleData.status}
              </Select.Trigger>
              <Select.Content className={styles.selectContent}>
                <Select.Item value={ScheduleStatus.PLANNED} className={styles.selectItem}>Pending</Select.Item>
                <Select.Item value={ScheduleStatus.COMPLETED} className={styles.selectItem}>Completed</Select.Item>
                <Select.Item value={ScheduleStatus.RESCHEDULED} className={styles.selectItem}>Rescheduled</Select.Item>
              </Select.Content>
            </Select.Root>
            <label htmlFor="notes" className={styles.label}>Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Rules and notes for this schedule, use natural language"
              value={scheduleData.notes || ''}
              onChange={handleScheduleDataChange}
              className={styles.textarea}
            />
            <div className={styles.buttonContainer}>
              <Dialog.Close asChild>
                <button type="button" className={styles.closeButton}>Close</button>
              </Dialog.Close>
              <button type="submit" className={styles.submitButton}>
                Save Schedule
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditScheduleDialog;