import React, { FC, useContext } from 'react';
import styles from './Index.module.css';
import hero from '../../assets/hero.png';
import TwitterIcon from '../../components/icons/TwitterIcon';
import Modal from '../../components/ui/Modal';
import Signup from '../../components/auth/Signup';
import Login from '../../components/auth/Login';
import { ModalContext } from '../../context/modal.context';
import { useNavigate } from 'react-router-dom';

const Index: FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const { openModal } = useContext(ModalContext);
    const navigate = useNavigate();

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
                        onClick={() => openModal('Signup')}
                    >
                        Signup
                    </div>
                    <div
                        className={styles.login}
                        onClick={() => openModal('Login')}
                    >
                        Login
                    </div>
                    <Modal
                        title={'Signup'}
                        modalName={'Signup'}
                        isOverlay={true}
                        logo={true}
                        isXmarkLeft={false}
                    >
                        <Signup />
                    </Modal>
                    {/* {(signupSuccess || loginModalOpen) && ( */}
                    <Modal
                        title={'Login'}
                        modalName={'Login'}
                        isOverlay={true}
                        logo={true}
                        isXmarkLeft={false}
                    >
                        <Login onSuccess={onSuccess} />
                    </Modal>
                    {/* )} */}
                    <div className={styles.termsAndService}>
                        <p>
                            This is a fake/clone Twitter app. It's part of my
                            web development Bachelor Exam 2023. Feel free to
                            sign up with a fake <span>email address</span> and{' '}
                            <span>password</span>. By singing up, you agree to
                            the{' '}
                            <span onClick={() => navigate('/terms-of-service')}>
                                Terms of Service
                            </span>{' '}
                            and{' '}
                            <span onClick={() => navigate('/terms-of-service')}>
                                Privacy Policy
                            </span>
                            , including
                            <span onClick={() => navigate('/terms-of-service')}>
                                Cookie Use
                            </span>
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
