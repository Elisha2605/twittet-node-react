import React, { useContext, useEffect, useState } from 'react';
import styles from './email.module.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/user.context';
import Header from '../../../components/header/Header';
import HeaderTitle from '../../../components/header/HeaderTitle';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import { useForm } from 'react-hook-form';
import Button, { ButtonSize, ButtonType } from '../../../components/ui/Button';

const Email: React.FC<{}> = () => {
    const [user, setUser] = useState<any>(null);
    const [email, setName] = useState('');


    const navigate = useNavigate();

    const [serverError, setServerError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            email: user?.email as string,
        }
    });

    const handleSubmitForm = handleSubmit(async (data: any) => {   
        setLoading(true);       
        console.log(data);
        setLoading(false)
    });

    useEffect(() => {
        setName(user?.email || '');
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
                        <HeaderTitle title={'Change email'} />
                    </div>
                </div>
            </Header>
            <div className={styles.main}>
                <form className={styles.formControl} onSubmit={handleSubmitForm}>
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
                                value={email}
                                onChange={(e) => setName(e.target.value)}
                                contentEditable={true}
                            />
                            <label className={styles.formLabel} htmlFor="email">
                                Email
                            </label>
                            {errors.email && 
                                <p className={styles.errorMsg}>{errors.email?.message}</p>
                            }   
                        </div> 
                        <Button
                            value={'Save'}
                            type={ButtonType.primary}
                            size={ButtonSize.small}
                            isDisabled={email === user?.email ? true : false}
                            className={styles.btn}
                            onClick={() => {}}
                        /> 
                </form>
            </div>
        </React.Fragment>
    );
};

export default Email;
