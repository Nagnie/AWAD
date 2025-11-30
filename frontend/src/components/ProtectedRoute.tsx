import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { accessToken, isInitialized } = useAppSelector((state) => state.auth);
    const location = useLocation();

    // Chưa hoàn thành initialization
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
        );
    }

    // Đã hoàn thành initialization nhưng không có access token -> redirect to login
    if (!accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Có access token -> render protected content
    return <>{children}</>;
}
