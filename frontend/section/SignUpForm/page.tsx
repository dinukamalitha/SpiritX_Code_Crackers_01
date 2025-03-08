"use client";

import React, { FormEvent, useState } from "react";
import InputField from "@/components/InputField/InputField";
import CustomButton from "@/components/Button/CustomButton";
import { userSignUp } from "@/apis/authAPI";
import { SignupSchema } from "@/schema/signupSchema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AlertDialogComponent from "@/components/AlertDialog/AlertDialog";

interface SignUpFormValues {
    username: string;
    password: string;
    confirmPassword: string;
}

const SignupForm = () => {
    const [formData, setFormData] = useState<SignUpFormValues>({
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");

    const router = useRouter();

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        value: keyof SignUpFormValues
    ) => {
        const newValue = e.target.value;
        setFormData({
            ...formData,
            [value]: newValue,
        });

        if (value === "password") {
            evaluatePasswordStrength(newValue);
        }
    };

    const evaluatePasswordStrength = (password: string) => {
        if (password.length < 6) {
            setPasswordStrength("Weak");
        } else if (
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
        ) {
            setPasswordStrength("Strong");
        } else {
            setPasswordStrength("Moderate");
        }
    };

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();

        if (passwordStrength === "Weak") {
            setErrors("Password is too weak. Please use a stronger password.");
            return;
        }

        const validation = SignupSchema.safeParse(formData);

        if (!validation.success) {
            setErrors(validation.error.errors[0]?.message || "Invalid input");
            return;
        }

        setLoading(true);
        try {
            await userSignUp(formData, router);
            console.log("Username: ", formData.username, "Password: ", formData.password);
            setFormData({
                username: "",
                password: "",
                confirmPassword: "",
            });
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
                <img className="h-124 w-auto" src="/auth.png" alt="SignUp Image" />
            </div>

            {/* Right Section (SignUp Form) */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="bg-white p-10 rounded-lg shadow-lg w-3/4">
                    <div className="flex items-center justify-center mb-6">
                        <h2 className="text-4xl font-bold">Sign Up</h2>
                    </div>

                    <form onSubmit={handleSignUp}>
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
                                    labelName="password"
                                />
                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <p className="text-sm">Password Strength:</p>
                                        <div
                                            className={`h-2 mt-1 rounded-lg ${
                                                passwordStrength === "Weak"
                                                    ? "bg-red-500"
                                                    : passwordStrength === "Moderate"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"
                                            }`}
                                            style={{ width: passwordStrength === "Weak" ? "33%" : passwordStrength === "Moderate" ? "66%" : "100%" }}
                                        />
                                        <p className="text-sm mt-1 font-semibold text-gray-700">
                                            {passwordStrength}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <InputField
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange(e, "confirmPassword")}
                                    icon={undefined}
                                    label={false}
                                    labelName="confirmPassword"
                                />
                            </div>
                        </div>

                        {/* Sign Up Button */}
                        <div className="mt-6">
                            <CustomButton
                                buttonLabel={loading ? "Signing up..." : "Sign Up"}
                                buttonClassName="w-full h-10 py-3 text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg"
                            />
                        </div>
                    </form>

                    {/* Error Message */}
                    {errors && <p className="text-red-500 text-center mt-4">{errors}</p>}

                    {/* Login Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-500">
                            Already Registered?{" "}
                            <Link className="text-blue-600 font-semibold" href="../../login">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Alert Dialog */}
            {showAlert && (
                <AlertDialogComponent
                    title="Sign Up Successful!"
                    description="You will be redirected to the login page."
                    onConfirm={() => router.push("/login")}
                />
            )}
        </div>
    );
};

export default SignupForm;
