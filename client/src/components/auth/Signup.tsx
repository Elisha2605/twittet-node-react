import React, { FC } from "react";
import styles from "./Signup.module.css";
import SignupForm from "./SignupForm";


const Signup: FC<{ onSuccess: () => void }> = ({ 
     onSuccess,
}) => {

    return (
        <React.Fragment>
            <SignupForm onSuccess={onSuccess} />
        </React.Fragment>
    )
}

export default Signup;

