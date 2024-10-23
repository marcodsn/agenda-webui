import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Collapsible from '@radix-ui/react-collapsible';
import styles from '../DialogStyle.module.css';
import { Task, UpdateTaskDto, tasksApi } from '@/app/api/tasksApi';
import { ColorPicker, useColor } from "react-color-palette";
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface EditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdated: (task: Task) => void;
}

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  isOpen,
  onClose,
  task,
  onTaskUpdated,
}) => {
  const [taskData, setTaskData] = useState<UpdateTaskDto>({
    title: '',
  });
  const [color, setColor] = useColor(taskData.color || "#561ecb");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  useEffect(() => {
    if (task) {
      setTaskData({
        title: task.title,
        estimatedDuration: task.estimatedDuration,
        priority: task.priority,
        type: task.type,
        category: task.category,
        timeOfDayPreference: task.timeOfDayPreference,
        startDate: task.startDate,
        notes: task.notes,
        difficulty: task.difficulty,
        bufferTime: task.bufferTime,
        minDaysBetween: task.minDaysBetween,
        deadline: task.deadline,
        recurrencePattern: task.recurrencePattern,
        floating: task.floating,
        autoReschedule: task.autoReschedule,
        canSplit: task.canSplit,
        endDate: task.endDate,
        totalSessions: task.totalSessions,
        targetSessionsPerPeriod: task.targetSessionsPerPeriod,
        maxSessionsPerPeriod: task.maxSessionsPerPeriod,
        periodUnit: task.periodUnit,
        preferredTime: task.preferredTime,
        color: task.color,
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    try {
      const updatedTask = await tasksApi.update(task.id, taskData);
      onTaskUpdated(updatedTask);
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      setErrorMessage('An error occurred while updating the task');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>Edit Task</Dialog.Title>
          <form onSubmit={handleSubmit}>
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>Title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Your awesome task"
                value={taskData.title}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="estimatedDuration" className={styles.label}>Duration (min)</label>
                <input
                  id="estimatedDuration"
                  name="estimatedDuration"
                  type="number"
                  value={taskData.estimatedDuration}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  min="1"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="priority" className={styles.label}>Priority</label>
                <input
                  id="priority"
                  name="priority"
                  type="number"
                  value={taskData.priority}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  min="1"
                  max="5"
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>Category</label>
                <select
                  id="category"
                  name="category"
                  value={taskData.category}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="one-time">One-time</option>
                  <option value="recurring">Recurring</option>
                  <option value="floating">Floating</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="timeOfDayPreference" className={styles.label}>Time Preference</label>
                <select
                  id="timeOfDayPreference"
                  name="timeOfDayPreference"
                  value={taskData.timeOfDayPreference}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="preferred_time">Preferred Time</option>
                </select>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="startDate" className={styles.label}>Start Date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={taskData.startDate}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="notes" className={styles.label}>Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={taskData.notes}
                placeholder='Notes for the task; these will be used to help schedule the task'
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <Collapsible.Root open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <Collapsible.Trigger className={styles.collapsibleTrigger}>
                Advanced Options
                {isAdvancedOpen ? <IconChevronUp /> : <IconChevronDown />}
              </Collapsible.Trigger>
              <Collapsible.Content className={styles.collapsibleContent}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="type" className={styles.label}>Type</label>
                    <input
                      id="type"
                      name="type"
                      type="text"
                      value={taskData.type}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="difficulty" className={styles.label}>Difficulty</label>
                    <input
                      id="difficulty"
                      name="difficulty"
                      type="number"
                      value={taskData.difficulty}
                      onChange={handleInputChange}
                      className={styles.input}
                      min="1"
                      max="5"
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="bufferTime" className={styles.label}>Buffer Time (min)</label>
                    <input
                      id="bufferTime"
                      name="bufferTime"
                      type="number"
                      value={taskData.bufferTime}
                      onChange={handleInputChange}
                      className={styles.input}
                      min="0"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="minDaysBetween" className={styles.label}>Min Days Between</label>
                    <input
                      id="minDaysBetween"
                      name="minDaysBetween"
                      type="number"
                      value={taskData.minDaysBetween}
                      onChange={handleInputChange}
                      className={styles.input}
                      min="0"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="deadline" className={styles.label}>Deadline</label>
                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={taskData.deadline}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="recurrencePattern" className={styles.label}>Recurrence Pattern</label>
                  <textarea
                    id="recurrencePattern"
                    name="recurrencePattern"
                    placeholder="Recurrence pattern for recurring tasks, use natural language"
                    value={taskData.recurrencePattern}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="floating"
                      checked={taskData.floating}
                      onChange={(e) => setTaskData((prev) => ({ ...prev, floating: e.target.checked }))}
                      className={styles.checkbox}
                    />
                    Floating
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="autoReschedule"
                      checked={taskData.autoReschedule}
                      onChange={(e) => setTaskData((prev) => ({ ...prev, autoReschedule: e.target.checked }))}
                      className={styles.checkbox}
                    />
                    Auto Reschedule
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="canSplit"
                      checked={taskData.canSplit}
                      onChange={(e) => setTaskData((prev) => ({ ...prev, canSplit: e.target.checked }))}
                      className={styles.checkbox}
                    />
                    Can Split
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="endDate" className={styles.label}>End Date</label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={taskData.endDate}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="totalSessions" className={styles.label}>Total Sessions</label>
                    <input
                      id="totalSessions"
                      name="totalSessions"
                      type="number"
                      value={taskData.totalSessions}
                      onChange={handleInputChange}
                      className={styles.input}
                      min="1"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="targetSessionsPerPeriod" className={styles.label}>Target Sessions Per Period</label>
                    <input
                      id="targetSessionsPerPeriod"
                      name="targetSessionsPerPeriod"
                      type="number"
                      value={taskData.targetSessionsPerPeriod}
                      onChange={handleInputChange}
                      className={styles.input}
                      min="1"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="maxSessionsPerPeriod" className={styles.label}>Max Sessions Per Period</label>
                    <input
                      id="maxSessionsPerPeriod"
                      name="maxSessionsPerPeriod"
                      type="number"
                      value={taskData.maxSessionsPerPeriod}
                      onChange={handleInputChange}
                      className={styles.input}
                      min="1"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="periodUnit" className={styles.label}>Period Unit</label>
                    <select
                      id="periodUnit"
                      name="periodUnit"
                      value={taskData.periodUnit}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="preferredTime" className={styles.label}>Preferred Time</label>
                  <input
                    id="preferredTime"
                    name="preferredTime"
                    type="time"
                    value={taskData.preferredTime}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="notes" className={styles.label}>Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={taskData.notes}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Color</label>
                  <ColorPicker color={color} onChange={setColor} />
                </div>

              </Collapsible.Content>
            </Collapsible.Root>

            <div className={styles.buttonContainer}>
              <Dialog.Close asChild>
                <button type="button" className={styles.closeButton}>Cancel</button>
              </Dialog.Close>
              <button type="submit" className={styles.submitButton}>
                Save Task
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditTaskDialog;