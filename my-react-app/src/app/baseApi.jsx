import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../features/User/Redux/userSlice'; // וודא שהנתיב נכון

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://localhost:7185/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState()).user?.token; 
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
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
  baseQuery: baseQueryWithReauth, // משתמשים במעטפת החדשה
  tagTypes: ['Question', 'Session', 'UserAnswer', 'UserSkillProgress', 'Users', 'Quiz', 'Skill', 'Option'],
  endpoints: () => ({}),
});