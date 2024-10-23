import React, { useState } from 'react';
import styles from './ScheduleItem.module.css';
import { Schedule, ScheduleStatus, schedulesApi } from '../api/schedulesApi';
import { IconCheck, IconEdit, IconTrash } from '@tabler/icons-react';
import EditScheduleDialog from './dialogs/schedules/EditScheduleDialog';
import DeleteScheduleDialog from './dialogs/schedules/DeleteScheduleDialog';

interface ScheduleItemProps {
  schedule: Schedule;
  top: number;
  height: number;
  colors?: {
    planned?: string;
    rescheduled?: string;
  };
  onScheduleUpdated?: (schedule: Schedule) => void;
  onScheduleDeleted?: (id: number) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  schedule,
  top,
  height,
  colors,
  onScheduleUpdated,
  onScheduleDeleted
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const defaultColors = {
    planned: '#A8D8FF',
    rescheduled: '#FFE5B4',
  };

  const getStatusColor = (status: ScheduleStatus) => {
    const plannedColor = colors?.planned || defaultColors.planned;
    const rescheduledColor = colors?.rescheduled || defaultColors.rescheduled;

    switch (status) {
      case ScheduleStatus.COMPLETED:
        return `${plannedColor}80`;
      case ScheduleStatus.RESCHEDULED:
        return rescheduledColor;
      case ScheduleStatus.PLANNED:
      default:
        return plannedColor;
    }
  };

  const getDarkerColor = (color: string, amount = 40) => {
    // const hex = color.replace('#', '');
    const hex = color.substring(0, 7).replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, (num >> 16) - amount);
    const b = Math.max(0, ((num >> 8) & 0x00FF) - amount);
    const g = Math.max(0, (num & 0x0000FF) - amount);
    const newColor = `#${(g | (b << 8) | (r << 16)).toString(16).padStart(6, '0')}`;
    return newColor;
  }

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (schedule.status !== ScheduleStatus.COMPLETED) {
      try {
        const updatedSchedule = await schedulesApi.completeSchedule(schedule.id);
        onScheduleUpdated?.(updatedSchedule);
      } catch (error) {
        console.error('Error completing schedule:', error);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const hasDescription = schedule.task.description && schedule.task.description.trim() !== '';
  const backgroundColor = getStatusColor(schedule.status);
  const borderColor = getDarkerColor(backgroundColor);
  const iconColor = getDarkerColor(backgroundColor, 160);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Utility functions for timezone conversion
  const convertUTCToLocal = (utcDate: Date | string): Date => {
    const date = new Date(utcDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  const convertLocalToUTC = (localDate: Date): Date => {
    return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
  };

  return (
    <>
      <div
        className={`${styles.scheduleItem} ${isHovered ? styles.expanded : ''}`}
        style={{
          top: `${top}%`,
          height: `${height}%`,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          color: iconColor,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.header}>
          <div className={styles.title}>{schedule.task.title}</div>
          {isHovered && (
            <div className={styles.actions} style={{ color: iconColor }}>
              <IconCheck
                className={`${styles.actionIcon} ${schedule.status === ScheduleStatus.COMPLETED ? styles.completed : ''}`}
                size={16}
                onClick={handleComplete}
              />
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
          )}
        </div>
        <div className={styles.time}>
          {/* {formatTime(new Date(schedule.startTime))} - {formatTime(new Date(schedule.endTime))} */}
          {formatTime(convertUTCToLocal(schedule.startTime))} - {formatTime(convertUTCToLocal(schedule.endTime))}
        </div>
        {isHovered && hasDescription && (
          <div className={styles.details}>
            <p>Description: {schedule.task.description}</p>
          </div>
        )}
      </div>

      <EditScheduleDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        schedule={schedule}
        onScheduleUpdated={(updatedSchedule) => {
          onScheduleUpdated?.(updatedSchedule);
          setIsEditDialogOpen(false);
        }}
      />

      <DeleteScheduleDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        schedule={schedule}
        onScheduleDeleted={(id) => {
          onScheduleDeleted?.(id);
          setIsDeleteDialogOpen(false);
        }}
      />
    </>
  );
};

export default ScheduleItem;