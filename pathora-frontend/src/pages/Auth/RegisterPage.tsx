import AuthLayout from "../../components/layout/AuthLayout.tsx";
import RegisterForm from "../../components/auth/RegisterForm.tsx";
import { useAuth } from "../../hooks/useAuth.ts";

const RegisterPage = () => {
    const { register, isSubmitting, error } = useAuth();

    return (
        <AuthLayout title="Sign Up" subtitle="Enter your details to create a new account">
            <RegisterForm onSubmit={register} isSubmitting={isSubmitting} error={error} />
        </AuthLayout>
    );
};

export default RegisterPage;
