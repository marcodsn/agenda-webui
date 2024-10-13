import apiClient from './apiClient';

export interface Setting {
    id: number;
    key: string;
    value: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateSettingDto = Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>;  // Omit the id, createdAt, and updatedAt fields, which are generated by the server
export type UpdateSettingDto = Partial<CreateSettingDto>;

export const settingsApi = {
    getAll: async (): Promise<Setting[]> => {
        const response = await apiClient.get<Setting[]>('/api/settings');
        return response.data;
    },

    getOne: async (key: string): Promise<Setting> => {
        const response = await apiClient.get<Setting>(`/api/settings/${key}`);
        return response.data;
    },

    create: async (setting: CreateSettingDto): Promise<Setting> => {
        const response = await apiClient.post<Setting>('/api/settings', setting);
        return response.data;
    },

    update: async (key: string, setting: UpdateSettingDto): Promise<Setting> => {
        const response = await apiClient.put<Setting>(`/api/settings/${key}`, setting);
        return response.data;
    },

    delete: async (key: string): Promise<void> => {
        await apiClient.delete(`/api/settings/${key}`);
    },
};