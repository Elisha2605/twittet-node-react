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

interface FormProps {
    value: string;
    textRef: React.RefObject<HTMLTextAreaElement>;
    imagePreview: string | null;

    onSubmit: (e: React.FormEvent) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChageImage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCancelImagePreview: () => void;

}

const FormTweet: FC<FormProps> = ({
    value,
    textRef,
    imagePreview,

    onSubmit,
    onImageUpload,
    onChageImage,
    onCancelImagePreview
}) => {


    return (
        <React.Fragment>
            <form action="" className={styles.container} onSubmit={onSubmit}>
                <textarea
                    className={styles.textarea}
                    id="review-text"
                    onChange={onChageImage}
                    placeholder="What's happening?"
                    ref={textRef}
                    rows={1}
                    value={value}
                />
                {imagePreview && (
                    <div className={styles.previewImage}>
                        <XmarkIcon className={styles.cancelBtn} size={'lg'} 
                            onClick={onCancelImagePreview}/>
                        <img src={imagePreview} alt='preview tweet img' />
                    </div>
                )}
                <div className={styles.footer}>
                    <div className={styles.icons}>
                        <ImageIcon onChange={onImageUpload} />
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
