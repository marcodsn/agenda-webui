import apiClient from './apiClient';
import { Task } from './tasksApi';

export enum ScheduleStatus {
    PLANNED = 'planned',
    COMPLETED = 'completed',
    RESCHEDULED = 'rescheduled'
}

export interface Schedule {
    id: number;
    task: Task;
    startTime: string;
    endTime: string;
    status: ScheduleStatus;
    rescheduledTo?: Schedule | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateScheduleDto {
    taskId: number;
    startTime: string;
    endTime: string;
    status: ScheduleStatus;
    notes: string | null;
}
export type UpdateScheduleDto = Partial<Omit<CreateScheduleDto, 'taskId'>>;

export const schedulesApi = {
    getAll: async (): Promise<Schedule[]> => {
        const response = await apiClient.get<Schedule[]>('/api/schedules');
        return response.data;
    },

    getOne: async (id: number): Promise<Schedule> => {
        const response = await apiClient.get<Schedule>(`/api/schedules/${id}`);
        return response.data;
    },

    create: async (schedule: CreateScheduleDto): Promise<Schedule> => {
        const response = await apiClient.post<Schedule>('/api/schedules', schedule);
        return response.data;
    },

    update: async (id: number, schedule: UpdateScheduleDto): Promise<Schedule> => {
        const response = await apiClient.put<Schedule>(`/api/schedules/${id}`, schedule);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/schedules/${id}`);
    },

    getByDateRange: async (startDate: string, endDate: string): Promise<Schedule[]> => {
        const response = await apiClient.get<Schedule[]>('/api/schedules/date-range', {
            params: { startDate, endDate },
        });
        return response.data;
    },

    reschedule: async (id: number, newStartTime: string, newEndTime: string): Promise<Schedule> => {
        const response = await apiClient.post<Schedule>(`/api/schedules/${id}/reschedule`, {
            startTime: newStartTime,
            endTime: newEndTime,
        });
        return response.data;
    },

    completeSchedule: async (id: number): Promise<Schedule> => {
        const response = await apiClient.post<Schedule>(`/api/schedules/${id}/complete`);
        return response.data;
    },
};