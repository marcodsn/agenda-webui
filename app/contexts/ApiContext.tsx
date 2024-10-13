'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tasksApi, Task } from '../api/tasksApi';
import { schedulesApi, Schedule } from '../api/schedulesApi';
import { settingsApi, Setting } from '../api/settingsApi';

interface ApiContextType {
    tasks: Task[];
    schedules: Schedule[];
    settings: Setting[];
    refreshTasks: () => Promise<void>;
    refreshSchedules: () => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [settings, setSettings] = useState<Setting[]>([]);

    const refreshTasks = async () => {
        try {
            const fetchedTasks = await tasksApi.getAll();
            setTasks(fetchedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const refreshSchedules = async () => {
        try {
            const fetchedSchedules = await schedulesApi.getAll();
            setSchedules(fetchedSchedules);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const refreshSettings = async () => {
        try {
            const fetchedSettings = await settingsApi.getAll();
            setSettings(fetchedSettings);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    useEffect(() => {
        refreshTasks();
        refreshSchedules();
        refreshSettings();
    }, []);

    return (
        <ApiContext.Provider value={{ tasks, schedules, settings, refreshTasks, refreshSchedules, refreshSettings }}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};