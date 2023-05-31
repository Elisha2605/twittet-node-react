import React, { FC, useContext, useEffect, useState } from "react";
import SignupForm from "./SignupForm";
import { useForm } from "react-hook-form";
import { singup } from "../../api/auth.api";
import { ModalContext } from "../../context/modal.context";


const Signup: FC<{}> = ({ }) => {

    const [ form, setForm ] = useState();
    const [serverError, setServerError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const { openModal } = useContext(ModalContext);


    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            passwordConfirm: "",
            avatar: null,
        }
    });

    // Check passwords match
    const passwordMatch = () => {
        const { password, passwordConfirm } = getValues();
        return password === passwordConfirm || "Passwords do not match";
    };

    const handleSubmitForm = handleSubmit(async (data: any) => {         
        setLoading(true);       
        console.log(data.avatar?.[0]);
        const formData = await singup(
            data.name,
            data.username,
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
        openModal('Login')
        setForm(formData)
        setLoading(false)
    });

    useEffect(() => {
        reset(); // clear form input values
    }, [form]);


    return (
        <React.Fragment>
            <SignupForm 
                errors={errors} 
                serverError={serverError} 
                register={register} 
                isLoading={isLoading} 
                onSubmit={handleSubmitForm}
                passwordMatch={passwordMatch}
            />
        </React.Fragment>
    )
}

export default Signup;

