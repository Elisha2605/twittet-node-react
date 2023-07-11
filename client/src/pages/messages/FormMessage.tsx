import React, { useEffect, useRef, useState } from 'react';
import styles from './FormMessage.module.css';
import ImageIcon from '../../components/icons/ImageIcon';
import EmojiIcon from '../../components/icons/EmojiIcon';
import faPaperPlane from '../../assets/faPaperPlane-regular.svg';
import { sendMessage } from '../../api/message.api';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import useClickOutSide from '../../hooks/useClickOutSide';
import XmarkIcon from '../../components/icons/XmarkIcon';

interface FormMessageProps {
    socket: any;
    authUser: any;
    currentUser: any;
    onSendMessage: (message: any) => void;
}

const FormMessage: React.FC<FormMessageProps> = ({
    socket,
    authUser,
    currentUser,
    onSendMessage,
}) => {
    const [selectedEmoji, setSelectedEmoji] = useState<any>();
    const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
    const [message, setMessage] = useState('');

    // Message Form states
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useClickOutSide(emojiPickerRef, setOpenEmojiPicker);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setMessage(event.target.value);
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
            setMessage(newText);
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

        // ToDo: validation

        //send message
        const res = await sendMessage(currentUser?._id, message, selectedFile);
        const { msg } = res;
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
        }

        onSendMessage(msg);
        setMessage('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        if (previewImage) {
            clearTweetForm();
        }
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
    }
    const handleCanselPreviewImage = () => {
        setSelectedFile(null);
        setPreviewImage(null);
    };

    return (
        <form encType="multipart/form-data"
            className={`${styles.formContainer} ${
                previewImage ? styles.formContainerWithImage : ''
            }`}
            onSubmit={handleSubmitForm}
            onKeyDown={handleKeyDown}
        >
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
                        <button type="submit" className={styles.btnWithImage}>
                            <img
                                className={styles.disable}
                                src={faPaperPlane}
                                alt=""
                            />
                        </button>
                    </div>
                    <textarea
                        ref={textareaRef}
                        className={styles.inputWithImage}
                        placeholder="Start a new message"
                        value={message}
                        onChange={(e: any) => {
                            handleInputChange(e);
                        }}
                    />
                </div>
            ) : (
                <div className={styles.formWrapper}>
                    <div className={styles.icons}>
                        <ImageIcon onChange={handleImageUpload} name={'messageImage'} />
                        <EmojiIcon onClick={() => setOpenEmojiPicker(true)} />
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
                        value={message}
                        onChange={(e: any) => {
                            handleInputChange(e);
                        }}
                    />
                    <button type="submit" className={styles.btn}>
                        <img
                            className={styles.disable}
                            src={faPaperPlane}
                            alt=""
                        />
                    </button>
                </div>
            )}
        </form>
    );
};

export default FormMessage;
