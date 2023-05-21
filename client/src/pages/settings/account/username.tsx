import React, { useContext, useEffect, useState } from 'react';
import styles from './username.module.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/user.context';
import Header from '../../../components/header/Header';
import HeaderTitle from '../../../components/header/HeaderTitle';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import { useForm } from 'react-hook-form';
import Button, { ButtonSize, ButtonType } from '../../../components/ui/Button';

const Username: React.FC<{}> = () => {
    const [user, setUser] = useState<any>(null);
    const [username, setUsername] = useState('');


    const navigate = useNavigate();

    const [serverError, setServerError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            username: user?.username as string,
        }
    });

    const handleSubmitForm = handleSubmit(async (data: any) => {   
        setLoading(true);       
        console.log(data);
        setLoading(false)
    });

    useEffect(() => {
        setUsername(user?.username || '');
    }, [user])
    // get auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setUser(user);
        };
        getAuthUser();
    }, []);

    return (
        <React.Fragment>
            <Header>
                <div className={styles.headerContainerRight}>
                    <div className={styles.headerWrapper}>
                        <ArrowLeftIcon
                            onClick={() => {
                                navigate(-1);
                            }}
                        />
                        <HeaderTitle title={'Change username'} />
                    </div>
                </div>
            </Header>
            <div className={styles.main}>
            <form className={styles.formControl} onSubmit={handleSubmitForm}>
                    {serverError.length > 0 && (
                                <p className={styles.serverErrorMsg}>{serverError}</p>
                            )} 
                        <div className={`${styles.inputWrapper} ${errors.username ? styles.inputError : ''}`}>
                            <input
                                {...register("username", { required: "username field is required." })}
                                className={styles.formInput}
                                type="text"
                                id="username"
                                name="username"
                                placeholder=" "
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                contentEditable={true}
                            />
                            <label className={styles.formLabel} htmlFor="username">
                                Username
                            </label>
                            {errors.username && 
                                <p className={styles.errorMsg}>{errors.username?.message}</p>
                            }   
                        </div> 
                        <Button
                            value={'Save'}
                            type={ButtonType.primary}
                            size={ButtonSize.small}
                            isDisabled={username === user?.username ? true : false}
                            className={styles.btn}
                            onClick={() => {}}
                        /> 
                </form>
            </div>
        </React.Fragment>
    );
};

export default Username;
