import { create } from 'zustand';
import type { UserDTO } from '../dto/types/users.dto.d';
import { getUsersApi, createUserApi, updateUserApi, deleteUserApi } from '../api/users';
import type { PaginationState } from '@/types/pagination';

interface UsersOptions {
    sortBy?: 'createdAt' | 'name' | 'email';
    sortOrder?: 'asc' | 'desc';
    page: number;
    limit: number;
}

interface UsersState {
    users: UserDTO[];
    user: UserDTO | null;
    usersPagination: PaginationState;
    usersOptions: UsersOptions;
    total: number;
    loading: boolean;
    loadingCtreate: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;
    error: string | null;
    errorCreate: string | null;
    errorUpdate: string | null;
    errorDelete: string | null;
    fetchUsers: () => Promise<void>;
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    setSorting: (options: { sortBy?: 'createdAt' | 'name' | 'email'; sortOrder?: 'asc' | 'desc' }) => void;
    createUser: (userData: UserDTO) => Promise<void>;
    updateUser: (userId: string, userData: UserDTO) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
}


export const useUsersStore = create<UsersState>((set, get) => ({
    users: [],
    user: null,
    usersPagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },
    usersOptions: {
        sortBy: undefined,
        sortOrder: undefined,
        page: 1,
        limit: 10,
    },
    total: 0,
    loading: false,
    loadingCtreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    errorCreate: null,
    errorUpdate: null,
    errorDelete: null,
    fetchUsers: async () => {
        const options = get().usersOptions;
        set({ loading: true, error: null });
        try {
            const response = await getUsersApi(options);
            set({ users: response.items,
                usersPagination: {
                    total: response.total,
                    page: response.page,
                    limit: response.limit,
                    totalPages: response.totalPages,
                }
            });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch users' });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    setPage: (page: number) => {
        set((state) => ({
            usersOptions: {
                ...state.usersOptions,
                page,
            },
        }));
        void get().fetchUsers();
    },
    setLimit: (limit: number) => {
        set((state) => ({
            usersOptions: {
                ...state.usersOptions,
                limit,
            },
        }));
        void get().fetchUsers();
    },
    setSorting: (params: { sortBy?: 'createdAt' | 'name' | 'email'; sortOrder?: 'asc' | 'desc' }) => {
        set((state) => ({
            usersOptions: { ...state.usersOptions, ...params },
        }));
        void get().fetchUsers();
    },
    createUser: async (userData) => {
        set({ loadingCtreate: true, error: null });
        try {
            const newUser = await createUserApi(userData);
            set((state) => ({ users: [newUser, ...state.users], total: state.total + 1 }));
        } catch (error: any) {
            set({ errorCreate: error.message || 'Failed to create user' });
            throw error;
        } finally {
            set({ loadingCtreate: false });
        }
    },
    updateUser: async (userId, userData) => {
        set({ loading: true, error: null });
        try {
            const updatedUser = await updateUserApi(userId, userData);
            set((state) => ({
                users: state.users.map((user) => (user._id === userId ? updatedUser : user)),
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to update user' });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    deleteUser: async (userId) => {
        set({ loading: true, error: null });
        try {
            await deleteUserApi(userId);
            set((state) => ({
                users: state.users.filter((user) => user._id !== userId),
                total: state.total - 1,
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete user' });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
}));