import axiosInstance from './axios';

export const getProfile = () => axiosInstance.get('/user/profile');
