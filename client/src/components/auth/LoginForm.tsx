import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./LoginForm.module.css";
import { login } from "../../api/auth.api";
import Button, { ButtonSize, ButtonType } from "../ui/Button";

interface LoginFormProps {
    onSuccess: () => void;
}

const LoginForm: FC<LoginFormProps> = ({ 
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
            <form className={styles.container} onSubmit={handleSubmitForm}>
            {serverError.length > 0 && (
                        <p className={styles.serverErrorMsg}>{serverError}</p>
                    )} 
                <div className={`${styles.inputWrapper} ${errors.email ? styles.inputError : ''}`}>
                    <input
                        {...register("email", { required: "Email field is required." })}
                        className={styles.formInput}
                        type="text"
                        id="email"
                        name="email"
                        placeholder=" "
                    />
                    <label className={styles.formLabel} htmlFor="email">
                        Email
                    </label>
                    {errors.email && 
                        <p className={styles.errorMsg}>{errors.email?.message}</p>
                    }   
                </div>
                <div className={`${styles.inputWrapper} ${errors.password ? styles.inputError : ''}`}>
                    <input
                        {...register("password", 
                            {
                                required: "Password field required",
                                minLength: { value: 1, message: "password must be at least 4 characters"}
                            }
                        )}
                        className={styles.formInput}
                        type="text"
                        id="password"
                        name="password"
                        placeholder=" "
                    />
                    <label className={styles.formLabel} htmlFor="password">
                        Password
                    </label>
                    {errors.password && 
                        <p className={styles.errorMsg}>{errors.password?.message}</p>
                    }
                </div>
                <Button
                    value={'Login'}
                    type={ButtonType.tietary}
                    size={ButtonSize.big}
                    onClick={() => {}}
                    loading={isLoading}
                />
            </form>
        </React.Fragment>
    )
}

export default LoginForm;

