'use client'

import React, { useState, useCallback } from 'react';
import styles from './Calendar.module.css';
import { Schedule } from '../api/schedulesApi';
import ScheduleItem from './ScheduleItem';
import { useApi } from '../contexts/ApiContext';

interface CalendarProps {
  schedules: Schedule[];
  startHour?: number;
  endHour?: number;
  onCellClick: (date: Date, time: Date) => void;
  dates: Date[];
  currentTime: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  schedules,
  startHour = 7,
  endHour = 20,
  onCellClick,
  dates,
  currentTime
}) => {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const displayHours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const { refreshSchedules } = useApi();

  const [hoveredTime, setHoveredTime] = useState<Date | null>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', { hour: 'numeric', hour12: true });
  };

  const formatTimeWithMinutes = (date: Date) => {
    return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const totalMinutes = Math.floor((y / rect.height) * (endHour - startHour) * 60);
    const hours = Math.floor(totalMinutes / 60) + startHour;
    const minutes = totalMinutes % 60;

    const time = new Date();
    time.setHours(hours, minutes, 0, 0);

    setHoveredTime(time);
  }, [startHour, endHour]);

  const handleCellClick = useCallback((date: Date) => {
    if (hoveredTime) {
      const clickedDateTime = new Date(date);
      clickedDateTime.setHours(hoveredTime.getHours(), hoveredTime.getMinutes(), 0, 0);
      onCellClick(date, clickedDateTime);
    }
  }, [hoveredTime, onCellClick]);

  const handleMouseLeave = () => {
    setHoveredTime(null);
  };

  const getCurrentTimePosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalHours = hours + minutes / 60;

    if (totalHours < startHour || totalHours > endHour) {
      return -1; // Hide the line if current time is outside the calendar range
    }

    const calendarHeight = (endHour - startHour) * 60; // Total height in pixels, see CSS
    const pixelsPerHour = calendarHeight / (endHour - startHour);
    const pixelsFromTop = (totalHours - startHour) * pixelsPerHour;

    // Add the 50px offset for the date header
    const totalPixelsFromTop = pixelsFromTop + 50;

    // Convert to percentage of total height (including the 50px header)
    const percentage = (totalPixelsFromTop / (calendarHeight + 50)) * 100;

    return percentage;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
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
    <div className={styles.calendarContainer}>
      <div className={styles.cornerBox}></div>
      <div className={styles.timeHeader}>
        {displayHours.map((hour) => (
          <div key={hour} className={styles.timeCell}>
            {formatTime(new Date(0, 0, 0, hour))}
          </div>
        ))}
      </div>
      <div className={styles.calendarGrid}>
        {getCurrentTimePosition() >= 0 && (
          <div
            className={styles.currentTimeIndicator}
            style={{ top: `${getCurrentTimePosition()}%` }}
          >
            <div className={styles.currentTimeTooltip}>
              {formatTimeWithMinutes(currentTime)}
            </div>
          </div>
        )}
        {dates.map((date, dateIndex) => (
          <div key={dateIndex} className={`${styles.dayColumn} ${isToday(date) ? styles.todayColumn : ''}`}>
            <div className={styles.dateHeader}>
              {date.toLocaleDateString(undefined, { weekday: 'short' })}
              <br />
              {date.toLocaleDateString()}
            </div>
            <div
              className={styles.daySchedule}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleCellClick(date)}
              style={{
                backgroundSize: `100% ${100 / (endHour - startHour)}%`,
              }}
            >
              {schedules
                .filter(schedule => {
                  // const scheduleDate = new Date(schedule.startTime);
                  const scheduleDate = convertUTCToLocal(schedule.startTime);
                  return scheduleDate.toDateString() === date.toDateString();
                })
                .map(schedule => {
                  // const start = new Date(schedule.startTime);
                  // const end = new Date(schedule.endTime);
                  const start = convertUTCToLocal(schedule.startTime);
                  const end = convertUTCToLocal(schedule.endTime);
                  const top = ((start.getHours() - startHour + start.getMinutes() / 60) / (endHour - startHour)) * 100;
                  const height = ((end.getHours() - start.getHours() + (end.getMinutes() - start.getMinutes()) / 60) / (endHour - startHour)) * 100;
                  return (
                    <ScheduleItem
                      key={schedule.id}
                      schedule={schedule}
                      top={top}
                      height={height}
                      colors={{ planned: schedule.task.color }}
                      onScheduleUpdated={(updatedSchedule) => {
                        refreshSchedules();
                      }}
                      onScheduleDeleted={(id) => {
                        refreshSchedules();
                      }}
                    />
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;