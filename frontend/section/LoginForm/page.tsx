"use client";

import React, { FormEvent, useState } from "react";
import InputField from "@/components/InputField/InputField";
import CustomButton from "@/components/Button/CustomButton";
import { LoginSchema } from "@/schema/loginSchema";
import { userLogin } from "@/apis/authAPI";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AlertDialogComponent from "@/components/AlertDialog/AlertDialog";

interface LoginFormValues {
    username: string;
    password: string;
}

const LoginForm = () => {
    const [formData, setFormData] = useState<LoginFormValues>({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const router = useRouter();

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        value: keyof LoginFormValues
    ) => {
        setFormData({
            ...formData,
            [value]: e.target.value,
        });
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        const validation = LoginSchema.safeParse(formData);

        if (!validation.success) {
            setErrors(validation.error.errors[0]?.message || "Invalid input");
            return;
        }

        setLoading(true);
        setErrors(null);

        try {
            await userLogin(formData, router);

            console.log("Username: ", formData.username, "Password: ", formData.password);

            setFormData({ username: "", password: "" });

            setShowAlert(true);
        } catch (error: unknown) {
            console.log(error);
            setErrors("Invalid input");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-pink-50">
            {/* Left Section */}
            <div className="w-1/2 flex flex-col items-center justify-center">
                <img className="h-124 w-auto" src="/auth.png" alt="Login Image" />
            </div>

            {/* Right Section (Login Form) */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="bg-white p-10 rounded-lg shadow-lg w-3/4">
                    <div className="flex items-center justify-center mb-6">
                        <h2 className="text-4xl font-bold">Login</h2>
                    </div>

                    <form onSubmit={handleLogin}>
                        {/* Input Fields */}
                        <div className="my-8">
                            <div className="mb-4 mt-4">
                                <InputField
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange(e, "username")}
                                    icon={undefined}
                                    label={false}
                                    labelName="username"
                                />
                            </div>
                            <div className="mb-4">
                                <InputField
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange(e, "password")}
                                    icon={undefined}
                                    label={false}
                                    labelName=""
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <div className="mt-6">
                            <CustomButton
                                buttonLabel={loading ? "Logging in..." : "Continue"}
                                buttonClassName="w-full py-3 text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg h-10"
                            />
                        </div>
                    </form>

                    {errors && <p className="text-red-500 text-center mt-4">{errors}</p>}

                    <div className="text-center mt-6">
                        <p className="text-gray-500">
                            New User?{" "}
                            <Link className="text-blue-600 font-semibold" href="../../signup">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Alert Dialog */}
            {showAlert && (
                <AlertDialogComponent
                    title="Login Successful!"
                    description="You will be redirected to your dashboard."
                    onConfirm={() => router.push("/dashboard")}
                />
            )}
        </div>
    );
};

export default LoginForm;
