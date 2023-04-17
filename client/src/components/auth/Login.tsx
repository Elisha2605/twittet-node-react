import React, { FC } from "react";
import styles from "./Login.module.css";
import LoginForm from "./LoginForm";


const Login: FC<{ onSuccess: () => void }> = ({ 
    onSuccess,
}) => {

    return (
        <React.Fragment>
            <LoginForm onSuccess={onSuccess} />
        </React.Fragment>
    )
}

export default Login;

