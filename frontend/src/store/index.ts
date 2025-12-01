import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { authMiddleware } from "@/store/middleware/authMiddleware.ts";
import { mailboxesApi } from "@/services/mailboxes/api";
import { emailApi } from "@/services/email/api";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [mailboxesApi.reducerPath]: mailboxesApi.reducer,
        [emailApi.reducerPath]: emailApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .prepend(authMiddleware.middleware)
            .concat(mailboxesApi.middleware)
            .concat(emailApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
