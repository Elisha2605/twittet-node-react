import React, { FC, useEffect, useState } from "react";
import styles from "./Login.module.css";
import LoginForm from "./LoginForm";
import { useForm } from "react-hook-form";
import { login } from "../../api/auth.api";


const Login: FC<{ onSuccess: () => void }> = ({ 
    onSuccess,
}) => {

    const [serverError, setServerError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const handleSubmitForm = handleSubmit(async (data: any) => {   
        setLoading(true);       
        const formData = await login(
            data.email,
            data.password,
        );
        if (!formData.success) {
            const { message } = formData;
            console.log(message);
            setServerError(message);
            setLoading(false);
            return;
        }
        onSuccess();
        console.log(formData);
        setLoading(false)
    });

    useEffect(() => {
        if (serverError.length > 0) {
            reset({ password: '' }); // clear form input values
        }
    }, [serverError]);


    return (
        <React.Fragment>
            <LoginForm 
                onSubmit={handleSubmitForm} 
                serverError={serverError} 
                isLoading={isLoading} 
                register={register} 
                errors={errors}
            />
        </React.Fragment>
    )
}

export default Login;

