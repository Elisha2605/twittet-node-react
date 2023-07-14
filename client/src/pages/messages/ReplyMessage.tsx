import React from 'react';
import styles from './ReplyMessage.module.css';
import XmarkIcon from '../../components/icons/XmarkIcon';
import { IMAGE_MESSAGE_BASE_URL } from '../../constants/common.constants';

interface ReplyMessageProps {
    replyMessage?: any;
    onCloseReplyMessage: () => void;
}

const ReplyMessage: React.FC<ReplyMessageProps> = ({ replyMessage, onCloseReplyMessage }) => {

    return (
        <div className={styles.container}>
            <div className={styles.nameAndText}>
                <p className={styles.name}>{replyMessage?.sender?.name}</p>
                <p className={styles.text}>{replyMessage?.text}</p>
            </div>
            <div className={styles.imageAndCancelBtn}>
                <div className={styles.image}>
                    {replyMessage?.image && (
                        <img
                            src={`${IMAGE_MESSAGE_BASE_URL}/${replyMessage?.image}`
                            }
                            alt=""
                        />
                    )}
                </div>
                <XmarkIcon size={'xl'} onClick={onCloseReplyMessage} />
            </div>
        </div>
    );
};

export default ReplyMessage;
