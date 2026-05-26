import { baseApi } from '../../../app/baseApi'; // ייבוא הבסיס המשותף

export const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/Question
    getAllQuestions: builder.query({
      query: () => '/Question',
      providesTags: ['Question'],
    }),

    // GET /api/Question/{id} 
    getQuestionById: builder.query({
      query: (id) => `/Question/${id}`,
      providesTags: (result, error, id) => [{ type: 'Question', id }],
    }),

    // POST /api/Question 
    addQuestion: builder.mutation({
      query: (question) => {
        const formData = new FormData();
        for (const key in question) {
          formData.append(key, question[key]);
        }
        return {
          url: '/Question',
          method: 'POST',
          body: formData
        };
      },

      invalidatesTags: ['Question'],

      async onQueryStarted(newQuestion, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          questionApi.util.updateQueryData(
            'getAllQuestions',
            undefined,
            (draft) => {
              draft.push(newQuestion);
            }
          )
        );

        try {
          await queryFulfilled; 
        } catch {
          patchResult.undo(); 
        }
      }
    }),

    // PUT /api/Question/{id} 
    updateQuestion: builder.mutation({
      query: ({ id, question }) => ({
        url: `/Question/${id}`,
        method: 'PUT',
        body: question,
        headers: {
          'Content-Type': 'application/json'
        }
      }),

      invalidatesTags: (result, error, arg) => [{ type: 'Question', id: arg.id }],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          questionApi.util.updateQueryData(
            'getAllQuestions',
            undefined,
            (draft) => {
              const index = draft.findIndex(q => q.id === arg.id);
              if (index !== -1) {
                draft[index] = { ...draft[index], ...arg.question };
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),

    // DELETE /api/Question/{id}
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/Question/${id}`,
        method: 'DELETE'
      }),

      invalidatesTags: ['Question'],

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          questionApi.util.updateQueryData(
            'getAllQuestions',
            undefined,
            (draft) => {
              return draft.filter(q => q.id !== id);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    })

  })
});

export const {
  useGetAllQuestionsQuery,
  useGetQuestionByIdQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation
} = questionApi;