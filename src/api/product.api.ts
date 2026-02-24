import axiosInstance from './axios';
import type { ProductDetailsPayload } from '../types';

export const getAllProducts = () => axiosInstance.get('/product');

export const getProduct = (id: number) =>
  axiosInstance.get(`/product/${id}`);

export const createProduct = (categoryId: number) =>
  axiosInstance.post('/product/create', { categoryId });

export const addProductDetails = (id: number, body: ProductDetailsPayload) =>
  axiosInstance.post(`/product/${id}/details`, body);

export const activateProduct = (id: number) =>
  axiosInstance.post(`/product/${id}/activate`);

export const deleteProduct = (id: number) =>
  axiosInstance.delete(`/product/${id}`);
