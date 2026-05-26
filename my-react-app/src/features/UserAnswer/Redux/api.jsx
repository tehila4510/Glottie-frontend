import { baseApi } from '../../../app/baseApi'; 

export const userAnswerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/UserAnswer
    getAllUserAnswers: builder.query({
      query: () => "/UserAnswer/my-answers",
      providesTags: ["UserAnswer"],
    }),

    // GET /api/UserAnswer/{id}
    getUserAnswerById: builder.query({
      query: (id) => `/UserAnswer/${id}`,
      providesTags: (result, error, id) => [{ type: "UserAnswer", id }],
    }),

    // POST /api/UserAnswer
    addUserAnswer: builder.mutation({
      query: (userAnswer) => {
        const formData = new FormData();
        for (const key in userAnswer) {
          formData.append(key, userAnswer[key]);
        }
        return {
          url: "/UserAnswer",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["UserAnswer"],

      async onQueryStarted(newUserAnswer, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userAnswerApi.util.updateQueryData(
            "getAllUserAnswers",
            undefined,
            (draft) => {
              draft.push(newUserAnswer);
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // PUT /api/UserAnswer/{id}
    updateUserAnswer: builder.mutation({
      query: ({ id, userAnswer }) => ({
        url: `/UserAnswer/${id}`,
        method: "PUT",
        body: userAnswer,
        headers: {
          "Content-Type": "application/json",
        },
      }),

      invalidatesTags: (result, error, arg) => [
        { type: "UserAnswer", id: arg.id },
      ],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userAnswerApi.util.updateQueryData(
            "getAllUserAnswers",
            undefined,
            (draft) => {
              const index = draft.findIndex((u) => u.answerId === arg.id);
              if (index !== -1) {
                draft[index] = { ...draft[index], ...arg.userAnswer };
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // DELETE /api/UserAnswer/{id}
    deleteUserAnswer: builder.mutation({
      query: (id) => ({
        url: `/UserAnswer/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["UserAnswer"],

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userAnswerApi.util.updateQueryData(
            "getAllUserAnswers",
            undefined,
            (draft) => draft.filter((u) => u.answerId !== id),
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetAllUserAnswersQuery,
  useGetUserAnswerByIdQuery,
  useAddUserAnswerMutation,
  useUpdateUserAnswerMutation,
  useDeleteUserAnswerMutation,
} = userAnswerApi;
