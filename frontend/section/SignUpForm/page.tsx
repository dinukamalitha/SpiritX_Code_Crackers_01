"use client";

import React, {FormEvent, useState} from "react";
import InputField from "@/components/InputField/InputField";
import CustomButton from "@/components/Button/CustomButton";
import {userSignUp} from "@/apis/authAPI";
import {SignupSchema} from "@/schema/signupSchema";
import Link from "next/link";
import {useRouter} from "next/navigation";

interface SignUpFormValues {
    username: string;
    password: string;
    confirmPassword: string;
}

const SignupForm = () => {

    const [formData, setFormData] = useState<SignUpFormValues>({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState('');
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, value: keyof SignUpFormValues) => {
        setFormData({
            ...formData,
            [value]: e.target.value
        });
    }

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();

        const validation = SignupSchema.safeParse(formData);

        if (!validation.success) {
            setErrors(validation.error.errors[0]?.message || "Invalid input");
            return;
        }
        setLoading(true);
        try {
            await userSignUp(formData,router);
            console.log("Username: ", formData.username, "Password: ", formData.password);
            setFormData({
                username: '',
                password: '',
                confirmPassword: ''
            });
        } catch (error: unknown) {
            console.log(error);
            setErrors("Invalid input");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen bg-pink-50">
            {/* Left Section */}
            <div className="w-1/2 flex flex-col items-center justify-center">
                <img className="h-18 w-auto" src="../../assets/images/auth.png" alt="SignUp Image"/>
            </div>

            {/* Right Section (Login Form) */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="bg-white p-10 rounded-lg shadow-lg w-3/4">
                    <div className="flex items-center justify-center mb-6">
                        <div>
                            <h2 className="text-4xl font-bold">SignUp</h2>
                        </div>
                    </div>

                    <form onSubmit={handleSignUp}>
                        {/* Input Fields */}
                        <div className="my-8">
                            <div className="mb-4 mt-4">
                                <InputField
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={formData.username || ''}
                                    onChange={(e) => handleInputChange(e, 'username')}
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
                                    value={formData.password || ''}
                                    onChange={(e) => handleInputChange(e, 'password')}
                                    icon={undefined}
                                    label={false}
                                    labelName="password"
                                />
                            </div>

                            <div className="mb-4">
                                <InputField
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword || ''}
                                    onChange={(e) => handleInputChange(e, 'confirmPassword')}
                                    icon={undefined}
                                    label={false}
                                    labelName="confirmPassword"
                                />
                            </div>

                        </div>

                        {/* SignUp Button */}
                        <div className="mt-6">
                            <CustomButton
                                buttonLabel={loading ? "Signing in..." : "SignUp"}
                                buttonClassName="w-full h-10 py-3 text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg"
                            />
                        </div>
                    </form>

                    {/* Error Message */}
                    {errors && <p className="text-red-500 text-center mt-4">{errors}</p>}

                    {/* Register Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-500">
                            Already Registered ?
                            <Link className="text-blue-600 font-semibold" href="../../login">
                                Login
                            </Link>

                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
