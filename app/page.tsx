'use client'

import React, { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Collapsible from '@radix-ui/react-collapsible';
import { useApi } from './contexts/ApiContext';
import { tasksApi, CreateTaskDto } from './api/tasksApi';
import { schedulesApi, CreateScheduleDto, ScheduleStatus } from './api/schedulesApi';
import { settingsApi } from './api/settingsApi';
import Calendar from './components/Calendar';
import Header from './components/Header';
import ItemCard from './components/ItemCard';
import { IconChevronLeft, IconChevronRight, IconRefresh, IconPlus } from '@tabler/icons-react';

export default function Home() {
  const { tasks, schedules, settings, refreshTasks, refreshSchedules, refreshSettings } = useApi();
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  function getMonday(d: Date) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);  // Adjust when day is sunday
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0); // Set time to midnight
    return monday;
  }

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

  const upcomingSchedules = schedules
    .filter(schedule => new Date(schedule.endTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 10);

  const getDatesForWeek = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getDatesForWeek(currentWeekStart);

  const formatWeekRange = (start: Date) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`;
  };

  const changeWeek = (direction: 'prev' | 'next') => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newStart);
  };

  const isCurrentWeek = () => {
    const today = new Date();
    const mondayOfCurrentWeek = getMonday(today);
    return currentWeekStart.getTime() === mondayOfCurrentWeek.getTime();
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel with tabs */}
        <aside className="w-full bg-brand-secondary p-4 pt-1 flex-shrink-0 lg:w-72">
          <Tabs.Root defaultValue="upcoming" className="flex flex-col h-full">
            <Tabs.List className="flex space-x-2 mb-4 tabs-list">
              <Tabs.Trigger value="upcoming" className="tab-trigger">Upcoming</Tabs.Trigger>
              <Tabs.Trigger value="tasks" className="tab-trigger">Tasks</Tabs.Trigger>
              <Tabs.Trigger value="settings" className="tab-trigger">Settings</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="upcoming" className="flex-grow overflow-auto custom-scrollbar">
              <button onClick={createDemoSchedule} className="bg-neutral-200 text-black px-2 pr-4 py-2 rounded flex justify-between">
                <IconPlus className='size-5 mr-2' />
                <span>Demo Schedule</span>
              </button>
              <ul className='pt-4'>
                {upcomingSchedules.map(schedule => (
                  <ItemCard
                    key={schedule.id}
                    title={schedule.task.title}
                    subtitle={new Date(schedule.startTime).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                    onClick={() => console.log('Clicked schedule:', schedule.id)}
                    backgroundColor={schedule.task.color}
                  />
                ))}
              </ul>
            </Tabs.Content>
            <Tabs.Content value="tasks" className="flex-grow overflow-auto custom-scrollbar">
              <button onClick={createDemoTask} className="bg-neutral-200 text-black px-2 pr-4 py-2 rounded flex justify-between">
                <IconPlus className='size-5 mr-2' />
                <span>Demo Task</span>
              </button>
            </Tabs.Content>
            <Tabs.Content value="settings" className="flex-grow overflow-auto custom-scrollbar">
              <button onClick={createDemoSetting} className="bg-neutral-200 text-black px-2 pr-4 py-2 rounded flex justify-between">
                <IconPlus className='size-5 mr-2' />
                <span>Demo Setting</span>
              </button>
            </Tabs.Content>
          </Tabs.Root>
        </aside>

        {/* Main content area with calendar */}
        <main className="flex-1 overflow-auto p-4 pt-2 hidden md:block custom-scrollbar">
          <div className="flex items-center mb-4">
            <button onClick={() => changeWeek('prev')} className="px-3 py-1">
              <IconChevronLeft />
            </button>
            <h2 className="text-md font-semibold">
              {isCurrentWeek() ? 'This week' : formatWeekRange(currentWeekStart)}
            </h2>
            <button onClick={() => changeWeek('next')} className="px-3 py-1">
              <IconChevronRight />
            </button>
          </div>

          <Calendar
            schedules={schedules}
            startHour={6}
            endHour={24}
            onCellClick={(date, time) => {
              console.log('Clicked:', date, time);
              // Handle click event, e.g., open a modal to add a new schedule
            }}
            dates={weekDates}
            currentTime={currentTime}
          />
          <button onClick={refreshSchedules} className="mt-4">
            <IconRefresh />
          </button>
        </main>
      </div>

      {/* Mobile view, WIP!!! */}
      <div className="md:hidden">
        <Collapsible.Root>
          {/* <Collapsible.Trigger className="block w-full bg-brand-primary text-white p-2">
            Toggle Menu
          </Collapsible.Trigger> */}
          <Collapsible.Content className="bg-brand-secondary p-4">
            {/* Mobile sidebar content */}
            <Tabs.Root defaultValue="upcoming" className="flex flex-col">
              <Tabs.List className="flex space-x-2 mb-4">
                <Tabs.Trigger value="upcoming" className="tab-trigger">Upcoming</Tabs.Trigger>
                <Tabs.Trigger value="tasks" className="tab-trigger">Tasks</Tabs.Trigger>
                <Tabs.Trigger value="settings" className="tab-trigger">Settings</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="upcoming">
                <h2 className="text-xl font-semibold mb-2">Upcoming Schedules</h2>
                <ul>
                  {upcomingSchedules.map(schedule => (
                    <li key={schedule.id} className="mb-2">
                      <p>{schedule.task.title}</p>
                      <p>{new Date(schedule.startTime).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}</p>
                    </li>
                  ))}
                </ul>
              </Tabs.Content>
              <Tabs.Content value="tasks">
                <h2 className="text-xl font-semibold mb-2">Tasks</h2>
                {/* Add your tasks list here */}
              </Tabs.Content>
              <Tabs.Content value="settings">
                <h2 className="text-xl font-semibold mb-2">Settings</h2>
                {/* Add your settings list here */}
              </Tabs.Content>
            </Tabs.Root>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  );
}