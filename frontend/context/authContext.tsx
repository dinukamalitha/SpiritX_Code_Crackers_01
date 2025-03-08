"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setUser(decoded.username || decoded.sub);
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
    }, []);

    // Redirect user to dashboard when they log in
    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const login = (token: string) => {
        localStorage.setItem("accessToken", token);
        try {
            const decoded: any = jwtDecode(token);
            const username = decoded.username || decoded.sub;
            setUser(username);
            router.push( "/dashboard");
        } catch (error) {
            console.error("Token decoding failed:", error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
        router.replace("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
