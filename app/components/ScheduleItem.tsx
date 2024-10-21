import React, { useState } from 'react';
import styles from './ScheduleItem.module.css';
import { Schedule, ScheduleStatus } from '../api/schedulesApi';

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

  const getDarkerColor = (color: string) => {
    const rgb = parseInt(color.slice(1), 16);
    const r = Math.max(0, (rgb >> 16) - 40);
    const g = Math.max(0, ((rgb >> 8) & 0x00FF) - 40);
    const b = Math.max(0, (rgb & 0x0000FF) - 40);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

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
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.title}>{schedule.task.title}</div>
      <div className={styles.time}>
        {formatTime(new Date(schedule.startTime))} - {formatTime(new Date(schedule.endTime))}
      </div>
      {isHovered && (
        <div className={styles.details}>
          <p>Description: {schedule.task.description}</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleItem;