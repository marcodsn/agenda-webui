import React from 'react';
import ItemCard from './ItemCard';
import { Schedule } from '../api/schedulesApi';
import { format, isToday, isTomorrow, isThisWeek, isThisMonth } from 'date-fns';

// Helper function to group schedules by date
const groupSchedulesByDate = (schedules: Schedule[]) => {
  const groups: { [key: string]: Schedule[] } = {};
  
  schedules.forEach(schedule => {
    const date = new Date(schedule.startTime);
    const key = format(date, 'yyyy-MM-dd');
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(schedule);
  });

  return groups;
};

// Helper function to get a human-readable date header
const getDateHeader = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isThisWeek(date)) return format(date, 'EEEE'); // Day of the week
  if (isThisMonth(date)) return format(date, 'MMMM d'); // Month and day
  return format(date, 'MMMM d, yyyy'); // Full date for dates beyond this month
};

const ScheduleList: React.FC<{ upcomingSchedules: Schedule[] }> = ({ upcomingSchedules }) => {
  const groupedSchedules = groupSchedulesByDate(upcomingSchedules);

  return (
    <div className='pt-4'>
      {Object.entries(groupedSchedules).map(([dateString, schedules]) => (
        <div key={dateString}>
          <h2 className="text-xl font-bold mb-2">{getDateHeader(dateString)}</h2>
          <ul className='mb-4'>
            {schedules.map(schedule => (
              <ItemCard
                key={schedule.id}
                title={schedule.task.title}
                subtitle={format(new Date(schedule.startTime), 'HH:mm')}
                onClick={() => console.log('Clicked schedule:', schedule.id)}
                taskColor={schedule.task.color}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;