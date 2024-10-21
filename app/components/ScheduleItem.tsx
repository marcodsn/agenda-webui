import React, { useState } from 'react';
import styles from './ScheduleItem.module.css';
import { Schedule, ScheduleStatus } from '../api/schedulesApi';
import { get } from 'http';

interface ScheduleItemProps {
  schedule: Schedule;
  top: number;
  height: number;
  colors?: {
    planned?: string;
    rescheduled?: string;
  };
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, top, height, colors }) => {
  const [isHovered, setIsHovered] = useState(false);

  const defaultColors = {
    planned: '#A8D8FF',
    rescheduled: '#FFE5B4',
  };

  const getStatusColor = (status: ScheduleStatus) => {
    const plannedColor = colors?.planned || defaultColors.planned;
    const rescheduledColor = colors?.rescheduled || defaultColors.rescheduled;

    switch (status) {
      case ScheduleStatus.COMPLETED:
        return `${plannedColor}80`; // 80 is 50% opacity in hex
      case ScheduleStatus.RESCHEDULED:
        return rescheduledColor;
      case ScheduleStatus.PLANNED:
      default:
        return plannedColor;
    }
  };

  const getDarkerColor = (color: string, amount = 40) => {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = (num >> 16) - amount;
    const b = ((num >> 8) & 0x00FF) - amount;
    const g = (num & 0x0000FF) - amount;
    const newColor = `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    return newColor;
  }

  const hasDescription = schedule.task.description && schedule.task.description.trim() !== '';

  const backgroundColor = getStatusColor(schedule.status);
  const borderColor = getDarkerColor(backgroundColor);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`${styles.scheduleItem} ${isHovered ? styles.expanded : ''}`}
      style={{
        top: `${top}%`,
        height: `${height}%`,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        color: getDarkerColor(backgroundColor, 160),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.title}>{schedule.task.title}</div>
      <div className={styles.time}>
        {formatTime(new Date(schedule.startTime))} - {formatTime(new Date(schedule.endTime))}
      </div>
      {isHovered && hasDescription && (
        <div className={styles.details}>
          <p>Description: {schedule.task.description}</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleItem;