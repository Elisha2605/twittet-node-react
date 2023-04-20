import React, { FC, useEffect, useState } from 'react';
import styles from './SignupForm.module.css';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import { useForm } from 'react-hook-form';
import { singup } from '../../api/auth.api';
import { validateFileExtension } from '../../utils/formValidation.utils';


interface SignupFormProps {
    onSuccess: () => void;
}

const SignupForm: FC<SignupFormProps> = ({
    onSuccess,
}) => {

    const [ form, setForm ] = useState();
    const [serverError, setServerError] = useState('');
    const [isLoading, setLoading] = useState(false);


    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            email: "",
            avatar: null,
            password: "",
            passwordConfirm: "",
        }
    });

    // Check passwords match
    const passwordMatch = (value: any) => {
        const { password, passwordConfirm } = getValues();
        return password === passwordConfirm || "Passwords do not match";
    };

    const handleSubmitForm = handleSubmit(async (data: any) => {         
        setLoading(true);       
        const formData = await singup(
            data.email,
            data.avatar ? data.avatar?.[0] : undefined,
            data.password,
            data.passwordConfirm
        );
        if (!formData.success) {
            const { message } = formData
            console.log(message);
            setServerError(message);
            setLoading(false);
            return;
        }
        console.log(formData);
        setForm(formData)
        onSuccess();
        setLoading(false)
    });

    useEffect(() => {
        reset(); // clear form input values
    }, [form]);

    return (
        <React.Fragment>
            <form className={styles.container} onSubmit={handleSubmitForm}>
                {serverError.length > 0 && (
                    <p className={styles.serverErrorMsg}>{serverError}</p>
                )} 
                {/* <div className={styles.inputWrapper}>
                    <input
                        {...register("name")}
                        className={styles.formInput}
                        type="text"
                        id="name"
                        name="name"
                        placeholder=" "
                    />
                    <label className={styles.formLabel} htmlFor="name">
                        Name
                    </label>
                </div> */}
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
                <div className={`${styles.inputWrapper} ${errors.passwordConfirm ? styles.inputError : ''}`}>
                    <input
                        {...register("passwordConfirm", 
                            {
                                required: "Confirm password field required",
                                validate: passwordMatch,
                                minLength: { value: 1, message: "confirm password must be at least 4 characters"}
                            }
                        )}
                        className={styles.formInput}
                        type="text"
                        id="passwordConfirm"
                        name="passwordConfirm"
                        placeholder=" "
                    />
                    <label
                        className={styles.formLabel}
                        htmlFor="passwordConfirm"
                    >
                        Confirm password
                    </label>
                    {errors.passwordConfirm && 
                        <p className={styles.errorMsg}>{errors.passwordConfirm.message || "Passwords do not match"}
                    </p>}
                </div>
                <div className={`${styles.inputWrapper} ${errors.avatar ? styles.inputError : ''}`}>
                    <input
                        {...register("avatar", { validate: validateFileExtension })} 
                        type="file" 
                        name="avatar" 
                    />
                    {errors.avatar && (
                        <p className={styles.errorMsg}>{errors.avatar?.message || "Invalid file type"}</p>
                    )}
                </div>
                <Button
                    value={'Signup'}
                    type={ButtonType.tietary}
                    size={ButtonSize.big}
                    onClick={() => {}}
                    loading={isLoading}
                />
            </form>
        </React.Fragment>
    );
};

export default SignupForm;
