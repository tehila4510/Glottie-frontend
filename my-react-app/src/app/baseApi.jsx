import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../features/User/Redux/userSlice';
import { API_BASE_URL } from './config';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState()).user?.token; 
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers; 
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Question', 'Session', 'UserAnswer', 'UserSkillProgress', 'Users', 'Quiz', 'Skill', 'Option'],
  endpoints: () => ({}),
});