import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'admin' | 'clinic_user' | null;

interface AuthState {
    token: string | null;
    role: Role | null;
    clinicId: string | null;
    username: string | null;
    setAuth: (token: string, role: Role, clinicId?: string, username?: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            role: null,
            clinicId: null,
            username: null,
            setAuth: (token, role, clinicId, username) =>
                set({ token, role, clinicId: clinicId ?? null, username: username ?? null }),
            logout: () => set({ token: null, role: null, clinicId: null, username: null }),
        }),
        {
            name: 'auth-storage', // key for localStorage
        }
    )
);
