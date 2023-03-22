import { CircularProgress } from "@mui/material";
import { getAuth } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const auth = getAuth();

    useEffect(() => {
        const unsubscribed = auth.onIdTokenChanged((user) => {
            console.log("[From AuthProvider]", user);
            if (user?.uid) {
                setUser(user);
                if (user.accessToken !== localStorage.getItem("accessToken")) {
                    localStorage.setItem("accessToken", user.accessToken);
                    window.location.reload(); // Reload lại trang để lấy lại dữ liệu mới nhất
                }
                setIsLoading(false);
                return;
            }

            // Reset user when logout
            setIsLoading(false);
            setUser({});
            localStorage.clear();
            navigate("/login");
        });

        return () => {
            unsubscribed();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {isLoading ? <CircularProgress /> : children}
        </AuthContext.Provider>
    );
}
