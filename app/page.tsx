'use client'

import React from 'react';
import { useApi } from './contexts/ApiContext';
import { tasksApi, CreateTaskDto } from './api/tasksApi';
import { schedulesApi, CreateScheduleDto, ScheduleStatus } from './api/schedulesApi';
import { settingsApi } from './api/settingsApi';

export default function Home() {
  const { tasks, schedules, settings, refreshTasks, refreshSchedules, refreshSettings } = useApi();

  const createDemoTask = async () => {
    const demoTask: CreateTaskDto = {
      title: `Demo Task ${tasks.length + 1}`,
      estimatedDuration: 60,
      priority: 3,
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
      difficulty: 3,
      canSplit: false,
      description: 'This is a demo task',
    };
    
    try {
      await tasksApi.create(demoTask);
      refreshTasks();
    } catch (error) {
      console.error('Error creating demo task:', error);
      // Optionally, show an error message to the user
    }
  };

  const createDemoSchedule = async () => {
    if (tasks.length === 0) {
      alert('Please create a task first');
      return;
    }
    const demoSchedule: CreateScheduleDto = {
      taskId: tasks[0].id,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      status: ScheduleStatus.PLANNED,
      notes: 'Demo schedule',
    };
    await schedulesApi.create(demoSchedule);
    refreshSchedules();
  };

  const createDemoSetting = async () => {
    const demoSetting = {
      key: `demoSetting${settings.length + 1}`,
      value: `value${settings.length + 1}`,
    };
    await settingsApi.create(demoSetting);
    refreshSettings();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      <div className="mb-4">
        <button onClick={createDemoTask} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Create Demo Task</button>
        <button onClick={createDemoSchedule} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Create Demo Schedule</button>
        <button onClick={createDemoSetting} className="bg-purple-500 text-white px-4 py-2 rounded mr-2">Create Demo Setting</button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Tasks</h2>
        <table className="w-full border-collapse border border-gray-300 text-gray-800">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Duration</th>
              <th className="border border-gray-300 p-2">Priority</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="border border-gray-300 p-2">{task.id}</td>
                <td className="border border-gray-300 p-2">{task.title}</td>
                <td className="border border-gray-300 p-2">{task.estimatedDuration} min</td>
                <td className="border border-gray-300 p-2">{task.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={refreshTasks} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Refresh Tasks</button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Schedules</h2>
        <table className="w-full border-collapse border border-gray-300 text-gray-800">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Task</th>
              <th className="border border-gray-300 p-2">Start Time</th>
              <th className="border border-gray-300 p-2">End Time</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule.id}>
                <td className="border border-gray-300 p-2">{schedule.id}</td>
                <td className="border border-gray-300 p-2">{schedule.task.title}</td>
                <td className="border border-gray-300 p-2">{new Date(schedule.startTime).toLocaleString()}</td>
                <td className="border border-gray-300 p-2">{new Date(schedule.endTime).toLocaleString()}</td>
                <td className="border border-gray-300 p-2">{schedule.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={refreshSchedules} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">Refresh Schedules</button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Settings</h2>
        <table className="w-full border-collapse border border-gray-300 text-gray-800">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Key</th>
              <th className="border border-gray-300 p-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {settings.map(setting => (
              <tr key={setting.id}>
                <td className="border border-gray-300 p-2">{setting.id}</td>
                <td className="border border-gray-300 p-2">{setting.key}</td>
                <td className="border border-gray-300 p-2">{setting.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={refreshSettings} className="mt-2 bg-purple-500 text-white px-4 py-2 rounded">Refresh Settings</button>
      </div>
    </div>
  );
}