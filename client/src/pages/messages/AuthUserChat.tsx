import { FC, useState } from 'react';
import styles from './AuthUserChat.module.css';
import { IMAGE_MESSAGE_BASE_URL } from '../../constants/common.constants';
import { getTimeAMPM } from '../../utils/helpers.utils';
import PopUpMenu from '../../components/ui/PopUpMenu';
import faReply from '../../assets/faReply-solid-grey.svg';

interface AuthUserChatProps {
    conversation: any;
    imgRef: any;
    messageStatus: Function;
    isLoading: boolean;
    messageOption: any;
    messageIcon: any;
    onClickMessageOption: Function;
    isMessageRead: boolean;
    handleImageLoad: () => void;
}

const AuthUserChat: FC<AuthUserChatProps> = ({
    conversation,
    imgRef,
    messageStatus,
    isLoading,
    messageOption,
    messageIcon,
    onClickMessageOption,
    isMessageRead,
    handleImageLoad,
}) => {
    const [isMenuHovered, setIsMenuHovered] = useState<boolean>(false);
    const [isMenuHoveredWithImage, setIsMenuHoveredWithImage] =
        useState<boolean>(false);

    const replyMessage = conversation.originalMessage;

    return (
        <>
            {conversation?.image && (
                <div
                    className={`${styles.imageAuthUserContainer}`}
                    onMouseEnter={() => setIsMenuHoveredWithImage(true)}
                    onMouseLeave={() => setIsMenuHoveredWithImage(false)}
                >
                    {isMenuHoveredWithImage && (
                        <div className={styles.threeDotsWithImage}>
                            <PopUpMenu
                                itemId={conversation?._id}
                                options={messageOption}
                                icons={messageIcon}
                                onClick={(menuOptions, id) =>
                                    onClickMessageOption!(menuOptions, id)
                                }
                                classNamePopUpBox={styles.popUpBoxWithImage}
                                classNameMenuItemList={
                                    styles.popUpListWithImage
                                }
                            />
                        </div>
                    )}

                    <div
                        className={`${styles.imageAuthUser} ${
                            !conversation?.text
                                ? styles.textStatusAndTimeAuthUser
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
                            <div className={styles.textStatusAndTimeAuthUser}>
                                <p>
                                    {getTimeAMPM(conversation?.createdAt)}{' '}
                                    {messageStatus()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {conversation?.text && (
                <div
                    className={styles.authUser}
                    onMouseEnter={() => setIsMenuHovered(true)}
                    onMouseLeave={() => setIsMenuHovered(false)}
                >
                    {isMenuHovered && (
                        <div
                            className={`${styles.threeDots} ${
                                conversation.image ? styles.hide : ''
                            } ${replyMessage?.text ? styles.popUpReply : ''}`}
                        >
                            <PopUpMenu
                                itemId={conversation?._id}
                                options={messageOption}
                                icons={messageIcon}
                                onClick={(menuOptions, id) =>
                                    onClickMessageOption!(menuOptions, id)
                                }
                                className={styles.popuContainer}
                                classNamePopUpBox={styles.popUpBox}
                                classNameMenuItemList={styles.popUpList}
                            />
                        </div>
                    )}
                    <div className={styles.textWrapper}>
                        {replyMessage?.text && (
                            <div key={replyMessage._id}>
                                <div className={styles.replyMessage}>
                                    <div className={styles.replyImages}>
                                        <img src={faReply} alt="" />
                                    </div>
                                    <p>Replying to</p>
                                </div>

                                <div className={styles.originalMessage}>
                                    <p>{replyMessage?.text}</p>
                                </div>
                            </div>
                        )}
                        <div className={styles.authUserText}>
                            {conversation?.text}
                        </div>
                        <div className={styles.textStatusAndTimeAuthUser}>
                            <span>
                                {getTimeAMPM(conversation?.createdAt)}{' '}
                                {messageStatus()}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AuthUserChat;
