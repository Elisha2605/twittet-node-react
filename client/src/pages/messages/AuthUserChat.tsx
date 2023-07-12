import { FC } from 'react';
import styles from './AuthUserChat.module.css';
import { IMAGE_MESSAGE_BASE_URL } from '../../constants/common.constants';
import { getTimeAMPM } from '../../utils/helpers.utils';

interface AuthUserChatProps {
    conversation: any;
    imgRef: any;
    handleImageLoad: () => void;
    messageStatus: Function;
    isLoading: boolean;
}

const AuthUserChat: FC<AuthUserChatProps> = ({
    conversation,
    imgRef,
    handleImageLoad,
    messageStatus,
    isLoading,
}) => {
    return (
        <>
            {conversation?.image && (
                <div>
                    <div
                        className={`${styles.imageAuthUser} ${
                            !conversation?.text
                                ? styles.textStatusAndTimeAuthUserNoImage
                                : ''
                        }`}
                    >
                        <img
                            ref={imgRef}
                            src={
                                conversation.image
                                    ? `${IMAGE_MESSAGE_BASE_URL}/${conversation.image}`
                                    : undefined
                            }
                            alt=""
                            onLoad={handleImageLoad}
                        />
                        {!conversation?.text && (
                            <p
                                className={
                                    styles.textStatusAndTimeAuthUserNoImage
                                }
                            >
                                <span>
                                    {getTimeAMPM(conversation?.createdAt)}
                                </span>{' '}
                                {messageStatus()}
                            </p>
                        )}
                    </div>
                </div>
            )}
            {conversation?.text && (
                <div className={styles.authUser}>
                    <p className={styles.authUserText}>{conversation?.text}</p>
                    <p className={styles.textStatusAndTimeAuthUser}>
                        <span>{getTimeAMPM(conversation?.createdAt)}</span>{' '}
                        {messageStatus()}
                    </p>
                </div>
            )}
        </>
    );
};

export default AuthUserChat;
