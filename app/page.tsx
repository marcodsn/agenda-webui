'use client'

import React from 'react';
import { useApi } from './contexts/ApiContext';

export default function Home() {
  const { tasks, schedules, settings, refreshTasks, refreshSchedules, refreshSettings } = useApi();

  return (
    <div>
      <h1>Tasks</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
      <h1>Schedules</h1>
      <ul>
        {schedules.map(schedule => (
          <li key={schedule.id}>{schedule.task.title}: {new Date(schedule.startTime).toLocaleString()}</li>
        ))}
      </ul>
      <h1>Settings</h1>
      <ul>
        {settings.map(setting => (
          <li key={setting.id}>{setting.key}: {setting.value}</li>
        ))}
      </ul>
      <button onClick={refreshTasks}>Refresh Tasks</button>
      <button onClick={refreshSchedules}>Refresh Schedules</button>
      <button onClick={refreshSettings}>Refresh Settings</button>
    </div>
  );
}