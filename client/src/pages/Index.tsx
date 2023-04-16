import React, { useEffect, useRef, useState } from 'react';
import styles from './Index.module.css';
import hero from '../assets/hero.png';
import TwitterIcon from '../components/icons/TwitterIcon';
import Modal from '../components/ui/Modal';
import Signup from '../components/auth/Signup';


const Index = () => {
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const signupModalRef = useRef<HTMLDivElement>(null);
    const loginModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.addEventListener('mousedown', hadleClikOUtside);
        return () => {
            document.removeEventListener('mousedown', hadleClikOUtside);
        };
    }, [signupModalRef]);

    const hadleClikOUtside = (e: MouseEvent) => {
        if (
            (signupModalRef.current &&
                !signupModalRef.current.contains(e.target as Node)) ||
            (loginModalRef.current &&
                !loginModalRef.current.contains(e.target as Node))
        ) {
            setSignupModalOpen(false);
            setLoginModalOpen(false);
        }
    };
    
    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.showcase}>
                    <img src={hero} alt="" />
                </div>
                <div className={styles.left}>
                    <TwitterIcon
                        size={'2xl'}
                        color={'var(--color-white)'}
                        className={styles.twitterIcon}
                    />
                    <h1>Happening now</h1>
                    <h2>Join Twitter today.</h2>
                    <div
                        className={styles.signup}
                        onClick={() => setSignupModalOpen(true)}
                    >
                        Signup
                    </div>
                    <div 
                        className={styles.login}
                        onClick={() => setLoginModalOpen(true)}
                    >Login</div>
                    <Modal
                        title={'Singup'}
                        modalRef={signupModalRef}
                        isOpen={signupModalOpen}
                        onClose={() => setSignupModalOpen(false)}
                        isOverlay={true}
                    >
                        <Signup />
                    </Modal>
                    <Modal
                        modalRef={loginModalRef}
                        isOpen={loginModalOpen}
                        onClose={() => setSignupModalOpen(false)}
                        isOverlay={true}
                    >
                        Login
                    </Modal>
                    <div className={styles.termsAndService}>
                        <p>
                            By singing up, you agree to the
                            <span>Terms of Service</span> and{' '}
                            <span>Privacy Policy</span>, including{' '}
                            <span>Cookie Use</span>
                        </p>
                    </div>
                </div>
                <div className={styles.footer}>
                    <ul>
                        <li>
                            <a href="#">About</a>
                        </li>
                        <li>
                            <a href="#">Help center</a>
                        </li>
                        <li>
                            <a href="#">Terms of service</a>
                        </li>
                        <li>
                            <a href="#">Privacy policy</a>
                        </li>
                        <li>
                            <a href="#">Cooki policy</a>
                        </li>
                        <li>
                            <a href="#">Ads info</a>
                        </li>
                        <li>
                            <a href="#">Blog</a>
                        </li>
                        <li>
                            <a href="#">Status</a>
                        </li>
                        <li>
                            <a href="#">Careers</a>
                        </li>
                        <li>
                            <a href="#">Brand resources</a>
                        </li>
                        <li>
                            <a href="#">Adverstising</a>
                        </li>
                        <li>
                            <a href="#">Marketing</a>
                        </li>
                        <li>
                            <a href="#">Twitter for Business</a>
                        </li>
                        <li>
                            <a href="#">Developers</a>
                        </li>
                        <li>
                            <a href="#">Directory</a>
                        </li>
                        <li>
                            <a href="#">Settings</a>
                        </li>
                        <li>
                            <a href="#">Settings</a>
                        </li>
                        <p>&copy; 2023 Bachelor project</p>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Index;
