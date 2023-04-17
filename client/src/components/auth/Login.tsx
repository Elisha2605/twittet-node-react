import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./Login.module.css";
import { login } from "../../api/auth.api";
import Button, { ButtonSize, ButtonType } from "../ui/Button";

interface LoginProps {
    
}

const Login: FC<{}> = ({ 

}) => {

    const [ form, setForm ] = useState();
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const handleSubmitForm = handleSubmit(async (data: any) => {          
        const formData = await login(
            data.email,
            data.password,
        );
        console.log(formData);
        const { message } = formData;
        setForm(formData)
    });

    useEffect(() => {
        reset({ password: '' }); // clear form input values
    }, [form]);

    return (
        <React.Fragment>
            <form className={styles.container} onSubmit={handleSubmitForm}>
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
                    value={'Signup'}
                    type={ButtonType.tietary}
                    size={ButtonSize.big}
                    onClick={() => {}}
                />
            </form>
        </React.Fragment>
    )
}

export default Login;

