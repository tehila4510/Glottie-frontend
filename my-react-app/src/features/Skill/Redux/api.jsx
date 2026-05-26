// src/features/Skill/Redux/api.jsx
import { baseApi } from '../../../app/baseApi';

export const skillApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSkills: builder.query({
      query: () => '/Skill',
      providesTags: ['Skill'],
    }),

    getSkillById: builder.query({
      query: (id) => `/Skill/${id}`,
      providesTags: (result, error, id) => [{ type: 'Skill', id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllSkillsQuery,
  useGetSkillByIdQuery,
} = skillApi;