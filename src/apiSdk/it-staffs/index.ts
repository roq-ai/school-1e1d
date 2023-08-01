import axios from 'axios';
import queryString from 'query-string';
import { ItStaffInterface, ItStaffGetQueryInterface } from 'interfaces/it-staff';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getItStaffs = async (query?: ItStaffGetQueryInterface): Promise<PaginatedInterface<ItStaffInterface>> => {
  const response = await axios.get('/api/it-staffs', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createItStaff = async (itStaff: ItStaffInterface) => {
  const response = await axios.post('/api/it-staffs', itStaff);
  return response.data;
};

export const updateItStaffById = async (id: string, itStaff: ItStaffInterface) => {
  const response = await axios.put(`/api/it-staffs/${id}`, itStaff);
  return response.data;
};

export const getItStaffById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/it-staffs/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteItStaffById = async (id: string) => {
  const response = await axios.delete(`/api/it-staffs/${id}`);
  return response.data;
};
