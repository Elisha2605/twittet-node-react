import { FC, useState } from 'react';
import styles from './OtherUserChat.module.css';
import { IMAGE_MESSAGE_BASE_URL } from '../../constants/common.constants';
import { getTimeAMPM } from '../../utils/helpers.utils';
import PopUpMenu from '../../components/ui/PopUpMenu';
import faReply from '../../assets/faReply-solid-grey.svg';

interface OtherUserChatProp {
    conversation: any;
    imgRef: any;
    isLoading: boolean;
    messageStatus: Function;
    messageOption: any;
    messageIcon: any;
    onClickMessageOption: Function;
    handleImageLoad: () => void;
}

const OtherUserChat: FC<OtherUserChatProp> = ({
    conversation,
    imgRef,
    handleImageLoad,
    messageStatus,
    isLoading,
    messageOption,
    messageIcon,
    onClickMessageOption,
}) => {
    const [isMenuHovered, setIsMenuHovered] = useState<boolean>(false);
    const [isMenuHoveredWithImage, setIsMenuHoveredWithImage] =
        useState<boolean>(false);

    const replyMessage = conversation.originalMessage;

    console.log(replyMessage);

    return (
        <>
            {conversation?.image && (
                <div
                    className={styles.imageOtherUserContainer}
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
                            </p>
                        )}
                    </div>
                </div>
            )}
            {conversation?.text && (
                <div
                    className={styles.OtherUser}
                    onMouseEnter={() => setIsMenuHovered(true)}
                    onMouseLeave={() => setIsMenuHovered(false)}
                >
                    <div className={styles.textWrapper}>
                        {replyMessage?.text ||
                            (replyMessage?.image && (
                                <div key={replyMessage._id}>
                                    <div className={styles.replyMessage}>
                                        <div className={styles.replyImages}>
                                            <img src={faReply} alt="" />
                                        </div>
                                        <p>Replying to</p>
                                    </div>

                                    <div className={styles.originalMessage}>
                                        <img
                                            src={
                                                replyMessage.image
                                                    ? `${IMAGE_MESSAGE_BASE_URL}/${replyMessage.image}`
                                                    : undefined
                                            }
                                            alt=""
                                        />
                                        <p>{replyMessage?.text}</p>
                                    </div>
                                </div>
                            ))}
                        <div className={styles.otherUserText}>
                            <p>{conversation?.text}</p>
                        </div>
                        <p className={styles.textStatusAndTimeOtherUser}>
                            <span>{getTimeAMPM(conversation?.createdAt)}</span>
                        </p>
                    </div>
                    {isMenuHovered && (
                        <div
                            className={`${styles.threeDots} ${
                                conversation.image ? styles.hide : ''
                            }`}
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
                </div>
            )}
        </>
    );
};

export default OtherUserChat;
