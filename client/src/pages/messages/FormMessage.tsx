import React, { useEffect, useRef, useState } from 'react';
import styles from './FormMessage.module.css';
import ImageIcon from '../../components/icons/ImageIcon';
import EmojiIcon from '../../components/icons/EmojiIcon';
import faPaperPlane from '../../assets/faPaperPlane-regular.svg';
import faPaperPlaneDisable from '../../assets/faPaperPlane-disabled.svg';
import { sendMessage } from '../../api/message.api';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import useClickOutSide from '../../hooks/useClickOutSide';
import XmarkIcon from '../../components/icons/XmarkIcon';
import LoadingRing from '../../components/ui/LoadingRing';
import ReplyMessage from './ReplyMessage';

interface FormMessageProps {
    socket: any;
    authUser: any;
    currentUser: any;
    replyMessage: any | null;
    setReplyMessage: any;
    onSendMessage: (message: any) => void;
}

const FormMessage: React.FC<FormMessageProps> = ({
    socket,
    authUser,
    currentUser,
    replyMessage,
    setReplyMessage,
    onSendMessage,
}) => {
    const [selectedEmoji, setSelectedEmoji] = useState<any>();
    const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
    const [messageValue, setMessageValue] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>();
    const [showReplyMessage, setShowReplyMessage] = useState<boolean>();

    // Message Form states
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useClickOutSide(emojiPickerRef, setOpenEmojiPicker);

    const isDisabled = messageValue.length > 0;

    const handleInputChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setMessageValue(event.target.value);
        adjustTextareaHeight();
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            handleSubmitForm(e);
        }
    };

    const handleEmojiSelect = (emoji: any) => {
        const textarea = textareaRef.current;
        setSelectedEmoji(emoji.native);
        if (textarea) {
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            const text = textarea.value;
            const newText =
                text.substring(0, startPos) +
                emoji.native +
                text.substring(endPos);
            setMessageValue(newText);
            textarea.focus();
            textarea.setSelectionRange(
                startPos + emoji.native.length,
                startPos + emoji.native.length
            );
            setOpenEmojiPicker(false);
        }
    };

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // ToDo: validation

        //send message
        const res = await sendMessage(
            currentUser?._id,
            messageValue,
            selectedFile,
            replyMessage ?? replyMessage
        );
        const { msg } = res;
        console.log(msg);
        if (res.success) {
            // ToDo: send real time msg
            socket.emit('sendMessage', {
                sender: authUser,
                receiver: currentUser?._id,
                message: msg,
            });
            socket.emit('sendMessageNotification', {
                sender: authUser,
                receiver: currentUser?._id,
                message: msg,
            });
            setIsLoading(false);
        }

        onSendMessage(msg);
        setMessageValue('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        if (previewImage) {
            clearTweetForm();
        }
        clearTweetForm();
        setIsLoading(false);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
            let imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const clearTweetForm = () => {
        setSelectedFile(null);
        setPreviewImage(null);
        setShowReplyMessage(false);
        setReplyMessage(null);
    };
    const handleCanselPreviewImage = () => {
        setSelectedFile(null);
        setPreviewImage(null);
    };

    useEffect(() => {
        if (replyMessage) {
            setShowReplyMessage(true);
            textareaRef.current?.focus();
        }
    }, [replyMessage]);

    const handleCloseReplyMessage = () => {
        setShowReplyMessage(false);
        setReplyMessage(null);
    };

    return (
        <React.Fragment>
            <form
                encType="multipart/form-data"
                className={`${styles.formContainer} ${
                    previewImage ? styles.formContainerWithImage : ''
                }`}
                onSubmit={handleSubmitForm}
                onKeyDown={handleKeyDown}
            >
                {showReplyMessage && (
                    <ReplyMessage
                        replyMessage={replyMessage}
                        onCloseReplyMessage={handleCloseReplyMessage}
                    />
                )}

                {previewImage ? (
                    <div className={styles.previewImage}>
                        <div className={styles.previewImageWrapper}>
                            <img
                                id={previewImage}
                                src={previewImage}
                                alt="preview message img"
                            />
                            <XmarkIcon
                                className={styles.cancelBtn}
                                size={'lg'}
                                onClick={handleCanselPreviewImage}
                            />
                            {!isLoading && (
                                <button
                                    type="submit"
                                    className={`${styles.btnWithImage}`}
                                >
                                    <img
                                        className={styles.disable}
                                        src={faPaperPlane}
                                        alt=""
                                    />
                                </button>
                            )}

                            {isLoading && (
                                <button
                                    type="submit"
                                    className={`${styles.btnWithImage}`}
                                >
                                    <LoadingRing size={'small'} />
                                </button>
                            )}
                        </div>
                        <textarea
                            ref={textareaRef}
                            className={styles.inputWithImage}
                            placeholder="Start a new message"
                            value={messageValue}
                            onChange={(e: any) => {
                                handleInputChange(e);
                            }}
                        />
                    </div>
                ) : (
                    <div className={styles.formWrapper}>
                        <div className={styles.icons}>
                            <ImageIcon
                                onChange={handleImageUpload}
                                name={'messageImage'}
                            />
                            <EmojiIcon
                                onClick={() => setOpenEmojiPicker(true)}
                            />
                            {openEmojiPicker && (
                                <div
                                    ref={emojiPickerRef}
                                    className={styles.emojiPicker}
                                >
                                    <Picker
                                        data={data}
                                        onEmojiSelect={handleEmojiSelect}
                                    />
                                </div>
                            )}
                        </div>
                        <textarea
                            ref={textareaRef}
                            className={styles.input}
                            placeholder="Start a new message"
                            value={messageValue}
                            onChange={(e: any) => {
                                handleInputChange(e);
                            }}
                        />
                        <button
                            type="submit"
                            className={`${styles.btn} ${
                                !isDisabled && styles.disabled
                            }`}
                            disabled={!isDisabled}
                        >
                            {!isLoading && (
                                <img
                                    className={styles.disable}
                                    src={
                                        !isDisabled
                                            ? faPaperPlaneDisable
                                            : faPaperPlane
                                    }
                                    alt=""
                                />
                            )}
                            {isLoading && <LoadingRing size={'small'} />}
                        </button>
                    </div>
                )}
            </form>
        </React.Fragment>
    );
};

export default FormMessage;
