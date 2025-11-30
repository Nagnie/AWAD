/**
 * Hook để handle auth-related events
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./redux";
import { logout } from "@/store/authSlice";

export const useAuthListener = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleAuthFailed = () => {
            dispatch(logout());
            navigate("/signin", { replace: true });
        };

        window.addEventListener("auth-failed", handleAuthFailed);

        return () => {
            window.removeEventListener("auth-failed", handleAuthFailed);
        };
    }, [dispatch, navigate]);
};
