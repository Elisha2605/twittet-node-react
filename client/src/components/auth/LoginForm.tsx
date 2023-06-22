import React, { FC } from "react";
import styles from "./LoginForm.module.css";
import Button, { ButtonSize, ButtonType } from "../ui/Button";

interface LoginFormProps {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    serverError: string;
    isLoading: boolean;
    register: any;
    errors: any
}

const LoginForm: FC<LoginFormProps> = ({ 
    onSubmit,
    serverError,
    isLoading,
    register,
    errors,
}) => {


    return (
        <React.Fragment>
            <form className={styles.container} onSubmit={onSubmit}>
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
                            }
                        )}
                        className={styles.formInput}
                        type="password"
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
                    isLoading={isLoading}
                />
            </form>
        </React.Fragment>
    )
}

export default LoginForm;

