import axiosInstance from './axios';
import type { AssignRolePayload } from '../types';

export const assignRole = (payload: AssignRolePayload) =>
  axiosInstance.post('/role/assign', payload);
