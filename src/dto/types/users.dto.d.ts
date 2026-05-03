import type { Role } from '@/types/role'

export interface UserDTO {
    _id?: string;
    name: string;
    userName: string;
    email: string;
    password: string;
    role: Role;
    createdAt?: string;
}