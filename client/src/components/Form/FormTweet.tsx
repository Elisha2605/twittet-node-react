import React, { FC, useRef, useState } from 'react';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import styles from './FormTweet.module.css';
import EmojiIcon from '../icons/EmojiIcon';
import ImageIcon from '../icons/ImageIcon';
import CalendarIcon from '../icons/CalendarIcon';
import XmarkIcon from '../icons/XmarkIcon';
import { useForm } from 'react-hook-form';
import { createTweet } from '../../api/tweet.api';

interface FormProps {}

const FormTweet: FC<FormProps> = ({}) => {
    const [value, setValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, value);

    const handleImageOnChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;
        setValue(val);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file)
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const handleCanselPreviewImage = () => {
        if (previewImage) {
            setPreviewImage(null);
          }
    }

    const handleSubmitTweet = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = textAreaRef.current?.value ? textAreaRef.current?.value : '';
        const image = selectedFile;
        console.log(image);
        await createTweet(text, selectedFile);
        setSelectedFile(null);
        setPreviewImage(null);
        setValue('')
    };

    return (
        <React.Fragment>
            <form action="" className={styles.container} onSubmit={handleSubmitTweet}>
                <textarea
                    className={styles.textarea}
                    id="review-text"
                    onChange={handleImageOnChange}
                    placeholder="What's happening?"
                    ref={textAreaRef}
                    rows={1}
                    value={value}
                />
                {previewImage && (
                    <div className={styles.previewImage}>
                        <XmarkIcon className={styles.cancelBtn} size={'lg'} 
                            onClick={handleCanselPreviewImage}/>
                        <img src={previewImage} alt='preview tweet img' />
                    </div>
                )}
                <div className={styles.footer}>
                    <div className={styles.icons}>
                        <ImageIcon onChange={handleImageUpload} />
                        <EmojiIcon />
                        <CalendarIcon />
                    </div>
                    <Button
                        value={'Tweet'}
                        type={ButtonType.primary}
                        size={ButtonSize.small}
                        onClick={() => {}}
                    />
                </div>
            </form>
        </React.Fragment>
    );
};

export default FormTweet;
