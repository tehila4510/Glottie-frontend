import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessionId: null,
  phase: 'idle', // 'idle' | 'loading' | 'question' | 'feedback' | 'result'
  question: null,
  questionCount: 0,
  correctCount: 0,
  feedback: null,
  sessionResult: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startNewQuiz: (state, action) => {
      state.sessionId = action.payload;
      state.questionCount = 0;
      state.correctCount = 0;
      state.phase = 'loading';
    },
    setNextQuestion: (state, action) => {
      state.question = action.payload;
      state.questionCount += 1;
      state.phase = 'question';
      state.feedback = null;
    },
    setFeedback: (state, action) => {
      state.feedback = action.payload;
      state.phase = 'feedback';
      if (action.payload.isCorrect) {
        state.correctCount += 1;
      }
    },
    setQuizResult: (state, action) => {
      state.sessionResult = action.payload;
      state.phase = 'result';
    },
    resetQuiz: () => initialState,
  },
});

export const { startNewQuiz, setNextQuestion, setFeedback, setQuizResult, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;