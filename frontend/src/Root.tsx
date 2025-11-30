import { useEffect } from "react";
import { store } from "./store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./components/theme-provider";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { initializeAuth, setInitialized } from "./store/authSlice";
import App from "./App";

const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || "mock-google-client-id-for-development";

/**
 * Inner component để initialize auth
 */
function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const { isInitialized, user } = useAppSelector((state) => state.auth);

    // Initialize auth on app load - chỉ chạy một lần khi component mount
    useEffect(() => {
        const abortController = new AbortController();

        // Nếu không có user, không cần initialize (sẽ redirect đến login)
        if (!user) {
            // Manually set isInitialized to true để cho phép app load
            // User sẽ được redirect đến /login bởi ProtectedRoute
            dispatch(setInitialized());
        } else {
            // Nếu có user, cố gắng refresh token
            // Truyền abort signal để có thể cancel request nếu component unmount
            dispatch(initializeAuth()).finally(() => {
                // Nếu refresh token fail, isInitialized đã được set true bởi reducer
                // App sẽ render và ProtectedRoute sẽ redirect về login
            });
        }

        // Cleanup: Cancel request nếu component unmount trước khi hoàn thành
        return () => {
            abortController.abort();
        };
    }, [dispatch]);

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

const Root = () => {
    return (
        <Provider store={store}>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <AuthInitializer>
                        <App />
                    </AuthInitializer>
                </ThemeProvider>
            </GoogleOAuthProvider>
        </Provider>
    );
};

export default Root;
