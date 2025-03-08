import axios from "axios";
import {useRouter} from "next/navigation";


const api = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_BASE_URL
    baseURL: "http://localhost:8086"
});

export const userLogin = async (formData: {
    username: string;
    password: string;
}, router: ReturnType<typeof useRouter>) => {

    try {
        const response = await api.post("/auth/login", {
            username: formData.username,
            password: formData.password
        });

        if (response.status === 200) {

            const token = response.data.token;
            console.log(token);
            localStorage.setItem('accessToken', token);

            // Decode the token
            function parseJwt(token: string) {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                return JSON.parse(jsonPayload);
            }

            // Get the decoded token
            const decodedToken = parseJwt(token);
            console.log('Decoded Token:', decodedToken);

            // Extract role
            const userRole = decodedToken.role;
            console.log('User Role:', userRole);

            // Redirect based on role
            if (userRole === 'Admin') {
                router.push("/admin/adminDashboard");
            } else if (userRole === 'Customer') {
                router.push("/");
            } else if (userRole === 'Delivery') {
                router.push("/delivery/profile");
            } else {
                alert("error")
            }


        }
    } catch (error) {
        // setErrors("Invalid username or password.");
        console.error("Login failed:", error);
    }
}


export const userSignUp = async (formData: {
                                     username: string;
                                     password: string;
                                     confirmPassword: string
                                 },
                                 router: ReturnType<typeof useRouter>
) => {
    try {
        const response = await api.post("/auth/signup", {
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
        });

        if (response.status === 200) {
            console.log("SignUp Successful:");
            router.push("/auth/login");
        }
    } catch (error) {
        // setErrors("Invalid username or password.");
        console.error("SignUp failed:", error);
    }
}
