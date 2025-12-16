import { type RouteObject, Navigate } from "react-router-dom";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Dashboard from "../pages/Dashboard";
import ProtectedLayout from "../components/ProtectedLayout";
import KanbanBoard from "@/pages/KanbanBoard";
import SearchResult from "@/pages/SearchResult";
import EmailDetailPage from "@/pages/EmailDetailPage";

export const routeConfig: RouteObject[] = [
    // Public routes
    {
        path: "/login",
        element: <SignIn />,
    },
    {
        path: "/signup",
        element: <SignUp />,
    },
    // Protected routes
    {
        path: "/",
        element: <ProtectedLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "kanban",
                element: <KanbanBoard />,
            },
            {
                path: "search",
                element: <SearchResult />,
            },
            {
                path: "email/:emailId",
                element: <EmailDetailPage />,
            },
        ],
    },
];
