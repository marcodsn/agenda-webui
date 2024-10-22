import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { Task, tasksApi, CreateTaskDto } from '../api/tasksApi';
import { schedulesApi, CreateScheduleDto, ScheduleStatus } from '../api/schedulesApi';
import { IconPlus } from '@tabler/icons-react';
import styles from './CreateScheduleDialog.module.css';

interface CreateScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleCreated: () => void;
}

const CreateScheduleDialog: React.FC<CreateScheduleDialogProps> = ({
  isOpen,
  onClose,
  onScheduleCreated,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);
  const [scheduleData, setScheduleData] = useState<CreateScheduleDto>({
    taskId: 0,
    startTime: '',
    endTime: '',
    status: ScheduleStatus.PLANNED,
    notes: '',
  });
  const [newTaskData, setNewTaskData] = useState<CreateTaskDto>({
    title: '',
    estimatedDuration: 60,
    priority: 1,
    type: 'default',
    category: 'one-time',
    timeOfDayPreference: 'preferred_time',
    floating: false,
    blacklistedDays: [],
    whitelistedDays: [],
    minDaysBetween: 0,
    autoReschedule: true,
    completedSessions: 0,
    bufferTime: 0,
    difficulty: 1,
    canSplit: false,
  });

  useEffect(() => {
    if (isOpen) {
      loadTasks();
    }
  }, [isOpen]);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await tasksApi.getAll();

      // Sort tasks by title
      fetchedTasks.sort((a, b) => a.title.localeCompare(b.title));

      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleTaskSelect = (taskId: string) => {
    if (taskId === 'new') {
      setIsNewTask(true);
      setSelectedTaskId(null);
    } else {
      setIsNewTask(false);
      setSelectedTaskId(Number(taskId));
      const selectedTask = tasks.find((task) => task.id === Number(taskId));
      if (selectedTask) {
        setScheduleData((prev) => ({
          ...prev,
          taskId: selectedTask.id,
          startTime: selectedTask.preferredTime || '',
          endTime: selectedTask.preferredTime
            ? new Date(new Date(selectedTask.preferredTime).getTime() + selectedTask.estimatedDuration * 60000).toISOString()
            : '',
        }));
      }
    }
  };

  const handleScheduleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewTaskDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isNewTask) {
        const createdTask = await tasksApi.create(newTaskData);
        scheduleData.taskId = createdTask.id;
      }
      await schedulesApi.create(scheduleData);
      onScheduleCreated();
      onClose();
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>Create Schedule</Dialog.Title>
          <form onSubmit={handleSubmit}>
            <Select.Root onValueChange={handleTaskSelect}>
              <Select.Trigger className={styles.selectTrigger}>
                <Select.Value placeholder="Select a task" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className={styles.selectContent}>
                  <Select.Viewport>
                    <Select.Group>
                      <Select.Label>Existing Tasks</Select.Label>
                      {tasks.map((task) => (
                        <Select.Item key={task.id} value={task.id.toString()} className={styles.selectItem}>
                          <Select.ItemText>{task.title}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Group>
                    <Select.Separator />
                    <Select.Group>
                      <Select.Item value="new" className={styles.selectItem}>
                        <Select.ItemText>
                          <div className="flex items-center">
                            <IconPlus className="size-5 mr-2" />
                            <span>New task</span>
                          </div>
                        </Select.ItemText>
                      </Select.Item>
                    </Select.Group>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            {isNewTask ? (
              <div className={styles.newTaskFields}>
                <label htmlFor="taskTitle" className={styles.label}>Task Title</label>
                <input
                  id="taskTitle"
                  type="text"
                  name="title"
                  placeholder="Your awesome task"
                  value={newTaskData.title}
                  onChange={handleNewTaskDataChange}
                  className={styles.input}
                />
                <label htmlFor="estimatedDuration" className={styles.label}>Estimated Duration</label>
                <input
                  id="estimatedDuration"
                  type="number"
                  name="estimatedDuration"
                  placeholder="Estimated Duration (minutes)"
                  value={newTaskData.estimatedDuration}
                  onChange={handleNewTaskDataChange}
                  className={styles.input}
                />
                {/* Add more fields for new task as needed */}
              </div>
            ) : null}

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
              <button type="submit" className={styles.submitButton}>
                Create Schedule
              </button>
              <Dialog.Close asChild>
                <button type="button" className={styles.closeButton}>Close</button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateScheduleDialog;