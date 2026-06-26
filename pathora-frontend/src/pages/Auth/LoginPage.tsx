import AuthLayout from "../../components/layout/AuthLayout.tsx";
import LoginForm from "../../components/auth/LoginForm.tsx";
import { useAuth } from "../../hooks/useAuth.ts";

const LoginPage = () => {
    const { login, isSubmitting, error } = useAuth();

    return (
        <AuthLayout title="Sign In" subtitle="Enter your account details to continue">
            <LoginForm onSubmit={login} isSubmitting={isSubmitting} error={error} />
        </AuthLayout>
    );
};

export default LoginPage;
