import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Index.module.css";
import { getNewContext, logout, singup, login } from "../api/auth.api";
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AuthContext from "../context/user.context";

const Index = () => {

    const ctx = useContext(AuthContext)
    

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);

    const logEmailRef = useRef<HTMLInputElement>(null);
    const logPasswordRef = useRef<HTMLInputElement>(null);

    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    
    const onSingupHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = await singup( 
            emailRef.current?.value || '',
            passwordRef.current?.value || '',
            passwordConfirmRef.current?.value || ''
        )
        
        console.log(formData);  
    }

    const onLoginHanlder = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = await login(
            logEmailRef.current?.value || '',
            logPasswordRef.current?.value || ''
        )
        // navigate('/');
        console.log(formData);
    }

    const onLogout = async () => {
        const res = await logout();
        console.log(res);
    }

    return (
        <React.Fragment>
            <div className={styles.container}>
                <h1>Signup</h1>
                <form action="" className={styles.formControl} onSubmit={onSingupHandler}>
                    <label htmlFor="">Email</label>
                    <input ref={emailRef} type="email" />
                    <label htmlFor="">Passwold</label>
                    <input ref={passwordRef} type="text" />
                    <label htmlFor="">Repeat passowrd</label>
                    <input ref={passwordConfirmRef} type="text" />
                    <button className={styles.btn}>Singup</button>
                </form>

                <h1>Login</h1>
                {!loggedIn && (
                    <form action="" className={styles.formControl} onSubmit={onLoginHanlder}>
                        <label htmlFor="">Email</label>
                        <input ref={logEmailRef} type={'email'} />
                        <label htmlFor="">Passwold</label>
                        <input ref={logPasswordRef} type="text" />
                        <button className={styles.btn}>Login</button>
                    </form>
                )}
                {!loggedIn && (
                    <div>Successfully logged in</div>
                )}
                

                <h1>Logout</h1>
                <button className={styles.btn} onClick={onLogout}>Logout</button>
            </div>
        </React.Fragment>
    )
}

export default Index;

