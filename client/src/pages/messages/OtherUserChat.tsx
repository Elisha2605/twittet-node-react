import { FC } from 'react';
import styles from './OtherUserChat.module.css';
import { IMAGE_MESSAGE_BASE_URL } from '../../constants/common.constants';
import { getTimeAMPM } from '../../utils/helpers.utils';

interface OtherUserChatProp {
    conversation: any;
    imgRef: any;
    handleImageLoad: () => void;
    messageStatus: Function;
    isLoading: boolean;
}

const OtherUserChat: FC<OtherUserChatProp> = ({
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
                        className={`${styles.imageOtherUser} ${
                            !conversation?.text
                                ? styles.otherUserWithNoText
                                : null
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
                                    styles.textStatusAndTimeOtherUserNoImage
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
                <>
                    <div className={styles.otherUserText}>
                        <p>{conversation?.text}</p>
                    </div>
                    <p className={styles.textStatusAndTimeOtherUser}>
                        <span>{getTimeAMPM(conversation?.createdAt)}</span>
                    </p>
                </>
            )}
        </>
    );
};

export default OtherUserChat;
