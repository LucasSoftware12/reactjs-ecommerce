import axiosInstance from './axios';
import type { LoginPayload, RegisterPayload } from '../types';

export const login = (payload: LoginPayload) =>
  axiosInstance.post('/auth/login', payload);

export const register = (payload: RegisterPayload) =>
  axiosInstance.post('/auth/register', payload);
