"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import CustomButton from "@/components/Button/CustomButton";
import {router} from "next/client";

const Dashboard = () => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchUsername = () => {
            try {
                const token = localStorage.getItem("accessToken");

                if (!token) {
                    console.warn("No token found in localStorage.");
                    return;
                }


                const decoded: any = jwtDecode(token);
                console.log("Decoded Token:", decoded);

                const extractedUsername = decoded.name;

                setUsername(extractedUsername);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        };

        fetchUsername();
    }, []);

    const handleLogout = () =>{
        localStorage.removeItem("accessToken");
        router.push("/login");
    }

    return (
        <ProtectedRoute>
            <div>
                <h1>Hello, {username}</h1>

                <CustomButton
                    buttonLabel={"LogOut"}
                    buttonClassName="w-full py-3 text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg h-10"
                    onClick={handleLogout}
                />
            </div>
        </ProtectedRoute>
    );
};

export default Dashboard;
