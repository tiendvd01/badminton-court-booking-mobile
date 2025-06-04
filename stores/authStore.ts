import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '@/types/common';

type AuthState = {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean | null;
  login: (user: IUser, token: string) => Promise<void>;
  logout: () => Promise<void>;
  initUserFromAsyncStorage: () => Promise<void>;
  setUser: (user: IUser) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => {
  const login = async (user: IUser, token: string) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('token', token);
    set({
      user,
      token,
      isAuthenticated: true,
    });
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  const initUserFromAsyncStorage = async () => {
    const user = await AsyncStorage.getItem('user');
    const token = await AsyncStorage.getItem('token');
    if (user && token) {
      set({
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
      });
    } else {
      set({
        isAuthenticated: false,
      });
    }
  };

  const setUser = async (user: IUser) => {
    set({
      user,
    });
    await AsyncStorage.setItem('user', JSON.stringify(user));
  };

  return {
    user: null,
    token: null,
    isAuthenticated: null,
    login,
    logout,
    initUserFromAsyncStorage,
    setUser,
  };
});
