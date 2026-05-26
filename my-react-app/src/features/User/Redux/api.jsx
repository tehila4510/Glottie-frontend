import { baseApi } from '../../../app/baseApi'; 

export const userApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // ---------- REGISTER ----------
    registerUser: builder.mutation({
  query: (newUser) => {
    console.log("FormData entries:");
    for (let pair of newUser.entries()) {
      console.log(pair[0], pair[1]);
    }

    return {
      url: "/User/register",
      method: "POST",
      body: newUser,
    };
  },
  invalidatesTags: ['Users'],
}),

    // ---------- LOGIN ----------
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/User/login",
        method: "POST",
        body: credentials,
      }),
    }),
    
    // ---------- UPDATE ----------
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/User/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // ---------- DELETE ----------
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/User/${id}`,
        method: "DELETE",
      }),
    }),
    getUser: builder.query({
  query: (id) => `/User/${id}`,
  providesTags: ['Users'],
}),

  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLazyGetUserQuery,
} = userApi;