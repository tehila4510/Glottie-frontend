import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { userApi } from "../features/User/Redux/api";
import userReducer, {
  setUser,
  updateCurrentUser,
  logout,
} from "../features/User/Redux/userSlice";
import { userAnswerApi } from "../features/UserAnswer/Redux/api";
import { questionApi } from "../features/Question/Redux/api";
import { skillApi } from "../features/Skill/Redux/api";
import { userSkillProgressApi } from "../features/UserSkillProgress/Redux/api";
import { questionOptionApi } from "../features/Option/Redux/api";
import { sessionApi } from "../features/Session/Redux/api";
import { quizApi } from "../features/Quiz/Redux/api";

import { toast } from 'react-toastify';

const persistenceMiddleware = createListenerMiddleware();
persistenceMiddleware.startListening({
  predicate: (action) =>
    [setUser.type, updateCurrentUser.type, logout.type].includes(action.type),
  effect: (action, listenerApi) => {
    const state = listenerApi.getState().user;

    if (action.type === logout.type) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } else {
      if (state.token) localStorage.setItem("token", state.token);
      if (state.currentUser)
        localStorage.setItem("user", JSON.stringify(state.currentUser));
    }
  },
});

const rtkQueryErrorLogger = (api) => (next) => (action) => {
  if (action.type.endsWith('/rejected')) {
    const errorData = action.payload?.data;
    
    const message = errorData?.message || errorData?.title || "An unexpected error occurred";    
    toast.error(message);
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [userAnswerApi.reducerPath]: userAnswerApi.reducer,
    [userSkillProgressApi.reducerPath]: userSkillProgressApi.reducer,
    [questionApi.reducerPath]: questionApi.reducer,
    [questionOptionApi.reducerPath]: questionOptionApi.reducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [skillApi.reducerPath]: skillApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(persistenceMiddleware.middleware)
      .concat(
        userApi.middleware,
        userAnswerApi.middleware,
        userSkillProgressApi.middleware,
        questionApi.middleware,
        questionOptionApi.middleware,
        sessionApi.middleware,
        skillApi.middleware,
        quizApi.middleware,
        rtkQueryErrorLogger 
      ),
});