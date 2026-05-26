import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi"; 
import userReducer, {
  setUser,
  updateCurrentUser,
  logout,
} from "../features/User/Redux/userSlice";
import quizReducer from "../features/Quiz/Redux/quizSlice";

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
    [baseApi.reducerPath]: baseApi.reducer, // רדיוסר אחד לכולם
    user: userReducer,
    quiz: quizReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(persistenceMiddleware.middleware)
      .concat(
        baseApi.middleware, // Middleware אחד לכולם
        rtkQueryErrorLogger 
      ),
});