import React, { useEffect, useRef, useState } from 'react';
import styles from './FormMessage.module.css';
import ImageIcon from '../../components/icons/ImageIcon';
import EmojiIcon from '../../components/icons/EmojiIcon';
import faPaperPlane from '../../assets/faPaperPlane-regular.svg';
import { sendMessage } from '../../api/message.api';

interface FormMessageProps {
    socket: any;
    authUser: any;
    currentUser: any;
    onSendMessage: (message: any) => void;
}

const FormMessage: React.FC<FormMessageProps> = ({ socket, authUser, currentUser, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        if (e.key === "Enter") {
            handleSubmitForm(e);
        }
    }

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();   

        // ToDo: validation

        //send message
        const res = await sendMessage(currentUser?._id, message);
        const { msg } = res

        if (res.success) {
        // ToDo: send real time msg
            socket.emit('sendMessage', {
                sender: authUser,
                receiver: currentUser?._id,
                message: msg,
            });

        // ToDo: send real time notification
        }

        onSendMessage(msg);
        setMessage('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmitForm} onKeyDown={handleKeyDown}>
            <div className={styles.formWrapper}>
                <div className={styles.icons}>
                    <ImageIcon onChange={() => {}} />
                    <EmojiIcon onClick={() => {}} />
                </div>
                <textarea
                    ref={textareaRef}
                    className={styles.input}
                    placeholder="Start a new message"
                    value={message}
                    onChange={handleInputChange}
                />
                <button type="submit" className={styles.btn}>
                    <img className={styles.disable} src={faPaperPlane} alt="" />
                </button>
            </div>
        </form>
    );
};

export default FormMessage;
